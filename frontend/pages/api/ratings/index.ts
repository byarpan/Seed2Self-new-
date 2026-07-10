import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { value, comment, reviewerId, revieweeId, requestId } = req.body;

      if (!value || !reviewerId || !revieweeId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (requestId) {
        // Check if request exists and is DELIVERED
        const request = await prisma.request.findUnique({
          where: { id: requestId }
        });

        if (!request) {
          return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "DELIVERED") {
          return res.status(400).json({ message: "You can only rate after delivery is completed." });
        }
      } else {
        // Direct profile rating - Check reviewer role and duplicate ratings
        const reviewer = await prisma.user.findUnique({
          where: { id: reviewerId }
        });

        const reviewee = await prisma.user.findUnique({
          where: { id: revieweeId }
        });

        if (!reviewer || !reviewee) {
          return res.status(404).json({ message: "Reviewer or reviewee not found" });
        }

        let isAuthorized = false;
        if (reviewee.role === "FARMER" && reviewer.role === "PROCESSOR") {
          isAuthorized = true;
        } else if (reviewee.role === "PROCESSOR" && reviewer.role === "DISTRIBUTOR") {
          isAuthorized = true;
        } else if (reviewee.role === "DISTRIBUTOR" && reviewer.role === "RETAILER") {
          isAuthorized = true;
        } else if (reviewee.role === "RETAILER" && ["CUSTOMER", "USER", "FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER"].includes(reviewer.role)) {
          isAuthorized = true;
        }

        if (!isAuthorized) {
          return res.status(403).json({
            message: `Only ${
              reviewee.role === "FARMER"
                ? "processors"
                : reviewee.role === "PROCESSOR"
                ? "distributors"
                : reviewee.role === "DISTRIBUTOR"
                ? "retailers"
                : "authorized partners"
            } can leave reviews on this profile.`
          });
        }

        const existingRating = await prisma.rating.findFirst({
          where: {
            reviewerId,
            revieweeId,
            requestId: null
          }
        });

        if (existingRating) {
          return res.status(400).json({ message: "You have already reviewed this profile." });
        }
      }

      // Create rating
      const rating = await prisma.rating.create({
        data: {
          value: parseInt(value, 10),
          comment: comment || null,
          reviewerId,
          revieweeId,
          requestId: requestId || null
        }
      });

      return res.status(201).json(rating);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: "You have already rated this transaction." });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
