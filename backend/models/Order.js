import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, index: true },
    buyerId: { type: String, required: true, index: true },
    buyerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    buyerRole: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER", "CUSTOMER"] 
    },
    sellerId: { type: String, required: true, index: true },
    sellerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerRole: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER"] 
    },
    productId: { type: String, required: true },
    productRef: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    batchId: { type: String, required: true, index: true },
    quantityPurchased: { type: Number, required: true, min: [0, "Quantity cannot be negative"] },
    amount: { type: Number, required: true, min: [0, "Amount cannot be negative"] },
    paymentStatus: { 
      type: String, 
      required: true, 
      enum: ["WAITING_FOR_PAYMENT", "PAYMENT_LOCKED", "PAYMENT_RELEASED", "REFUNDED", "FAILED"],
      default: "WAITING_FOR_PAYMENT"
    },
    deliveryStatus: { 
      type: String, 
      required: true, 
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CONFIRMED", "CANCELLED"],
      default: "PENDING"
    },
    escrowStatus: { 
      type: String, 
      enum: ["LOCKED", "RELEASED", "REFUNDED"],
      default: "LOCKED"
    },
    blockchainStatus: { 
      type: String, 
      required: true, 
      enum: ["NOT_CREATED", "CREATED", "UPDATED"],
      default: "NOT_CREATED"
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "ACCEPTED", "COMPLETED", "REJECTED", "CANCELLED"],
      default: "PENDING",
      index: true
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
  },
  { timestamps: true }
);

orderSchema.index({ sellerId: 1, orderStatus: 1 });
orderSchema.index({ buyerId: 1, orderStatus: 1 });

// Custom ID generation pre-save hook
orderSchema.pre("save", async function(next) {
  if (this.isNew && !this.orderId) {
    const lastOrder = await this.constructor.findOne({}, { orderId: 1 }).sort({ orderId: -1 });
    let nextNum = 1;
    if (lastOrder && lastOrder.orderId) {
      const matches = lastOrder.orderId.match(/\d+/);
      if (matches) {
        nextNum = parseInt(matches[0], 10) + 1;
      }
    }
    this.orderId = `ORD${String(nextNum).padStart(6, '0')}`;
  }
  next();
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
