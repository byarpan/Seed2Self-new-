import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay Order
 * @param {number} amount - Amount in INR (will be converted to paise)
 * @param {string} currency - Currency code (default: INR)
 * @returns {Promise<object>} Razorpay Order object
 */
export const createRazorpayOrder = async (amount, currency = "INR") => {
  console.log(`[LOG] Creating Razorpay Order - Amount: ₹${amount}`);
  const options = {
    amount: Math.round(amount * 100), // convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log(`[LOG] Razorpay Order Created: ${order.id}`);
    return order;
  } catch (error) {
    console.error(`[ERROR] Failed to create Razorpay order:`, error);
    throw error;
  }
};

/**
 * Verify Razorpay Signature
 * @param {string} razorpayOrderId
 * @param {string} razorpayPaymentId
 * @param {string} signature
 * @returns {boolean} True if signature is valid
 */
export const verifyRazorpaySignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  console.log(`[LOG] Payment Verification - Order: ${razorpayOrderId}, Payment: ${razorpayPaymentId}`);
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isValid = expectedSignature === signature;
  console.log(`[LOG] Razorpay Signature Valid: ${isValid}`);
  return isValid;
};
