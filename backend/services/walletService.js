import Wallet from "../models/Wallet.js";
import WalletTransaction from "../models/WalletTransaction.js";

/**
 * Get or create wallet for a user/farmer
 */
export const getOrCreateWallet = async (userId, userStringId = null, walletAddress = null) => {
  if (!userId) {
    throw new Error("User ID is required for wallet operations");
  }

  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({
      userId,
      userStringId: userStringId || userId.toString(),
      walletAddress,
      balance: 0
    });
    await wallet.save();
  } else if (walletAddress && wallet.walletAddress !== walletAddress) {
    wallet.walletAddress = walletAddress;
    await wallet.save();
  }

  return wallet;
};

/**
 * Credit funds to user wallet
 */
export const creditWallet = async (userId, amount, category = "HARVEST_SALE", description = "", referenceOrderId = null, txHash = null) => {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  const wallet = await getOrCreateWallet(userId);
  wallet.balance = parseFloat((wallet.balance + amount).toFixed(2));
  await wallet.save();

  const transaction = new WalletTransaction({
    walletId: wallet._id,
    userId,
    type: "CREDIT",
    category,
    amount,
    balanceAfter: wallet.balance,
    description,
    referenceOrderId,
    txHash,
    status: "COMPLETED"
  });

  await transaction.save();
  return { wallet, transaction };
};

/**
 * Debit funds from user wallet
 */
export const debitWallet = async (userId, amount, category = "WITHDRAWAL", description = "", referenceOrderId = null, txHash = null) => {
  if (amount <= 0) {
    throw new Error("Debit amount must be positive");
  }

  const wallet = await getOrCreateWallet(userId);
  if (wallet.balance < amount) {
    throw new Error(`Insufficient wallet balance. Available: ₹${wallet.balance}`);
  }

  wallet.balance = parseFloat((wallet.balance - amount).toFixed(2));
  await wallet.save();

  const transaction = new WalletTransaction({
    walletId: wallet._id,
    userId,
    type: "DEBIT",
    category,
    amount,
    balanceAfter: wallet.balance,
    description,
    referenceOrderId,
    txHash,
    status: "COMPLETED"
  });

  await transaction.save();
  return { wallet, transaction };
};

/**
 * Get wallet transactions history
 */
export const getWalletTransactions = async (userId) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    return [];
  }
  return await WalletTransaction.find({ walletId: wallet._id }).sort({ createdAt: -1 });
};

export default {
  getOrCreateWallet,
  creditWallet,
  debitWallet,
  getWalletTransactions
};
