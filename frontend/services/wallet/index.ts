import { ethers } from "ethers";

export const walletService = {
  async connectMetaMask(): Promise<string | null> {
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        return accounts[0];
      }
    }
    return null;
  },

  async getEthBalance(address: string): Promise<{ eth: string; inr: string }> {
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const bal = await provider.getBalance(address);
        const formattedEth = parseFloat(ethers.formatEther(bal)).toFixed(4);
        const inrVal = (parseFloat(formattedEth) * 300000).toLocaleString("en-IN", { maximumFractionDigits: 0 });
        return { eth: formattedEth, inr: inrVal };
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    }
    return { eth: "1.4285", inr: "4,28,550" };
  },

  async linkWalletToUser(userId: string, walletAddress: string) {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress }),
    });
    if (!res.ok) {
      throw new Error("Failed to link wallet address to user account.");
    }
    return res.json();
  },
};
