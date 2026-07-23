import mongoose from "mongoose";

// TODO: Define QRCode Schema
const qrCodeSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, unique: true },
    qrCodeDataUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.QRCode || mongoose.model("QRCode", qrCodeSchema);
