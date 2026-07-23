import Product from "../models/Product.js";
import BlockchainLog from "../models/BlockchainLog.js";
import blockchainService from "./blockchainService.js";

/**
 * Create a new Product batch (e.g. from farmer harvest)
 */
export const createProductBatch = async (productData) => {
  const { cropName, quantity, unit, pricePerUnit, harvestDate, location, currentOwnerId, currentOwnerRole, description, images } = productData;

  if (!cropName || !quantity || !pricePerUnit || !currentOwnerId || !location) {
    throw new Error("Missing required product batch fields");
  }

  const totalPrice = quantity * pricePerUnit;

  const product = new Product({
    cropName,
    quantity,
    unit: unit || "kg",
    pricePerUnit,
    totalPrice,
    harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
    location,
    currentOwnerId,
    currentOwnerRole: currentOwnerRole || "FARMER",
    description,
    images: images || [],
    status: "AVAILABLE",
    parentBatchIds: []
  });

  await product.save();

  let txHash = `tx-create-${Date.now()}`;
  if (blockchainService.isReady()) {
    try {
      txHash = await blockchainService.createBatch(
        product.batchId,
        product.quantity,
        product.cropName,
        product.currentOwnerRole,
        "AVAILABLE"
      );
    } catch (err) {
      console.error("[BlockchainService] Error during createBatch:", err);
    }
  }

  const log = new BlockchainLog({
    batchId: product.batchId,
    action: "BATCH_CREATED",
    performedBy: currentOwnerId,
    transactionHash: txHash
  });
  await log.save();

  return { product, log };
};

/**
 * Get all product batches belonging to a farmer/owner
 */
export const getProductsByOwner = async (ownerId) => {
  if (!ownerId) {
    throw new Error("Owner ID is required");
  }
  return await Product.find({ currentOwnerId: ownerId }).sort({ createdAt: -1 });
};

/**
 * Get product batch by Batch ID or ObjectId
 */
export const getProductByBatchId = async (batchId) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(batchId);
  const query = isObjectId ? { _id: batchId } : { batchId };
  const product = await Product.findOne(query);
  if (!product) {
    throw new Error(`Product batch ${batchId} not found`);
  }
  return product;
};

/**
 * Split an existing product batch
 */
export const splitProductBatch = async (splitPayload) => {
  const { parentBatchId, quantityToSplit, newOwnerId, newOwnerRole, location, performedBy } = splitPayload;

  const parent = await Product.findOne({ batchId: parentBatchId });
  if (!parent) {
    throw new Error(`Parent batch ${parentBatchId} not found`);
  }

  if (parent.quantity < quantityToSplit) {
    throw new Error(`Insufficient quantity in parent batch. Available: ${parent.quantity}`);
  }

  parent.quantity = parseFloat((parent.quantity - quantityToSplit).toFixed(2));
  parent.totalPrice = parseFloat((parent.quantity * parent.pricePerUnit).toFixed(2));
  parent.status = parent.quantity === 0 ? "SOLD" : "PARTIALLY_SOLD";
  await parent.save();

  const child = new Product({
    parentBatchIds: [parentBatchId],
    currentOwnerId: newOwnerId,
    currentOwnerRole: newOwnerRole || "FARMER",
    cropName: parent.cropName,
    quantity: quantityToSplit,
    unit: parent.unit,
    pricePerUnit: parent.pricePerUnit,
    totalPrice: parseFloat((quantityToSplit * parent.pricePerUnit).toFixed(2)),
    qualityGrade: parent.qualityGrade,
    harvestDate: parent.harvestDate,
    location: location || parent.location,
    status: "AVAILABLE",
    description: `Split from ${parentBatchId}`
  });

  await child.save();

  let childTxHash = `tx-split-${Date.now()}`;
  if (blockchainService.isReady()) {
    try {
      childTxHash = await blockchainService.splitBatch(
        parentBatchId,
        child.batchId,
        quantityToSplit,
        newOwnerId,
        child.currentOwnerRole
      );
    } catch (err) {
      console.error("[BlockchainService] Error during splitBatch:", err);
    }
  }

  const log = new BlockchainLog({
    batchId: child.batchId,
    action: "BATCH_SPLIT",
    performedBy: performedBy || newOwnerId,
    transactionHash: childTxHash
  });
  await log.save();

  return { parent, child, log };
};

/**
 * Update product listing
 */
export const updateProductBatch = async (id, updateFields) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { batchId: id };
  const product = await Product.findOne(query);

  if (!product) {
    throw new Error("Product batch not found");
  }

  Object.assign(product, updateFields);
  if (updateFields.quantity || updateFields.pricePerUnit) {
    product.totalPrice = (product.quantity || 0) * (product.pricePerUnit || 0);
  }

  await product.save();
  return product;
};

export default {
  createProductBatch,
  getProductsByOwner,
  getProductByBatchId,
  splitProductBatch,
  updateProductBatch
};
