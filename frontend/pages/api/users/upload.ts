import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";

// Disable default body parser to allow larger base64 payloads if needed (e.g., 5mb)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { file, type } = req.body;

    if (!file || !type) {
      return res.status(400).json({ message: "Missing file or type parameter" });
    }

    // Validate type
    const isKycType = type.startsWith("aadhaar") || type.includes("kyc") || type === "pan" || type === "document";
    const allowedTypes = ["profile", "aadhaar_front", "aadhaar_back", "aadhaar", "kyc", "pan", "document"];
    if (!allowedTypes.includes(type) && !isKycType) {
      return res.status(400).json({ message: "Invalid upload type" });
    }

    // Parse base64 string
    const match = file.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ message: "Invalid image format. Must be base64 data URI." });
    }

    const ext = match[1];
    const data = match[2];
    const buffer = Buffer.from(data, "base64");

    // Define upload directory based on type
    const subFolder = isKycType ? "kyc" : type === "profile" ? "profile" : "";
    const uploadDir = subFolder ? path.join(process.cwd(), "public", "uploads", subFolder) : path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique file name
    const filename = `${type}-${session.user.id}-${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Return the relative URL served by Next.js from public folder
    const fileUrl = subFolder ? `/uploads/${subFolder}/${filename}` : `/uploads/${filename}`;
    return res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Failed to upload file" });
  }
}
