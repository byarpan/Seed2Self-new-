import express from "express";
import {
  createProduct,
  splitBatch,
  mergeBatch,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.post("/split", splitBatch);
router.post("/merge", mergeBatch);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
