import { network } from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Starting deployment of Seed2ShelfEscrow...");

  const { ethers } = await network.connect();
  const escrow = await ethers.deployContract("Seed2ShelfEscrow");
  await escrow.waitForDeployment();

  const contractAddress = await escrow.getAddress();
  console.log("Seed2ShelfEscrow deployed to:", contractAddress);

  // Write ABI and deployed address to backend configuration
  const configPath = path.join(__dirname, "../../backend/config/blockchain.json");
  
  // Make sure backend/config exists
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Get the artifact to extract ABI
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/Seed2ShelfEscrow.sol/Seed2ShelfEscrow.json"
  );
  
  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  } else {
    console.error("Artifact not found at:", artifactPath);
  }

  const blockchainConfig = {
    address: contractAddress,
    abi: abi,
    rpcUrl: "http://localhost:8545"
  };

  fs.writeFileSync(configPath, JSON.stringify(blockchainConfig, null, 2), "utf8");
  console.log("Blockchain configuration written to:", configPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
