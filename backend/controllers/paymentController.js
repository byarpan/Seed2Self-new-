import { createRazorpayOrder, verifyRazorpaySignature } from "../services/paymentService.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import BlockchainLog from "../models/BlockchainLog.js";
import blockchainService from "../services/blockchainService.js";

export const handleCreateOrder = async (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount provided." });
  }

  try {
    console.log(`[LOG] Creating Razorpay Order in Controller - Amount: ${amount}`);
    const order = await createRazorpayOrder(amount);
    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      id: order.id,
    });
  } catch (error) {
    console.error(`[ERROR] Razorpay order creation failed:`, error);
    res.status(500).json({ error: "Failed to initiate transaction." });
  }
};

export const handleVerifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    buyerId,
    buyerRole,
    amount,
    items
  } = req.body;

  console.log(`[LOG] Verification API Triggered for Order: ${razorpay_order_id}`);

  // 1. Validate signature
  const isVerified = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (!isVerified) {
    console.error(`[ERROR] Payment Verification Failed - Invalid Signature`);
    return res.status(400).json({ error: "Transaction verification signature mismatched." });
  }

  try {
    console.log(`[LOG] Payment Success - Verification Confirmed`);

    // 2. Log Payment into Payments collection in MongoDB
    const payment = new Payment({
      orderId: `ORD-TEMP-${Date.now()}`,
      buyerId,
      sellerId: items && items.length > 0 ? items[0].sellerId : req.body.sellerId || "UNKNOWN",
      amount,
      paymentMethod: "online",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "SUCCESS"
    });
    await payment.save();
    console.log(`[LOG] MongoDB Payment Created: ${payment.paymentId}`);

    const createdOrders = [];

    // 3. Log Orders into Orders collection in MongoDB
    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const order = new Order({
          buyerId,
          buyerRole,
          sellerId: item.sellerId,
          sellerRole: item.sellerRole,
          productId: item.productId,
          batchId: item.batchId,
          quantityPurchased: item.quantityPurchased,
          amount: item.amount,
          paymentStatus: "PAYMENT_LOCKED",
          deliveryStatus: "PENDING",
          escrowStatus: "LOCKED",
          blockchainStatus: "CREATED",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          orderStatus: "PENDING"
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

        createdOrders.push(order);
        console.log(`[LOG] MongoDB Order Created: ${order.orderId} for batch ${item.batchId}`);

        // 4. Log to BlockchainLogs collection
        const log = new BlockchainLog({
          batchId: item.batchId,
          orderId: order.orderId,
          action: "PAYMENT_LOCKED",
          performedBy: buyerId,
          transactionHash: txHash
        });
        await log.save();
      }
    } else {
      // Single fallback
      const order = new Order({
        buyerId,
        buyerRole,
        sellerId: req.body.sellerId,
        sellerRole: req.body.sellerRole,
        productId: req.body.productId,
        batchId: req.body.batchId,
        quantityPurchased: req.body.quantityPurchased,
        amount,
        paymentStatus: "PAYMENT_LOCKED",
        deliveryStatus: "PENDING",
        escrowStatus: "LOCKED",
        blockchainStatus: "CREATED",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        orderStatus: "PENDING"
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

      createdOrders.push(order);
      console.log(`[LOG] MongoDB Order Created: ${order.orderId} (single fallback)`);

      const log = new BlockchainLog({
        batchId: req.body.batchId,
        orderId: order.orderId,
        action: "PAYMENT_LOCKED",
        performedBy: buyerId,
        transactionHash: txHash
      });
      await log.save();
    }

    // Update payment reference order ID
    payment.orderId = createdOrders.map(o => o.orderId).join(", ");
    await payment.save();

    res.json({
      success: true,
      message: "Payment verified and order created successfully.",
      orders: createdOrders.map(o => ({ orderId: o.orderId, batchId: o.batchId })),
      paymentId: payment.paymentId
    });
  } catch (error) {
    console.error(`[ERROR] Error finalizing MongoDB documents:`, error);
    res.status(500).json({ error: "Internal server error saving verified order." });
  }
};
