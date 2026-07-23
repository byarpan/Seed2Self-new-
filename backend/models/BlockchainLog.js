import mongoose from "mongoose";

const blockchainLogSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true, index: true },
    orderId: { type: String, index: true },
    action: { 
      type: String, 
      required: true, 
      enum: [
        "BATCH_CREATED", 
        "PAYMENT_LOCKED", 
        "OWNERSHIP_TRANSFERRED", 
        "PAYMENT_RELEASED", 
        "PROCESSING_COMPLETED", 
        "BATCH_SPLIT", 
        "BATCH_MERGED",
        "SHIPMENT_DELIVERED",
        "ORDER_ACCEPTED",
        "ORDER_SHIPPED",
        "HARVEST_LOGGED"
      ] 
    },
    transactionHash: { type: String },
    blockNumber: { type: Number },
    performedBy: { type: String, required: true },
    performedByRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

blockchainLogSchema.index({ batchId: 1, timestamp: -1 });

const BlockchainLog = mongoose.models.BlockchainLog || mongoose.model("BlockchainLog", blockchainLogSchema);
export default BlockchainLog;
