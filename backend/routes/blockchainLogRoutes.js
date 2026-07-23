import express from "express";
import { getBlockchainLogs } from "../controllers/blockchainLogController.js";

const router = express.Router();

router.get("/", getBlockchainLogs);

export default router;
