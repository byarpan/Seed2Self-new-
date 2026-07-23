import mongoose from "mongoose";

// TODO: Define Rating Schema
const ratingSchema = new mongoose.Schema(
  {
    targetId: { type: String, required: true },
    reviewerId: { type: String, required: true },
    score: { type: Number, min: 1, max: 5, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Rating || mongoose.model("Rating", ratingSchema);
