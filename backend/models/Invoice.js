import mongoose from "mongoose";

// TODO: Define Invoice Schema
const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    issuedTo: { type: String, required: true },
    pdfUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
