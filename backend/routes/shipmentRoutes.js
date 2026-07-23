import express from "express";
import { getShipments, updateShipmentStatus } from "../controllers/shipmentController.js";

const router = express.Router();

router.get("/", getShipments);
router.put("/:id", updateShipmentStatus);

export default router;
