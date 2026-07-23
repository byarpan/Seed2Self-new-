import mongoose from "mongoose";

const harvestImageSchema = new mongoose.Schema(
  {
    harvestId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Harvest", 
      required: true,
      index: true 
    },
    imageUrl: { type: String, required: true },
    caption: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

harvestImageSchema.index({ harvestId: 1, isPrimary: -1 });

const HarvestImage = mongoose.models.HarvestImage || mongoose.model("HarvestImage", harvestImageSchema);
export default HarvestImage;
