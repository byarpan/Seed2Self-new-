import express from "express";
import { generateInvoice, getInvoices } from "../controllers/invoiceController.js";

const router = express.Router();

router.post("/", generateInvoice);
router.get("/", getInvoices);

export default router;
