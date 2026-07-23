import mongoose from "mongoose";

// TODO: Define Ownership History Schema
const ownershipHistorySchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true },
    previousOwnerId: { type: String, required: true },
    newOwnerId: { type: String, required: true },
    transferDate: { type: Date, default: Date.now },
    transactionHash: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.OwnershipHistory || mongoose.model("OwnershipHistory", ownershipHistorySchema);
