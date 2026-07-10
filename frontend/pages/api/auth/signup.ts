import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let farmerId = null;
    let processorId = null;
    if (role === "FARMER") {
      const lastFarmer = await prisma.user.findFirst({
        where: {
          role: "FARMER",
          NOT: { farmerId: null }
        },
        orderBy: {
          farmerId: "desc"
        }
      });

      let nextNum = 1;
      if (lastFarmer && lastFarmer.farmerId) {
        const match = lastFarmer.farmerId.match(/S2S-FRM-(\d+)/);
        if (match) {
          nextNum = parseInt(match[1]) + 1;
        }
      }
      farmerId = `S2S-FRM-${String(nextNum).padStart(6, '0')}`;
    } else if (role === "PROCESSOR") {
      const lastProcessor = await prisma.user.findFirst({
        where: {
          role: "PROCESSOR",
          NOT: { processorId: null }
        },
        orderBy: {
          processorId: "desc"
        }
      });

      let nextNum = 1;
      if (lastProcessor && lastProcessor.processorId) {
        const match = lastProcessor.processorId.match(/S2S-PRC-(\d+)/);
        if (match) {
          nextNum = parseInt(match[1]) + 1;
        }
      }
      processorId = `S2S-PRC-${String(nextNum).padStart(6, '0')}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        farmerId,
        processorId,
        regDate: new Date()
      }
    });

    return res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
