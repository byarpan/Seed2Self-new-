import paymentService from "../services/paymentService.js";

/**
 * Initiate Razorpay Order
 * POST /api/payments/create-order
 */
export const handleCreateOrder = async (req, res) => {
  const { amount, currency, orderId, buyerId, sellerId } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount provided." });
  }

  try {
    const order = await paymentService.createRazorpayOrder(amount, currency || "INR", orderId, buyerId, sellerId);
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      id: order.id,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to initiate transaction." });
  }
};

/**
 * Verify Razorpay Payment Signature
 * POST /api/payments/verify
 */
export const handleVerifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: "Missing verification parameters" });
  }

  try {
    const isVerified = await paymentService.verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isVerified) {
      return res.status(400).json({ error: "Transaction verification signature mismatched." });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully."
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error verifying payment." });
  }
};

/**
 * Get payment records for user
 * GET /api/payments?userId=...
 */
export const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId query parameter is required" });
    }
    const payments = await paymentService.getPaymentsForUser(userId);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  handleCreateOrder,
  handleVerifyPayment,
  getUserPayments
};
