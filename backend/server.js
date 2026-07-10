import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Models
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import BlockchainLog from "./models/BlockchainLog.js";
import blockchainService from "./services/blockchainService.js";
import paymentRoutes from "./routes/paymentRoutes.js";

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

/* ==========================================================================
   USER ENDPOINTS
   ========================================================================== */
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================================================
   PRODUCT & BATCH TRACEABILITY ENDPOINTS
   ========================================================================== */

// Create a new product (e.g., initial Farmer harvest batch)
app.post("/api/products", async (req, res) => {
  try {
    const { cropName, quantity, unit, pricePerUnit, harvestDate, location, currentOwnerId, currentOwnerRole, description } = req.body;
    
    const totalPrice = quantity * pricePerUnit;

    const product = new Product({
      cropName,
      quantity,
      unit,
      pricePerUnit,
      totalPrice,
      harvestDate: new Date(harvestDate),
      location,
      currentOwnerId,
      currentOwnerRole,
      description,
      parentBatchIds: []
    });

    await product.save();
    console.log(`[LOG] Product Created: ${product.batchId} (${product.cropName}) - Qty: ${product.quantity} ${product.unit}`);

    let txHash = `tx-create-${Date.now()}`;
    if (blockchainService.isReady()) {
      try {
        txHash = await blockchainService.createBatch(
          product.batchId,
          product.quantity,
          product.cropName,
          product.currentOwnerRole,
          "AVAILABLE"
        );
      } catch (err) {
        console.error("[BlockchainService] Error calling createBatch:", err);
      }
    }

    // Log the transaction proof
    const log = new BlockchainLog({
      batchId: product.batchId,
      action: "BATCH_CREATED",
      performedBy: currentOwnerId,
      transactionHash: txHash
    });
    await log.save();

    res.status(201).json({ product, log });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Split an existing batch (Parent Batch quantity decreases, Child Batch is created)
app.post("/api/products/split", async (req, res) => {
  try {
    const { parentBatchId, quantityToSplit, newOwnerId, newOwnerRole, location, performedBy } = req.body;

    if (!parentBatchId || !quantityToSplit || !newOwnerId || !newOwnerRole) {
      return res.status(400).json({ error: "Missing required fields for batch splitting." });
    }

    const parent = await Product.findOne({ batchId: parentBatchId });
    if (!parent) {
      return res.status(404).json({ error: "Parent batch not found." });
    }

    if (parent.quantity < quantityToSplit) {
      return res.status(400).json({ error: `Insufficient quantity in parent batch. Available: ${parent.quantity} ${parent.unit}` });
    }

    // 1. Deduct quantity from Parent Batch
    parent.quantity = parseFloat((parent.quantity - quantityToSplit).toFixed(2));
    parent.totalPrice = parseFloat((parent.quantity * parent.pricePerUnit).toFixed(2));
    parent.status = parent.quantity === 0 ? "SOLD" : "PARTIALLY_SOLD";
    await parent.save();
    console.log(`[LOG] Batch Updated (Split Parent): ${parent.batchId} - Qty adjusted to: ${parent.quantity} ${parent.unit}`);

    // 2. Create the split Child Batch
    const child = new Product({
      parentBatchIds: [parentBatchId],
      currentOwnerId: newOwnerId,
      currentOwnerRole: newOwnerRole,
      cropName: parent.cropName,
      quantity: quantityToSplit,
      unit: parent.unit,
      pricePerUnit: parent.pricePerUnit,
      totalPrice: parseFloat((quantityToSplit * parent.pricePerUnit).toFixed(2)),
      qualityGrade: parent.qualityGrade,
      harvestDate: parent.harvestDate,
      location: location || parent.location,
      status: "AVAILABLE",
      description: `Split from ${parentBatchId}`
    });
    await child.save();
    console.log(`[LOG] Product Created (Split Child): ${child.batchId} (${child.cropName}) - Qty: ${child.quantity} ${child.unit}`);

    let parentTxHash = `tx-split-parent-${Date.now()}`;
    let childTxHash = `tx-split-child-${Date.now()}`;

    if (blockchainService.isReady()) {
      try {
        childTxHash = await blockchainService.splitBatch(
          parentBatchId,
          child.batchId,
          quantityToSplit,
          newOwnerId,
          newOwnerRole
        );
        parentTxHash = childTxHash;
      } catch (err) {
        console.error("[BlockchainService] Error calling splitBatch:", err);
      }
    }

    // 3. Create blockchain logs for trace tracking
    const parentLog = new BlockchainLog({
      batchId: parent.batchId,
      action: "BATCH_SPLIT",
      performedBy,
      transactionHash: parentTxHash
    });
    await parentLog.save();

    const childLog = new BlockchainLog({
      batchId: child.batchId,
      action: "BATCH_CREATED",
      performedBy,
      transactionHash: childTxHash
    });
    await childLog.save();

    res.status(201).json({
      message: "Batch split successfully",
      parent,
      child
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Merge multiple parent batches into one processed child batch
app.post("/api/products/merge", async (req, res) => {
  try {
    const { parentBatches, newCropName, newQuantity, newUnit, newPricePerUnit, newOwnerId, newOwnerRole, location, performedBy } = req.body;

    if (!parentBatches || !Array.isArray(parentBatches) || parentBatches.length === 0) {
      return res.status(400).json({ error: "Parent batches must be provided as a non-empty array." });
    }

    const parentBatchIds = [];
    
    // Deduct quantities from all parent batches
    for (const item of parentBatches) {
      const parent = await Product.findOne({ batchId: item.batchId });
      if (!parent) {
        return res.status(404).json({ error: `Parent batch ${item.batchId} not found.` });
      }
      if (parent.quantity < item.quantityTaken) {
        return res.status(400).json({ error: `Insufficient quantity in batch ${item.batchId}.` });
      }

      parent.quantity = parseFloat((parent.quantity - item.quantityTaken).toFixed(2));
      parent.totalPrice = parseFloat((parent.quantity * parent.pricePerUnit).toFixed(2));
      parent.status = parent.quantity === 0 ? "SOLD" : "PARTIALLY_SOLD";
      await parent.save();
      console.log(`[LOG] Batch Updated (Merged Parent): ${parent.batchId} - Qty adjusted to: ${parent.quantity} ${parent.unit}`);

      parentBatchIds.push(item.batchId);

      // Create log for parent batch depletion
      const parentLog = new BlockchainLog({
        batchId: parent.batchId,
        action: "BATCH_SPLIT",
        performedBy,
        transactionHash: `tx-merge-deplete-${Date.now()}`
      });
      await parentLog.save();
    }

    // Create the merged child batch
    const pricePerUnit = newPricePerUnit || 10; // Fallback or defined price
    const child = new Product({
      parentBatchIds,
      currentOwnerId: newOwnerId,
      currentOwnerRole: newOwnerRole,
      cropName: newCropName,
      quantity: newQuantity,
      unit: newUnit || "kg",
      pricePerUnit,
      totalPrice: newQuantity * pricePerUnit,
      harvestDate: new Date(),
      location: location || "Processing Facility",
      status: "AVAILABLE",
      description: `Merged processed batch from: ${parentBatchIds.join(", ")}`
    });

    await child.save();
    console.log(`[LOG] Product Created (Merged Child): ${child.batchId} (${child.cropName}) - Qty: ${child.quantity} ${child.unit}`);

    let childTxHash = `tx-merge-create-${Date.now()}`;
    if (blockchainService.isReady()) {
      try {
        childTxHash = await blockchainService.mergeBatch(
          parentBatchIds,
          child.batchId,
          newQuantity,
          newCropName,
          newOwnerRole
        );
      } catch (err) {
        console.error("[BlockchainService] Error calling mergeBatch:", err);
      }
    }

    // Create logs for child batch creation/merge
    const mergeLog = new BlockchainLog({
      batchId: child.batchId,
      action: "BATCH_MERGED",
      performedBy,
      transactionHash: childTxHash
    });
    await mergeLog.save();

    res.status(201).json({
      message: "Batches merged successfully",
      child
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recursive Tree Traceability API
app.get("/api/trace/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;

    const traceRecursively = async (bId) => {
      const product = await Product.findOne({ batchId: bId });
      if (!product) return null;

      // Fetch user profile info of current owner
      const owner = await User.findOne({ 
        $or: [
          { farmerId: product.currentOwnerId },
          { processorId: product.currentOwnerId },
          { email: product.currentOwnerId },
          { name: product.currentOwnerId }
        ]
      }, { name: 1, role: 1 });

      const node = {
        batchId: product.batchId,
        productId: product.productId,
        cropName: product.cropName,
        quantity: product.quantity,
        unit: product.unit,
        pricePerUnit: product.pricePerUnit,
        totalPrice: product.totalPrice,
        harvestDate: product.harvestDate,
        location: product.location,
        status: product.status,
        currentOwnerId: product.currentOwnerId,
        currentOwnerRole: product.currentOwnerRole,
        currentOwnerName: owner ? owner.name : product.currentOwnerId,
        parentBatchIds: product.parentBatchIds,
        parents: []
      };

      // Query logs
      const logs = await BlockchainLog.find({ batchId: bId }).sort({ timestamp: 1 });
      node.logs = logs;

      // Traverse recursively if there are parents
      if (product.parentBatchIds && product.parentBatchIds.length > 0) {
        for (const pId of product.parentBatchIds) {
          const parentNode = await traceRecursively(pId);
          if (parentNode) {
            node.parents.push(parentNode);
          }
        }
      }

      return node;
    };

    const tree = await traceRecursively(batchId);
    if (!tree) {
      return res.status(404).json({ error: `Batch ID ${batchId} not found in traceability records.` });
    }

    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cropName, quantity, harvestDate, isListed, pricePerUnit, location, description } = req.body;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (cropName !== undefined) product.cropName = cropName;
    if (quantity !== undefined) {
      product.quantity = parseFloat(quantity);
      product.totalPrice = product.quantity * (pricePerUnit || product.pricePerUnit || 100);
    }
    if (pricePerUnit !== undefined) {
      product.pricePerUnit = parseFloat(pricePerUnit);
      product.totalPrice = (product.quantity || 0) * product.pricePerUnit;
    }
    if (harvestDate !== undefined) product.harvestDate = new Date(harvestDate);
    if (location !== undefined) product.location = location;
    if (description !== undefined) product.description = description;

    if (isListed !== undefined) {
      product.status = isListed ? "AVAILABLE" : "RESERVED";
    }

    await product.save();

    console.log(`[LOG] Product Updated: ${product.batchId} (${product.cropName}) - Qty: ${product.quantity} ${product.unit}`);

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { batchId: id };
    
    const product = await Product.findOne(query);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await Product.deleteOne(query);

    console.log(`[LOG] Product Deleted: ${product.batchId} (${product.cropName})`);

    res.json({ message: "Product deleted successfully", batchId: product.batchId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================================================
   ORDER ENDPOINTS
   ========================================================================== */
app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      orderStatus: "PENDING", // PENDING_FARMER_ACCEPTANCE
      paymentStatus: "LOCKED", // PAYMENT LOCKED
      escrowStatus: "LOCKED",
      deliveryStatus: "PENDING"
    });
    await order.save();
    console.log(`[LOG] Order Created: ${order.orderId} for Batch: ${order.batchId} - Qty: ${order.quantityPurchased} - Amount: ${order.amount}`);

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

    // Create log representing locked escrow action
    const log = new BlockchainLog({
      batchId: order.batchId,
      orderId: order.orderId,
      action: "PAYMENT_LOCKED",
      performedBy: order.buyerId,
      transactionHash: txHash
    });
    await log.save();

    res.status(201).json({ order, log });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put("/api/orders/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.orderStatus = "ACCEPTED";
    await order.save();

    console.log(`[LOG] Order Accepted: ${order.orderId}`);

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
      action: "FARMER_ACCEPTED",
      performedBy: order.sellerId,
      transactionHash: txHash
    });
    await log.save();

    res.json({ order, log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/orders/:id/ship", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.deliveryStatus = "SHIPPED";
    await order.save();

    console.log(`[LOG] Order Shipped: ${order.orderId}`);

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
      action: "SHIPMENT_STARTED",
      performedBy: order.sellerId,
      transactionHash: txHash
    });
    await log.save();

    res.json({ order, log });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/orders/:id/confirm-delivery", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ orderId: id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.deliveryStatus === "DELIVERED" || order.orderStatus === "COMPLETED") {
      return res.status(400).json({ error: "Delivery has already been confirmed for this order." });
    }

    order.deliveryStatus = "DELIVERED";
    order.paymentStatus = "PAYMENT_RELEASED";
    order.escrowStatus = "RELEASED";
    order.orderStatus = "COMPLETED";
    await order.save();

    console.log(`[LOG] Delivery Confirmed & Escrow Released for: ${order.orderId}`);

    let confirmTxHash = `tx-confirm-${order.orderId}-${Date.now()}`;
    let releaseTxHash = `tx-release-${order.orderId}-${Date.now()}`;
    let transferTxHash = `tx-transfer-${order.batchId}-${Date.now()}`;

    if (blockchainService.isReady()) {
      try {
        confirmTxHash = await blockchainService.confirmDelivery(order.orderId);
        releaseTxHash = await blockchainService.releasePayment(order.orderId);
      } catch (err) {
        console.error("[BlockchainService] Error confirming or releasing payment:", err);
      }
    }

    // Deduct/split parent product and transfer ownership to the buyer in MongoDB Products collection
    const parent = await Product.findOne({ batchId: order.batchId });
    if (parent) {
      const child = new Product({
        parentBatchIds: [order.batchId],
        currentOwnerId: order.buyerId,
        currentOwnerRole: order.buyerRole,
        cropName: parent.cropName,
        quantity: order.quantityPurchased,
        unit: parent.unit,
        pricePerUnit: parent.pricePerUnit,
        totalPrice: order.quantityPurchased * parent.pricePerUnit,
        qualityGrade: parent.qualityGrade,
        harvestDate: parent.harvestDate,
        location: parent.location,
        status: "AVAILABLE",
        description: `Purchased and transferred from parent batch ${order.batchId}`
      });
      await child.save();

      const rawQty = parent.quantity - order.quantityPurchased;
      parent.quantity = Math.max(0, parseFloat(rawQty.toFixed(2)));
      parent.totalPrice = parseFloat((parent.quantity * parent.pricePerUnit).toFixed(2));
      parent.status = parent.quantity === 0 ? "SOLD" : "PARTIALLY_SOLD";
      await parent.save();

      console.log(`[LOG] Batch split & ownership transferred for child ${child.batchId}. Parent qty adjusted.`);

      if (blockchainService.isReady()) {
        try {
          await blockchainService.createBatch(
            child.batchId,
            child.quantity,
            child.cropName,
            child.currentOwnerRole,
            "AVAILABLE"
          );
          transferTxHash = await blockchainService.transferOwnership(
            child.batchId,
            order.buyerId,
            order.buyerRole
          );
        } catch (err) {
          console.error("[BlockchainService] Error calling transferOwnership:", err);
        }
      }
    }

    const confirmLog = new BlockchainLog({
      batchId: order.batchId,
      orderId: order.orderId,
      action: "SHIPMENT_DELIVERED",
      performedBy: order.buyerId,
      transactionHash: confirmTxHash
    });
    await confirmLog.save();

    const releaseLog = new BlockchainLog({
      batchId: order.batchId,
      orderId: order.orderId,
      action: "PAYMENT_RELEASED",
      performedBy: order.buyerId,
      transactionHash: releaseTxHash
    });
    await releaseLog.save();

    const transferLog = new BlockchainLog({
      batchId: order.batchId,
      orderId: order.orderId,
      action: "OWNERSHIP_TRANSFERRED",
      performedBy: order.buyerId,
      transactionHash: transferTxHash
    });
    await transferLog.save();

    res.json({ order, confirmLog, releaseLog, transferLog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================================================
   PAYMENT ENDPOINTS
   ========================================================================== */
app.use("/api/payments", paymentRoutes);

app.get("/api/payments", async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================================================
   BLOCKCHAIN LOGS ENDPOINTS
   ========================================================================== */
app.get("/api/blockchain-logs", async (req, res) => {
  try {
    const logs = await BlockchainLog.find({}).sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Seed2Shelf backend server running on port ${PORT}`);
});
