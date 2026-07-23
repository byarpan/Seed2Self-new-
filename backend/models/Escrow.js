import mongoose from "mongoose";

// TODO: Define Escrow Schema
const escrowSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["LOCKED", "RELEASED", "REFUNDED"], default: "LOCKED" }
  },
  { timestamps: true }
);

export default mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);
