import harvestService from "../services/harvestService.js";

/**
 * Log a new harvest
 * POST /api/harvests
 */
export const createHarvest = async (req, res) => {
  try {
    const harvest = await harvestService.createHarvest(req.body);
    res.status(201).json({ success: true, data: harvest });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Get all harvests for a farmer
 * GET /api/harvests?farmerId=...
 */
export const getHarvests = async (req, res) => {
  try {
    const { farmerId } = req.query;
    if (!farmerId) {
      return res.status(400).json({ success: false, error: "farmerId query parameter is required" });
    }
    const harvests = await harvestService.getFarmerHarvests(farmerId);
    res.status(200).json({ success: true, data: harvests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get single harvest details
 * GET /api/harvests/:id
 */
export const getHarvestById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await harvestService.getHarvestById(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

/**
 * Update harvest record
 * PUT /api/harvests/:id
 */
export const updateHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await harvestService.updateHarvest(id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Delete harvest record
 * DELETE /api/harvests/:id
 */
export const deleteHarvest = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await harvestService.deleteHarvest(id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export default {
  createHarvest,
  getHarvests,
  getHarvestById,
  updateHarvest,
  deleteHarvest
};
