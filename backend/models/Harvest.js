import mongoose from "mongoose";

const harvestSchema = new mongoose.Schema(
  {
    farmerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Farmer reference is required"],
      index: true 
    },
    farmerIdString: { type: String, index: true },
    cropName: { 
      type: String, 
      required: [true, "Crop name is required"], 
      trim: true,
      index: true
    },
    variety: { type: String, trim: true },
    quantity: { 
      type: Number, 
      required: [true, "Quantity is required"], 
      min: [0, "Quantity cannot be negative"] 
    },
    unit: { 
      type: String, 
      required: true, 
      enum: ["kg", "ton", "quintal", "lbs", "crates", "bags"], 
      default: "kg" 
    },
    pricePerUnit: { type: Number, min: 0 },
    totalValue: { type: Number, min: 0 },
    harvestDate: { 
      type: Date, 
      required: [true, "Harvest date is required"], 
      default: Date.now,
      index: true
    },
    location: { type: String, required: [true, "Harvest location is required"], trim: true },
    qualityGrade: { 
      type: String, 
      enum: ["A+", "A", "B", "C", "PREMIUM", "STANDARD"], 
      default: "A" 
    },
    status: { 
      type: String, 
      enum: ["HARVESTED", "IN_STORAGE", "CONVERTED_TO_PRODUCT", "DISCARDED"], 
      default: "HARVESTED" 
    },
    notes: { type: String },
    images: [{ type: String }]
  },
  { timestamps: true }
);

harvestSchema.index({ farmerId: 1, harvestDate: -1 });

const Harvest = mongoose.models.Harvest || mongoose.model("Harvest", harvestSchema);
export default Harvest;
