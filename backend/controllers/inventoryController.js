import inventoryService from "../services/inventoryService.js";

/**
 * Get inventory items for owner/farmer
 * GET /api/inventory?ownerId=...
 */
export const getInventory = async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (!ownerId) {
      return res.status(400).json({ success: false, error: "ownerId query parameter is required" });
    }
    const inventory = await inventoryService.getInventoryByOwner(ownerId);
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Sync inventory from batch
 * POST /api/inventory/sync
 */
export const syncInventory = async (req, res) => {
  try {
    const { batchId, ownerId } = req.body;
    if (!batchId || !ownerId) {
      return res.status(400).json({ success: false, error: "batchId and ownerId are required" });
    }
    const item = await inventoryService.syncInventoryFromBatch(batchId, ownerId);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Update stock level
 * PUT /api/inventory/:id
 */
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { availableQuantity, reservedQuantity } = req.body;
    const updated = await inventoryService.updateInventoryStock(id, availableQuantity, reservedQuantity);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export default {
  getInventory,
  syncInventory,
  updateInventory
};
