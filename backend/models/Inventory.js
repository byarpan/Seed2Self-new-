import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    ownerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    batchId: { type: String, required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    cropName: { type: String, required: true, trim: true, index: true },
    availableQuantity: { type: Number, required: true, min: 0 },
    reservedQuantity: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: "kg" },
    warehouseLocation: { type: String, trim: true },
    storageCondition: { 
      type: String, 
      enum: ["DRY", "COLD_STORAGE", "ROOM_TEMP", "FROZEN"], 
      default: "ROOM_TEMP" 
    },
    status: { 
      type: String, 
      enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"], 
      default: "IN_STOCK" 
    }
  },
  { timestamps: true }
);

inventorySchema.index({ ownerId: 1, batchId: 1 });

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
export default Inventory;
