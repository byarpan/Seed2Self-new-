import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    buyerId: { type: String, required: true },
    buyerRole: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER", "CUSTOMER"] 
    },
    sellerId: { type: String, required: true },
    sellerRole: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER"] 
    },
    productId: { type: String, required: true },
    batchId: { type: String, required: true },
    quantityPurchased: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      required: true, 
      enum: ["WAITING_FOR_PAYMENT", "PAYMENT_LOCKED", "PAYMENT_RELEASED"],
      default: "WAITING_FOR_PAYMENT"
    },
    deliveryStatus: { 
      type: String, 
      required: true, 
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CONFIRMED"],
      default: "PENDING"
    },
    escrowStatus: { 
      type: String, 
      enum: ["LOCKED", "RELEASED"] 
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
      enum: ["PENDING", "ACCEPTED", "COMPLETED", "REJECTED"],
      default: "PENDING"
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ batchId: 1 });

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

const Order = mongoose.model("Order", orderSchema);
export default Order;
