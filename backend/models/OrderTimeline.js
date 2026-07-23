import mongoose from "mongoose";

// TODO: Define OrderTimeline Schema
const orderTimelineSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.OrderTimeline || mongoose.model("OrderTimeline", orderTimelineSchema);
