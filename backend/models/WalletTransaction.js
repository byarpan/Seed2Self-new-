import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    walletId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Wallet", 
      required: true,
      index: true 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    type: { 
      type: String, 
      enum: ["CREDIT", "DEBIT"], 
      required: true,
      index: true
    },
    category: { 
      type: String, 
      enum: ["HARVEST_SALE", "ORDER_PAYMENT", "ESCROW_RELEASE", "WITHDRAWAL", "REFUND", "TOPUP"], 
      default: "HARVEST_SALE" 
    },
    amount: { type: Number, required: true, min: [0, "Transaction amount cannot be negative"] },
    balanceAfter: { type: Number },
    description: { type: String, trim: true },
    referenceOrderId: { type: String },
    txHash: { type: String },
    status: { 
      type: String, 
      enum: ["PENDING", "COMPLETED", "FAILED"], 
      default: "COMPLETED" 
    }
  },
  { timestamps: true }
);

walletTransactionSchema.index({ walletId: 1, createdAt: -1 });

const WalletTransaction = mongoose.models.WalletTransaction || mongoose.model("WalletTransaction", walletTransactionSchema);
export default WalletTransaction;
