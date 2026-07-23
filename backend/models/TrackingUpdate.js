import mongoose from "mongoose";

// TODO: Define TrackingUpdate Schema
const trackingUpdateSchema = new mongoose.Schema(
  {
    shipmentId: { type: String, required: true },
    location: { type: String, required: true },
    statusNote: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.TrackingUpdate || mongoose.model("TrackingUpdate", trackingUpdateSchema);
