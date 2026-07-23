import orderService from "../services/orderService.js";

/**
 * Place a new order
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const result = await orderService.createOrder(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Farmer accepts an incoming order
 * PUT /api/orders/:id/accept
 */
export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;
    const result = await orderService.acceptOrder(id, sellerId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Farmer ships an accepted order
 * PUT /api/orders/:id/ship
 */
export const shipOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId } = req.body;
    const result = await orderService.shipOrder(id, sellerId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get orders (Farmer incoming orders as seller)
 * GET /api/orders
 */
export const getOrders = async (req, res) => {
  try {
    const { farmerId, sellerId } = req.query;
    const sid = farmerId || sellerId;
    if (!sid) {
      return res.status(400).json({ error: "farmerId or sellerId query parameter required" });
    }
    const orders = await orderService.getFarmerOrders(sid);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get single order details
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export default {
  createOrder,
  acceptOrder,
  shipOrder,
  getOrders,
  getOrderById
};
