import express from "express";
import { getBlockchainStatus } from "../controllers/blockchainController.js";

const router = express.Router();

router.get("/status", getBlockchainStatus);

export default router;
