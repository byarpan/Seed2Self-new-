import express from "express";
import { getAdminStats, verifyKYC } from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", getAdminStats);
router.post("/kyc/verify", verifyKYC);

export default router;
