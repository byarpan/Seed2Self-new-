import mongoose from "mongoose";

const blockchainTransactionSchema = new mongoose.Schema(
  {
    txHash: { type: String, required: true, unique: true, index: true },
    contractAddress: { type: String },
    methodName: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String },
    batchId: { type: String, index: true },
    orderId: { type: String },
    status: { 
      type: String, 
      enum: ["PENDING", "CONFIRMED", "FAILED"], 
      default: "PENDING",
      index: true
    },
    gasUsed: { type: Number },
    errorMessage: { type: String }
  },
  { timestamps: true }
);

const BlockchainTransaction = mongoose.models.BlockchainTransaction || mongoose.model("BlockchainTransaction", blockchainTransactionSchema);
export default BlockchainTransaction;
