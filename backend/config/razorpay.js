// TODO: Initialize Razorpay instance with environment keys
const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || ""
};

export default razorpayConfig;
