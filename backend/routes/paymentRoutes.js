import express from "express";
import { handleCreateOrder, handleVerifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", handleCreateOrder);
router.post("/verify", handleVerifyPayment);

export default router;
