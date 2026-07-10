import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = id as string;

  const session = await getServerSession(req, res, authOptions);

  // 1. GET Request
  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if requester is self or admin
      const isSelfOrAdmin = session && (session.user.id === userId || session.user.role === "ADMIN");

      const ratingAgg = await prisma.rating.aggregate({
        _avg: { value: true },
        where: { revieweeId: userId }
      });

      const averageRating = ratingAgg._avg.value || null;

      const ratings = await prisma.rating.findMany({
        where: { revieweeId: userId },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              role: true,
              profilePhoto: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      if (isSelfOrAdmin) {
        // Return full profile including private fields
        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          profilePhoto: user.profilePhoto,
          farmerId: user.farmerId,
          processorId: user.processorId,
          mobileNumber: user.mobileNumber,
          dob: user.dob,
          gender: user.gender,
          permanentAddress: user.permanentAddress,
          state: user.state,
          district: user.district,
          village: user.village,
          pinCode: user.pinCode,
          farmName: user.farmName,
          farmLocation: user.farmLocation,
          landArea: user.landArea,
          mainCrops: user.mainCrops,
          farmingType: user.farmingType,
          regDate: user.regDate || user.createdAt,
          aadhaarNumber: user.aadhaarNumber,
          aadhaarFront: user.aadhaarFront,
          aadhaarBack: user.aadhaarBack,
          kycStatus: user.kycStatus,
          verificationDate: user.verificationDate,
          rejectionReason: user.rejectionReason,
          createdAt: user.createdAt,
          averageRating,
          ratings
        });
      } else {
        // Return public profile only (mask sensitive info)
        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          profilePhoto: user.profilePhoto,
          farmerId: user.farmerId,
          processorId: user.processorId,
          farmName: user.farmName,
          farmLocation: user.farmLocation,
          mainCrops: user.mainCrops,
          farmingType: user.farmingType,
          regDate: user.regDate || user.createdAt,
          kycStatus: user.kycStatus,
          createdAt: user.createdAt,
          averageRating,
          ratings
        });
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      return res.status(500).json({ message: "Error fetching user" });
    }
  }

  // 2. PUT Request
  if (req.method === "PUT") {
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isSelfOrAdmin = session.user.id === userId || session.user.role === "ADMIN";
    if (!isSelfOrAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const {
        name,
        mobileNumber,
        dob,
        gender,
        permanentAddress,
        state,
        district,
        village,
        pinCode,
        farmName,
        farmLocation,
        landArea,
        mainCrops,
        farmingType,
        profilePhoto,
        aadhaarNumber,
        aadhaarFront,
        aadhaarBack,
        submitKyc,
        walletAddress // keep compatibility for wallet binding
      } = req.body;

      // Input Validations
      if (name !== undefined && name.trim() === "") {
        return res.status(400).json({ message: "Name cannot be empty" });
      }

      if (mobileNumber !== undefined && mobileNumber !== "" && !/^\d{10}$/.test(mobileNumber)) {
        return res.status(400).json({ message: "Mobile number must be a 10-digit numeric value" });
      }

      if (pinCode !== undefined && pinCode !== "" && !/^\d{6}$/.test(pinCode)) {
        return res.status(400).json({ message: "PIN code must be a 6-digit numeric value" });
      }

      if (gender !== undefined && gender !== "" && !["Male", "Female", "Other"].includes(gender)) {
        return res.status(400).json({ message: "Gender must be Male, Female, or Other" });
      }

      // Build update query payload
      const updateData: any = {};

      if (walletAddress !== undefined) updateData.walletAddress = walletAddress;
      if (name !== undefined) updateData.name = name;
      if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
      if (dob !== undefined) updateData.dob = dob;
      if (gender !== undefined) updateData.gender = gender;
      if (permanentAddress !== undefined) updateData.permanentAddress = permanentAddress;
      if (state !== undefined) updateData.state = state;
      if (district !== undefined) updateData.district = district;
      if (village !== undefined) updateData.village = village;
      if (pinCode !== undefined) updateData.pinCode = pinCode;
      if (farmName !== undefined) updateData.farmName = farmName;
      if (farmLocation !== undefined) updateData.farmLocation = farmLocation;
      if (landArea !== undefined) updateData.landArea = landArea ? parseFloat(landArea) : null;
      if (mainCrops !== undefined) updateData.mainCrops = mainCrops;
      if (farmingType !== undefined) updateData.farmingType = farmingType;
      if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;

      // Handle KYC Submission fields
      if (submitKyc) {
        // If already verified, do not allow modifying Aadhaar
        if (user.kycStatus === "Verified") {
          return res.status(400).json({ message: "KYC is already verified and locked." });
        }

        if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
          return res.status(400).json({ message: "Aadhaar number must be a 12-digit numeric value" });
        }

        if (!aadhaarFront || !aadhaarBack) {
          return res.status(400).json({ message: "Aadhaar front and back documents are required" });
        }

        updateData.aadhaarNumber = aadhaarNumber;
        updateData.aadhaarFront = aadhaarFront;
        updateData.aadhaarBack = aadhaarBack;
        updateData.kycStatus = "Pending Verification";
        updateData.rejectionReason = null; // Clear rejection reason on resubmission
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({ message: "Error updating user profile" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
