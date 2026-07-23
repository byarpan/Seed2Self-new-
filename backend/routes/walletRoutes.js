import express from "express";
import { getWalletBalance, getTransactions } from "../controllers/walletController.js";

const router = express.Router();

router.get("/balance", getWalletBalance);
router.get("/transactions", getTransactions);

export default router;
