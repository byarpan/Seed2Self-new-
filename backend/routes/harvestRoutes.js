import express from "express";
import { createHarvest, getHarvests } from "../controllers/harvestController.js";

const router = express.Router();

router.post("/", createHarvest);
router.get("/", getHarvests);

export default router;
