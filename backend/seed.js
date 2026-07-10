import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import BlockchainLog from "./models/BlockchainLog.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/seed2shelf";

async function runSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    // Clear previous collections for clean test run
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await BlockchainLog.deleteMany({});

    console.log("Creating default users...");
    const farmerA = new User({
      name: "Ramesh Kumar (Farmer A)",
      email: "farmerA@demo.com",
      password: "password123",
      role: "FARMER",
      farmerId: "FARM000001",
      state: "Maharashtra",
      district: "Pune",
      village: "Manchar"
    });
    await farmerA.save();

    const farmerB = new User({
      name: "Suresh Patil (Farmer B)",
      email: "farmerB@demo.com",
      password: "password123",
      role: "FARMER",
      farmerId: "FARM000002",
      state: "Maharashtra",
      district: "Pune",
      village: "Narayangaon"
    });
    await farmerB.save();

    const processor = new User({
      name: "Organic Pulp Inc. (Processor)",
      email: "processor@demo.com",
      password: "password123",
      role: "PROCESSOR",
      processorId: "S2S-PRC-000001",
      state: "Maharashtra",
      district: "Mumbai"
    });
    await processor.save();

    const distributor = new User({
      name: "Fresh Freight (Distributor)",
      email: "distributor@demo.com",
      password: "password123",
      role: "DISTRIBUTOR",
      state: "Maharashtra",
      district: "Thane"
    });
    await distributor.save();

    const retailer = new User({
      name: "SuperMart Retail (Retailer)",
      email: "retailer@demo.com",
      password: "password123",
      role: "RETAILER",
      state: "Maharashtra",
      district: "Mumbai"
    });
    await retailer.save();

    console.log("Users created successfully.");

    /* ==========================================================================
       SCENARIO: Farmer A and Farmer B create crop batches
       ========================================================================== */
    console.log("\nCreating Farmer A Mango Harvest Batch...");
    const batch1 = new Product({
      cropName: "Alphonso Mangoes",
      quantity: 40,
      unit: "kg",
      pricePerUnit: 120,
      totalPrice: 4800,
      harvestDate: new Date(),
      location: "Ramesh Farm, Manchar",
      currentOwnerId: farmerA.farmerId,
      currentOwnerRole: "FARMER",
      description: "Organic Alphonso Mangoes, Grade A Quality"
    });
    await batch1.save();
    console.log(`Created: ${batch1.batchId} (${batch1.cropName}) - Qty: ${batch1.quantity} ${batch1.unit}`);

    const log1 = new BlockchainLog({
      batchId: batch1.batchId,
      action: "BATCH_CREATED",
      performedBy: farmerA.farmerId,
      transactionHash: `tx-${batch1.batchId}-create`
    });
    await log1.save();

    console.log("Creating Farmer B Mango Harvest Batch...");
    const batch2 = new Product({
      cropName: "Alphonso Mangoes",
      quantity: 30,
      unit: "kg",
      pricePerUnit: 110,
      totalPrice: 3300,
      harvestDate: new Date(),
      location: "Patil Mango Grove, Narayangaon",
      currentOwnerId: farmerB.farmerId,
      currentOwnerRole: "FARMER",
      description: "Sweet organic mangoes, ripe quality"
    });
    await batch2.save();
    console.log(`Created: ${batch2.batchId} (${batch2.cropName}) - Qty: ${batch2.quantity} ${batch2.unit}`);

    const log2 = new BlockchainLog({
      batchId: batch2.batchId,
      action: "BATCH_CREATED",
      performedBy: farmerB.farmerId,
      transactionHash: `tx-${batch2.batchId}-create`
    });
    await log2.save();

    /* ==========================================================================
       SCENARIO: Processor purchases 40 kg from Batch 1 and 15 kg from Batch 2, 
       merges them to create Processed Batch PB001 (55 kg Mango Pulp)
       ========================================================================== */
    console.log("\nProcessing/Merging batches to processor pulp...");
    
    // Deduct quantities
    batch1.quantity = parseFloat((batch1.quantity - 40).toFixed(2));
    batch1.totalPrice = parseFloat((batch1.quantity * batch1.pricePerUnit).toFixed(2));
    batch1.status = "SOLD";
    await batch1.save();

    batch2.quantity = parseFloat((batch2.quantity - 15).toFixed(2));
    batch2.totalPrice = parseFloat((batch2.quantity * batch2.pricePerUnit).toFixed(2));
    batch2.status = "PARTIALLY_SOLD";
    await batch2.save();

    const pulpBatch = new Product({
      parentBatchIds: [batch1.batchId, batch2.batchId],
      currentOwnerId: processor.processorId,
      currentOwnerRole: "PROCESSOR",
      cropName: "Organic Mango Pulp",
      quantity: 55,
      unit: "kg",
      pricePerUnit: 250,
      totalPrice: 13750,
      harvestDate: new Date(),
      location: "Processing Yard 3, Pune",
      status: "AVAILABLE",
      description: "Processed Alphonso Mango Pulp, unsweetened, 100% natural."
    });
    await pulpBatch.save();
    console.log(`Created Processed Batch: ${pulpBatch.batchId} (${pulpBatch.cropName}) - Qty: ${pulpBatch.quantity} ${pulpBatch.unit}`);

    const logMerge = new BlockchainLog({
      batchId: pulpBatch.batchId,
      action: "BATCH_MERGED",
      performedBy: processor.processorId,
      transactionHash: `tx-${pulpBatch.batchId}-merged`
    });
    await logMerge.save();

    /* ==========================================================================
       SCENARIO: Distributor purchases 20 kg from Processed Batch
       This splits the Processed Batch into a 20 kg Distributor Batch
       ========================================================================== */
    console.log("\nDistributor purchases 20 kg, causing a batch split...");

    pulpBatch.quantity = parseFloat((pulpBatch.quantity - 20).toFixed(2));
    pulpBatch.totalPrice = parseFloat((pulpBatch.quantity * pulpBatch.pricePerUnit).toFixed(2));
    pulpBatch.status = "PARTIALLY_SOLD";
    await pulpBatch.save();

    const distributorBatch = new Product({
      parentBatchIds: [pulpBatch.batchId],
      currentOwnerId: "DIST_PARTNER_01",
      currentOwnerRole: "DISTRIBUTOR",
      cropName: "Organic Mango Pulp",
      quantity: 20,
      unit: "kg",
      pricePerUnit: 300,
      totalPrice: 6000,
      harvestDate: pulpBatch.harvestDate,
      location: "Cold Storage Warehouse, Thane",
      status: "AVAILABLE",
      description: "Transport split of Mango Pulp batch."
    });
    await distributorBatch.save();
    console.log(`Created Distributor Batch: ${distributorBatch.batchId} - Qty: ${distributorBatch.quantity} ${distributorBatch.unit}`);

    const logSplitChild = new BlockchainLog({
      batchId: distributorBatch.batchId,
      action: "BATCH_SPLIT",
      performedBy: processor.processorId,
      transactionHash: `tx-${distributorBatch.batchId}-split-dist`
    });
    await logSplitChild.save();

    /* ==========================================================================
       SCENARIO: Retailer purchases 10 kg from Distributor Batch
       Creates Retail Batch
       ========================================================================== */
    console.log("\nRetailer purchases 10 kg from Distributor...");

    distributorBatch.quantity = parseFloat((distributorBatch.quantity - 10).toFixed(2));
    distributorBatch.totalPrice = parseFloat((distributorBatch.quantity * distributorBatch.pricePerUnit).toFixed(2));
    distributorBatch.status = "PARTIALLY_SOLD";
    await distributorBatch.save();

    const retailBatch = new Product({
      parentBatchIds: [distributorBatch.batchId],
      currentOwnerId: "RETAIL_SHOP_01",
      currentOwnerRole: "RETAILER",
      cropName: "Organic Mango Pulp",
      quantity: 10,
      unit: "kg",
      pricePerUnit: 380,
      totalPrice: 3800,
      harvestDate: pulpBatch.harvestDate,
      location: "SuperMart Outlet 10, Mumbai",
      status: "AVAILABLE",
      description: "Packaged 1kg retail jars of fresh mango pulp."
    });
    await retailBatch.save();
    console.log(`Created Retail Batch: ${retailBatch.batchId} - Qty: ${retailBatch.quantity} ${retailBatch.unit}`);

    const logRetail = new BlockchainLog({
      batchId: retailBatch.batchId,
      action: "BATCH_SPLIT",
      performedBy: "DIST_PARTNER_01",
      transactionHash: `tx-${retailBatch.batchId}-split-retail`
    });
    await logRetail.save();

    console.log("\n==================================================");
    console.log("SEEDING COMPLETED SUCCESSFULLY.");
    console.log(`Scannable Retail Batch ID: ${retailBatch.batchId}`);
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("Error running seed test:", error);
    process.exit(1);
  }
}

runSeed();
