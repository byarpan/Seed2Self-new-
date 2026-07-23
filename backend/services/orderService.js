import Order from "../models/Order.js";
import Product from "../models/Product.js";
import BlockchainLog from "../models/BlockchainLog.js";
import blockchainService from "./blockchainService.js";

/**
 * Place a new order for a product batch (buyer purchasing from Farmer)
 */
export const createOrder = async (orderData) => {
  const { buyerId, buyerRole, sellerId, sellerRole, productId, batchId, quantityPurchased, amount } = orderData;

  if (!buyerId || !sellerId || !batchId || !quantityPurchased || !amount) {
    throw new Error("Missing required order parameters");
  }

  const order = new Order({
    buyerId,
    buyerRole: buyerRole || "PROCESSOR",
    sellerId,
    sellerRole: sellerRole || "FARMER",
    productId,
    batchId,
    quantityPurchased,
    amount,
    orderStatus: "PENDING",
    paymentStatus: "WAITING_FOR_PAYMENT",
    escrowStatus: "LOCKED",
    deliveryStatus: "PENDING"
  });

  await order.save();

  let txHash = `tx-order-${order.orderId}-${Date.now()}`;
  if (blockchainService.isReady()) {
    try {
      txHash = await blockchainService.createOrder(
        order.orderId,
        order.sellerId,
        order.amount,
        order.quantityPurchased,
        order.batchId
      );
    } catch (err) {
      console.error("[BlockchainService] Error calling createOrder:", err);
    }
  }

  const log = new BlockchainLog({
    batchId: order.batchId,
    orderId: order.orderId,
    action: "PAYMENT_LOCKED",
    performedBy: buyerId,
    transactionHash: txHash
  });
  await log.save();

  return { order, log };
};

/**
 * Farmer accepts an incoming order
 */
export const acceptOrder = async (orderId, sellerId) => {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (sellerId && order.sellerId !== sellerId) {
    throw new Error("Unauthorized seller for this order");
  }

  order.orderStatus = "ACCEPTED";
  await order.save();

  let txHash = `tx-accept-${order.orderId}-${Date.now()}`;
  if (blockchainService.isReady()) {
    try {
      txHash = await blockchainService.acceptOrder(order.orderId);
    } catch (err) {
      console.error("[BlockchainService] Error calling acceptOrder:", err);
    }
  }

  const log = new BlockchainLog({
    batchId: order.batchId,
    orderId: order.orderId,
    action: "ORDER_ACCEPTED",
    performedBy: order.sellerId,
    transactionHash: txHash
  });
  await log.save();

  return { order, log };
};

/**
 * Farmer ships order
 */
export const shipOrder = async (orderId, sellerId) => {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  if (sellerId && order.sellerId !== sellerId) {
    throw new Error("Unauthorized seller for this order");
  }

  order.deliveryStatus = "SHIPPED";
  await order.save();

  let txHash = `tx-ship-${order.orderId}-${Date.now()}`;
  if (blockchainService.isReady()) {
    try {
      txHash = await blockchainService.shipOrder(order.orderId);
    } catch (err) {
      console.error("[BlockchainService] Error calling shipOrder:", err);
    }
  }

  const log = new BlockchainLog({
    batchId: order.batchId,
    orderId: order.orderId,
    action: "ORDER_SHIPPED",
    performedBy: order.sellerId,
    transactionHash: txHash
  });
  await log.save();

  return { order, log };
};

/**
 * Get incoming orders for a Farmer (as seller)
 */
export const getFarmerOrders = async (farmerId) => {
  if (!farmerId) {
    throw new Error("Farmer ID is required");
  }
  return await Order.find({ sellerId: farmerId }).sort({ createdAt: -1 });
};

/**
 * Get single order details
 */
export const getOrderById = async (orderId) => {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  return order;
};

export default {
  createOrder,
  acceptOrder,
  shipOrder,
  getFarmerOrders,
  getOrderById
};
