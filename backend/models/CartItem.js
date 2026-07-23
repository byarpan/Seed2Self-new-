import mongoose from "mongoose";

// TODO: Define CartItem Schema
const cartItemSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "MarketplaceListing", required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema);
