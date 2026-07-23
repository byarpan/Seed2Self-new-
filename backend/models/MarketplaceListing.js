import mongoose from "mongoose";

// TODO: Define Marketplace Listing Schema
const marketplaceListingSchema = new mongoose.Schema(
  {
    sellerId: { type: String, required: true },
    batchId: { type: String, required: true },
    cropName: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    isListed: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.MarketplaceListing || mongoose.model("MarketplaceListing", marketplaceListingSchema);
