import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, unique: true, index: true },
    batchId: { type: String, unique: true, index: true },
    parentBatchIds: [{ type: String }],
    currentOwnerId: { type: String, required: true, index: true },
    currentOwnerRef: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    currentOwnerRole: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER", "CUSTOMER"],
      default: "FARMER" 
    },
    cropName: { type: String, required: true, trim: true, index: true },
    quantity: { type: Number, required: true, min: [0, "Quantity cannot be negative"] },
    unit: { type: String, required: true, default: "kg" },
    pricePerUnit: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    totalPrice: { type: Number, required: true, min: [0, "Total price cannot be negative"] },
    qualityGrade: { type: String, default: "A" },
    harvestDate: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["AVAILABLE", "RESERVED", "PROCESSED", "PARTIALLY_SOLD", "SOLD", "EXPIRED"],
      default: "AVAILABLE",
      index: true
    },
    description: { type: String, trim: true },
    images: [{ type: String }]
  },
  { timestamps: true }
);

productSchema.index({ currentOwnerId: 1, status: 1 });
productSchema.index({ cropName: 1, status: 1 });

// Custom ID generation pre-save hook
productSchema.pre("save", async function(next) {
  if (this.isNew) {
    if (!this.productId) {
      const lastProduct = await this.constructor.findOne({}, { productId: 1 }).sort({ productId: -1 });
      let nextNum = 1;
      if (lastProduct && lastProduct.productId) {
        const matches = lastProduct.productId.match(/\d+/);
        if (matches) {
          nextNum = parseInt(matches[0], 10) + 1;
        }
      }
      this.productId = `PROD${String(nextNum).padStart(6, '0')}`;
    }

    if (!this.batchId) {
      const year = new Date().getFullYear();
      const lastBatch = await this.constructor.findOne({ batchId: new RegExp(`^BATCH${year}`) }, { batchId: 1 }).sort({ batchId: -1 });
      let nextNum = 1;
      if (lastBatch && lastBatch.batchId) {
        const matches = lastBatch.batchId.match(/BATCH\d{4}(\d+)/);
        if (matches && matches[1]) {
          nextNum = parseInt(matches[1], 10) + 1;
        }
      }
      this.batchId = `BATCH${year}${String(nextNum).padStart(6, '0')}`;
    }
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
