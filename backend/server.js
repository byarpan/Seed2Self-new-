import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import blockchainLogRoutes from "./routes/blockchainLogRoutes.js";
import traceRoutes from "./routes/traceRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", service: "seed2shelf-backend" });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/blockchain-logs", blockchainLogRoutes);
app.use("/api/trace", traceRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Seed2Shelf backend server running on port ${PORT}`);
});
