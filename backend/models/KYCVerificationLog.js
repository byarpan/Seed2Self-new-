import mongoose from "mongoose";

// TODO: Define KYCVerificationLog Schema
const kycVerificationLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    documentType: { type: String, required: true },
    documentUrl: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    reviewedBy: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.KYCVerificationLog || mongoose.model("KYCVerificationLog", kycVerificationLogSchema);
