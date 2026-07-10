import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "../config/blockchain.json");

let provider;
let wallet;
let escrowContract;
let isReady = false;

function init() {
  if (!fs.existsSync(configPath)) {
    console.warn("[BlockchainService] blockchain.json config not found. Run deployment script first.");
    return;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    provider = new ethers.JsonRpcProvider(config.rpcUrl || "http://localhost:8545");
    
    // We use account 0 from hardhat default local accounts as the main admin/signer
    // Default Hardhat account 0 private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    wallet = new ethers.Wallet(privateKey, provider);
    
    escrowContract = new ethers.Contract(config.address, config.abi, wallet);
    isReady = true;
    console.log(`[BlockchainService] Connected to Seed2ShelfEscrow at ${config.address}`);
  } catch (error) {
    console.error("[BlockchainService] Initialization error:", error);
  }
}

// Automatically initialize
init();

async function createBatch(batchId, quantity, cropName, role, status) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending createBatch transaction for ${batchId}`);
  const tx = await escrowContract.createBatch(batchId, ethers.toBigInt(Math.floor(quantity)), cropName, role, status);
  const receipt = await tx.wait();
  console.log(`[BlockchainService] createBatch confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function splitBatch(parentBatchId, childBatchId, quantityToSplit, newOwner, newOwnerRole) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending splitBatch transaction for ${parentBatchId} -> ${childBatchId}`);
  const targetAddress = wallet.address;
  
  const tx = await escrowContract.splitBatch(
    parentBatchId,
    childBatchId,
    ethers.toBigInt(Math.floor(quantityToSplit)),
    targetAddress,
    newOwnerRole
  );
  const receipt = await tx.wait();
  console.log(`[BlockchainService] splitBatch confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function mergeBatch(parentBatchIds, childBatchId, newQuantity, cropName, role) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending mergeBatch transaction to child ${childBatchId}`);
  const tx = await escrowContract.mergeBatch(
    parentBatchIds,
    childBatchId,
    ethers.toBigInt(Math.floor(newQuantity)),
    cropName,
    role
  );
  const receipt = await tx.wait();
  console.log(`[BlockchainService] mergeBatch confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function createOrder(orderId, seller, amount, quantity, batchId) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending createOrder transaction for ${orderId}`);
  const sellerAddress = wallet.address;
  
  const valueToSend = ethers.toBigInt(Math.floor(amount));
  const tx = await escrowContract.createOrder(
    orderId,
    sellerAddress,
    valueToSend,
    ethers.toBigInt(Math.floor(quantity)),
    batchId,
    { value: valueToSend }
  );
  const receipt = await tx.wait();
  console.log(`[BlockchainService] createOrder confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function acceptOrder(orderId) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending acceptOrder transaction for ${orderId}`);
  const tx = await escrowContract.acceptOrder(orderId);
  const receipt = await tx.wait();
  console.log(`[BlockchainService] acceptOrder confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function shipOrder(orderId) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending shipOrder transaction for ${orderId}`);
  const tx = await escrowContract.shipOrder(orderId);
  const receipt = await tx.wait();
  console.log(`[BlockchainService] shipOrder confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function confirmDelivery(orderId) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending confirmDelivery transaction for ${orderId}`);
  const tx = await escrowContract.confirmDelivery(orderId);
  const receipt = await tx.wait();
  console.log(`[BlockchainService] confirmDelivery confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function releasePayment(orderId) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending releasePayment transaction for ${orderId}`);
  const tx = await escrowContract.releasePayment(orderId);
  const receipt = await tx.wait();
  console.log(`[BlockchainService] releasePayment confirmed: ${receipt.hash}`);
  return receipt.hash;
}

async function transferOwnership(batchId, newOwner, newOwnerRole) {
  if (!isReady) init();
  if (!isReady) throw new Error("Contract service not initialized");

  console.log(`[BlockchainService] Sending transferOwnership transaction for ${batchId} to ${newOwner}`);
  const targetAddress = wallet.address;
  const tx = await escrowContract.transferOwnership(batchId, targetAddress, newOwnerRole);
  const receipt = await tx.wait();
  console.log(`[BlockchainService] transferOwnership confirmed: ${receipt.hash}`);
  return receipt.hash;
}

export default {
  isReady: () => isReady,
  init,
  createBatch,
  splitBatch,
  mergeBatch,
  createOrder,
  acceptOrder,
  shipOrder,
  confirmDelivery,
  releasePayment,
  transferOwnership
};
