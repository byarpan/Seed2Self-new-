import mongoose from "mongoose";

// TODO: Define Review Schema
const reviewSchema = new mongoose.Schema(
  {
    targetId: { type: String, required: true },
    reviewerId: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 }
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
