import mongoose from "mongoose";

const blockchainLogSchema = new mongoose.Schema(
  {
    batchId: { type: String, required: true },
    orderId: { type: String },
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
        "ORDER_SHIPPED"
      ] 
    },
    transactionHash: { type: String },
    performedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Indexes
blockchainLogSchema.index({ batchId: 1 });
blockchainLogSchema.index({ timestamp: -1 });

const BlockchainLog = mongoose.model("BlockchainLog", blockchainLogSchema);
export default BlockchainLog;
