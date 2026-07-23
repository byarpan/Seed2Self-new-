import Harvest from "../models/Harvest.js";
import HarvestImage from "../models/HarvestImage.js";

/**
 * Log a new crop harvest for a farmer
 */
export const createHarvest = async (harvestData) => {
  const { farmerId, cropName, variety, quantity, unit, pricePerUnit, harvestDate, location, qualityGrade, notes, images } = harvestData;

  if (!farmerId || !cropName || !quantity || !location) {
    throw new Error("Missing required harvest fields: farmerId, cropName, quantity, location");
  }

  const totalValue = (pricePerUnit || 0) * quantity;

  const harvest = new Harvest({
    farmerId,
    cropName,
    variety,
    quantity,
    unit: unit || "kg",
    pricePerUnit,
    totalValue,
    harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
    location,
    qualityGrade: qualityGrade || "A",
    notes,
    images: images || []
  });

  await harvest.save();

  if (images && Array.isArray(images) && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const img = new HarvestImage({
        harvestId: harvest._id,
        imageUrl: images[i],
        isPrimary: i === 0
      });
      await img.save();
    }
  }

  return harvest;
};

/**
 * Get all harvest logs for a specific farmer
 */
export const getFarmerHarvests = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required");
  }

  const harvests = await Harvest.find({ farmerId }).sort({ harvestDate: -1 });
  return harvests;
};

/**
 * Get single harvest details by ID
 */
export const getHarvestById = async (harvestId) => {
  const harvest = await Harvest.findById(harvestId);
  if (!harvest) {
    throw new Error("Harvest record not found");
  }
  const images = await HarvestImage.find({ harvestId: harvest._id });
  return { harvest, images };
};

/**
 * Update a harvest record
 */
export const updateHarvest = async (harvestId, updateData) => {
  const harvest = await Harvest.findById(harvestId);
  if (!harvest) {
    throw new Error("Harvest record not found");
  }

  Object.assign(harvest, updateData);
  if (harvest.pricePerUnit && harvest.quantity) {
    harvest.totalValue = harvest.pricePerUnit * harvest.quantity;
  }

  await harvest.save();
  return harvest;
};

/**
 * Delete a harvest record
 */
export const deleteHarvest = async (harvestId) => {
  const harvest = await Harvest.findById(harvestId);
  if (!harvest) {
    throw new Error("Harvest record not found");
  }

  await HarvestImage.deleteMany({ harvestId: harvest._id });
  await Harvest.deleteOne({ _id: harvest._id });
  return { success: true, message: "Harvest record removed successfully" };
};

export default {
  createHarvest,
  getFarmerHarvests,
  getHarvestById,
  updateHarvest,
  deleteHarvest
};
