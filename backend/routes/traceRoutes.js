import express from "express";
import { getTraceabilityTree } from "../controllers/productController.js";

const router = express.Router();

router.get("/:batchId", getTraceabilityTree);

export default router;
