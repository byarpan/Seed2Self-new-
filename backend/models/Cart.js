import mongoose from "mongoose";

// TODO: Define Cart Schema
const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }]
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
