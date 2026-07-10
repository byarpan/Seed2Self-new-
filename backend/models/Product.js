import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: String, unique: true },
    batchId: { type: String, unique: true },
    parentBatchIds: [{ type: String }],
    currentOwnerId: { type: String, required: true },
    currentOwnerRole: { 
      type: String, 
      required: true, 
      enum: ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER"] 
    },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, default: "kg" },
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    qualityGrade: { type: String },
    harvestDate: { type: Date, required: true },
    location: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ["AVAILABLE", "RESERVED", "PROCESSED", "PARTIALLY_SOLD", "SOLD", "EXPIRED"],
      default: "AVAILABLE"
    },
    description: { type: String },
    images: [{ type: String }]
  },
  { timestamps: true }
);

// Custom ID generation pre-save hook
productSchema.pre("save", async function(next) {
  if (this.isNew) {
    // 1. Generate productId (e.g. PROD000001)
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

    // 2. Generate batchId (e.g. BATCH2026000001)
    if (!this.batchId) {
      const year = new Date().getFullYear();
      // Match BATCH + 4 digit year + digits
      const lastBatch = await this.constructor.findOne({ batchId: new RegExp(`^BATCH${year}`) }, { batchId: 1 }).sort({ batchId: -1 });
      let nextNum = 1;
      if (lastBatch && lastBatch.batchId) {
        // Extract the sequence portion following the 4-digit year
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

const Product = mongoose.model("Product", productSchema);
export default Product;
