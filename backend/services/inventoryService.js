import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

/**
 * Sync or create inventory record from a product batch
 */
export const syncInventoryFromBatch = async (batchId, ownerId) => {
  const product = await Product.findOne({ batchId });
  if (!product) {
    throw new Error(`Product batch ${batchId} not found`);
  }

  let inventory = await Inventory.findOne({ batchId, ownerId });
  if (!inventory) {
    inventory = new Inventory({
      ownerId,
      batchId: product.batchId,
      productId: product._id,
      cropName: product.cropName,
      availableQuantity: product.quantity,
      unit: product.unit,
      status: product.quantity > 10 ? "IN_STOCK" : product.quantity > 0 ? "LOW_STOCK" : "OUT_OF_STOCK"
    });
  } else {
    inventory.availableQuantity = product.quantity;
    inventory.status = product.quantity > 10 ? "IN_STOCK" : product.quantity > 0 ? "LOW_STOCK" : "OUT_OF_STOCK";
  }

  await inventory.save();
  return inventory;
};

/**
 * Get inventory items for a farmer/owner
 */
export const getInventoryByOwner = async (ownerId) => {
  if (!ownerId) {
    throw new Error("Owner ID is required");
  }
  return await Inventory.find({ ownerId }).sort({ createdAt: -1 });
};

/**
 * Update stock quantity in inventory
 */
export const updateInventoryStock = async (inventoryId, availableQuantity, reservedQuantity = 0) => {
  const inventory = await Inventory.findById(inventoryId);
  if (!inventory) {
    throw new Error("Inventory item not found");
  }

  inventory.availableQuantity = availableQuantity;
  inventory.reservedQuantity = reservedQuantity;
  inventory.status = availableQuantity > 10 ? "IN_STOCK" : availableQuantity > 0 ? "LOW_STOCK" : "OUT_OF_STOCK";

  await inventory.save();
  return inventory;
};

export default {
  syncInventoryFromBatch,
  getInventoryByOwner,
  updateInventoryStock
};
