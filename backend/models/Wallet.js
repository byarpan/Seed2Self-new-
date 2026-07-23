import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true,
      index: true 
    },
    userStringId: { type: String, index: true },
    walletAddress: { type: String, trim: true, sparse: true, index: true },
    balance: { type: Number, default: 0, min: [0, "Balance cannot be negative"] },
    currency: { type: String, default: "INR" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);
export default Wallet;
