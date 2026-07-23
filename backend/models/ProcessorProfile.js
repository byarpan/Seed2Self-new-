import mongoose from "mongoose";

// TODO: Define Processor Profile Schema
const processorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    facilityName: { type: String },
    facilityLocation: { type: String },
    processingCapacity: { type: String },
    kycStatus: { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "PENDING" }
  },
  { timestamps: true }
);

export default mongoose.models.ProcessorProfile || mongoose.model("ProcessorProfile", processorProfileSchema);
