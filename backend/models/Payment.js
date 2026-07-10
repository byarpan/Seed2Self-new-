import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, unique: true },
    orderId: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, required: true }
  },
  { timestamps: true }
);

// Indexes
paymentSchema.index({ orderId: 1 });

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

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
