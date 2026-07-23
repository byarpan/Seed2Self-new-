import walletService from "../services/walletService.js";

/**
 * Get Farmer wallet balance
 * GET /api/wallet/balance?userId=...
 */
export const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    const wallet = await walletService.getOrCreateWallet(userId);
    res.status(200).json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Credit user wallet
 * POST /api/wallet/credit
 */
export const creditWallet = async (req, res) => {
  try {
    const { userId, amount, category, description, referenceOrderId } = req.body;
    const result = await walletService.creditWallet(userId, amount, category, description, referenceOrderId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Debit user wallet
 * POST /api/wallet/debit
 */
export const debitWallet = async (req, res) => {
  try {
    const { userId, amount, category, description, referenceOrderId } = req.body;
    const result = await walletService.debitWallet(userId, amount, category, description, referenceOrderId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * Get transaction history
 * GET /api/wallet/transactions?userId=...
 */
export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    const transactions = await walletService.getWalletTransactions(userId);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getWalletBalance,
  creditWallet,
  debitWallet,
  getTransactions
};
