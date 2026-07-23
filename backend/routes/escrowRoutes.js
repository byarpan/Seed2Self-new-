import express from "express";
import { getEscrowDetails, releaseEscrow } from "../controllers/escrowController.js";

const router = express.Router();

router.get("/:orderId", getEscrowDetails);
router.post("/:orderId/release", releaseEscrow);

export default router;
