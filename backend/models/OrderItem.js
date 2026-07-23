import mongoose from "mongoose";

// TODO: Define OrderItem Schema
const orderItemSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    batchId: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.OrderItem || mongoose.model("OrderItem", orderItemSchema);
