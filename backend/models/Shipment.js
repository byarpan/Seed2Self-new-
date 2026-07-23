import mongoose from "mongoose";

// TODO: Define Shipment Schema
const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    distributorId: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "IN_TRANSIT", "DELIVERED"], default: "PENDING" },
    origin: { type: String },
    destination: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema);
