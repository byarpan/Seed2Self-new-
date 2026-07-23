import BlockchainLog from "../models/BlockchainLog.js";

/**
 * Get all blockchain logs
 * GET /api/blockchain-logs
 */
export const getBlockchainLogs = async (req, res) => {
  try {
    const logs = await BlockchainLog.find({}).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get blockchain logs by batchId
 * GET /api/blockchain-logs/:batchId
 */
export const getLogsByBatchId = async (req, res) => {
  try {
    const { batchId } = req.params;
    const logs = await BlockchainLog.find({ batchId }).sort({ timestamp: 1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getBlockchainLogs,
  getLogsByBatchId
};
