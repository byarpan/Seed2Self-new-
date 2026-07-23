import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    orderRef: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    buyerId: { type: String, required: true, index: true },
    buyerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: String, required: true, index: true },
    sellerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    paymentMethod: { 
      type: String, 
      required: true, 
      enum: ["RAZORPAY", "WALLET", "ESCROW", "CASH", "BANK_TRANSFER"],
      default: "RAZORPAY" 
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { 
      type: String, 
      required: true,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

// Custom ID generation pre-save hook
paymentSchema.pre("save", async function(next) {
  if (this.isNew && !this.paymentId) {
    const lastPayment = await this.constructor.findOne({}, { paymentId: 1 }).sort({ paymentId: -1 });
    let nextNum = 1;
    if (lastPayment && lastPayment.paymentId) {
      const matches = lastPayment.paymentId.match(/\d+/);
      if (matches) {
        nextNum = parseInt(matches[0], 10) + 1;
      }
    }
    this.paymentId = `PAY${String(nextNum).padStart(6, '0')}`;
  }
  next();
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
