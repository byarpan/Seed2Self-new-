import express from "express";
import { getListings, createListing } from "../controllers/marketplaceController.js";

const router = express.Router();

router.get("/", getListings);
router.post("/", createListing);

export default router;
