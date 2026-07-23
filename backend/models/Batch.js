import mongoose from "mongoose";

// TODO: Define Batch Schema
const batchSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    parentBatchIds: [{ type: String }],
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    ownerId: { type: String, required: true },
    ownerRole: { type: String, required: true },
    status: { type: String, default: "ACTIVE" }
  },
  { timestamps: true }
);

export default mongoose.models.Batch || mongoose.model("Batch", batchSchema);
