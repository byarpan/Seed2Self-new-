import productService from "../services/productService.js";

/**
 * Create product batch (Farmer harvest converted to listing)
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const result = await productService.createProductBatch(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get product batches (all or filtered by ownerId)
 * GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const { ownerId } = req.query;
    if (ownerId) {
      const products = await productService.getProductsByOwner(ownerId);
      return res.status(200).json(products);
    }
    const products = await productService.getProductsByOwner(req.query.farmerId || req.body.ownerId || "");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get product batch by ID / Batch ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByBatchId(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Split batch
 * POST /api/products/split
 */
export const splitBatch = async (req, res) => {
  try {
    const result = await productService.splitProductBatch(req.body);
    res.status(201).json({
      message: "Batch split successfully",
      ...result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update product batch
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await productService.updateProductBatch(id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  splitBatch,
  updateProduct
};
