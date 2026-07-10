import ethersPlugin from "@nomicfoundation/hardhat-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [ethersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.20",
      }
    }
  }
});
