import mongoose from "mongoose";

// TODO: Define Retailer Profile Schema
const retailerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String },
    storeAddress: { type: String },
    kycStatus: { type: String, enum: ["PENDING", "VERIFIED", "REJECTED"], default: "PENDING" }
  },
  { timestamps: true }
);

export default mongoose.models.RetailerProfile || mongoose.model("RetailerProfile", retailerProfileSchema);
