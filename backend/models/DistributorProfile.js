import mongoose from "mongoose";

// TODO: Define Distributor Profile Schema
const distributorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String },
    fleetSize: { type: Number },
    warehouseLocations: [{ type: String }],
    kycStatus: { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "PENDING" }
  },
  { timestamps: true }
);

export default mongoose.models.DistributorProfile || mongoose.model("DistributorProfile", distributorProfileSchema);
