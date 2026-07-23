import express from "express";
import {
  createOrder,
  acceptOrder,
  shipOrder,
  confirmDelivery,
  getOrders
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.put("/:id/accept", acceptOrder);
router.put("/:id/ship", shipOrder);
router.put("/:id/confirm-delivery", confirmDelivery);
router.get("/", getOrders);

export default router;
