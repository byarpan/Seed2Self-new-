import { useState, useEffect } from "react";
import { useSession, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { ethers } from "ethers";
import { Wallet as WalletIcon, ArrowLeftRight, Receipt, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function WalletDashboard() {
  const { data: session, update } = useSession();
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.00");
  const [inrBalance, setInrBalance] = useState<string>("0");

  useEffect(() => {
    if (session?.user?.walletAddress) {
      setWallet(session.user.walletAddress);
      fetchBalance(session.user.walletAddress);
    } else {
      setWallet(null);
      setBalance("0.00");
      setInrBalance("0");
    }
  }, [session]);

  const fetchBalance = async (address: string) => {
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const bal = await provider.getBalance(address);
        const formatted = parseFloat(ethers.formatEther(bal)).toFixed(4);
        setBalance(formatted);
        // Assuming 1 ETH = 3,00,000 INR for agricultural mock pricing representation
        setInrBalance((parseFloat(formatted) * 300000).toLocaleString("en-IN", { maximumFractionDigits: 0 }));
      } catch (err) {
        console.error("Failed to fetch real balance, falling back to mock", err);
        setBalance("1.4285");
        setInrBalance("4,28,550");
      }
    } else {
      // Fallback mock data if provider not found
      setBalance("1.4285");
      setInrBalance("4,28,550");
    }
  };

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof (window as any).ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          const newWallet = accounts[0];
          setWallet(newWallet);
          if (session?.user?.id) {
            await fetch(`/api/users/${session.user.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ walletAddress: newWallet }),
            });
            await update({ walletAddress: newWallet });
          }
          fetchBalance(newWallet);
        }
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = async () => {
    setWallet(null);
    setBalance("0.00");
    setInrBalance("0");
    if (session?.user?.id) {
      await fetch(`/api/users/${session.user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: null }),
      });
      await update({ walletAddress: null });
    }
  };

  const mockTransactions = [
    {
      id: "tx-1",
      action: "Register Batch Escrow",
      hash: "0x9a8f23c71de430aef48b6c72378aef192837bcde",
      type: "DEPOSIT",
      amount: "0.1500 ETH",
      date: "July 07, 2026",
      status: "COMPLETED"
    },
    {
      id: "tx-2",
      action: "Log Harvest Escrow Lock",
      hash: "0x6e23b128af937cde72b4c10283fa71b9283b190f",
      type: "LOCK",
      amount: "0.3200 ETH",
      date: "July 05, 2026",
      status: "COMPLETED"
    },
    {
      id: "tx-3",
      action: "Release Payout to Farmer",
      hash: "0x1d7c8ab2ef012cf94ba83d71239c894fb20d481a",
      type: "WITHDRAWAL",
      amount: "0.4500 ETH",
      date: "July 02, 2026",
      status: "COMPLETED"
    },
    {
      id: "tx-4",
      action: "Weight Shrinkage Penalty Payout",
      hash: "0x3f5da0a1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7",
      type: "PENALTY",
      amount: "0.0250 ETH",
      date: "June 28, 2026",
      status: "COMPLETED"
    }
  ];

  const mockInvoices = [
    {
      id: "INV-2026-081",
      batch: "Batch #SF-1024",
      item: "Premium Alphonso Mangoes",
      amount: "₹45,000",
      date: "July 07, 2026",
      status: "PAID"
    },
    {
      id: "INV-2026-079",
      batch: "Batch #SF-1021",
      item: "Organic Basmati Rice",
      amount: "₹96,000",
      date: "July 04, 2026",
      status: "PAID"
    },
    {
      id: "INV-2026-072",
      batch: "Batch #SF-1018",
      item: "Fresh Nagpur Oranges",
      amount: "₹18,500",
      date: "June 30, 2026",
      status: "PENDING"
    },
    {
      id: "INV-2026-068",
      batch: "Batch #SF-1011",
      item: "Desi Ghee Organic",
      amount: "₹24,800",
      date: "June 25, 2026",
      status: "PAID"
    }
  ];

  return (
    <div className="min-h-screen relative text-white pt-10">
      <Head>
        <title>Wallet Dashboard | Seed2Shelf</title>
      </Head>

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1"
          className="w-full h-full object-cover opacity-20"
          alt=""
        />
        <div className="absolute inset-0 bg-stone-950/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <WalletIcon className="h-10 w-10 text-[#00d26a]" />
            Wallet <span className="text-[#00d26a]">Dashboard</span>
          </h1>
          <p className="text-stone-400 mt-2 font-medium">Manage your linked blockchain accounts, track escrowed balances, and review agriculture handoff invoices.</p>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Balance & Account */}
          <div className="lg:col-span-1 space-y-6">
            <div id="wallet-balance" className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between h-[360px] relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#00d26a]/5 blur-3xl rounded-full group-hover:bg-[#00d26a]/10 transition-all duration-500"></div>
              
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-400">Total Wallet Balance</span>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black border ${
                    wallet ? 'bg-[#00d26a]/20 text-[#00d26a] border-[#00d26a]/20' : 'bg-red-500/20 text-red-400 border-red-500/20'
                  }`}>
                    {wallet ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>
                
                <h2 className="text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                  {balance} <span className="text-lg font-black text-[#00d26a]">ETH</span>
                </h2>
                <p className="text-stone-400 font-bold mt-2">≈ ₹{inrBalance}</p>
              </div>

              <div className="space-y-4">
                {wallet ? (
                  <div className="space-y-3">
                    <div className="bg-black/40 border border-white/5 p-3 rounded-2xl">
                      <p className="text-[10px] text-stone-500 font-bold uppercase mb-1">MetaMask Address</p>
                      <p className="font-mono text-xs text-blue-400 break-all">{wallet}</p>
                    </div>
                    <button 
                      onClick={disconnectWallet}
                      className="w-full bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 font-bold py-3.5 rounded-xl transition cursor-pointer"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-400 italic">No web3 wallet connected. Connect your wallet to sync on-chain payments.</p>
                    <button 
                      onClick={connectWallet}
                      className="w-full bg-[#00d26a] hover:bg-[#00b25a] text-black font-extrabold py-4 rounded-xl transition shadow-lg shadow-[#00d26a]/20 hover:scale-[1.01] cursor-pointer"
                    >
                      Connect Web3 Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Stats Card */}
            <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-green-300">Wallet Balance Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-stone-400">Escrow Hold Balance</span>
                  <span className="font-bold text-yellow-500">0.3200 ETH</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-stone-400">Total Safe Earnings</span>
                  <span className="font-bold text-green-400">0.9585 ETH</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400">Disputed Transactions</span>
                  <span className="font-bold text-red-400">0.0000 ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transactions & Invoices */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Transactions Section */}
            <div id="transactions" className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-2">
                <ArrowLeftRight className="h-6 w-6 text-[#00d26a]" />
                Recent Blockchain Transactions
              </h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 bg-white/5 border border-white/5 hover:bg-white/10 transition rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${
                        tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL' 
                          ? 'bg-[#00d26a]/10 border-[#00d26a]/20 text-[#00d26a]' 
                          : tx.type === 'LOCK' 
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}>
                        {tx.type === 'DEPOSIT' ? <ArrowUpRight className="h-5 w-5" /> : tx.type === 'WITHDRAWAL' ? <ArrowDownRight className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{tx.action}</h4>
                        <p className="text-xs text-stone-500 font-mono mt-0.5 truncate max-w-[220px] md:max-w-xs">{tx.hash}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className={`font-bold text-sm ${
                        tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL' ? 'text-[#00d26a]' : 'text-stone-300'
                      }`}>{tx.amount}</span>
                      <span className="text-[10px] text-stone-500 mt-1">{tx.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices Section */}
            <div id="invoices" className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-2">
                <Receipt className="h-6 w-6 text-[#00d26a]" />
                Agricultural Handoff Invoices
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 text-xs font-black uppercase">
                      <th className="pb-3">Invoice ID</th>
                      <th className="pb-3">Batch Info</th>
                      <th className="pb-3">Produce</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 font-bold text-white">{inv.id}</td>
                        <td className="py-4 text-stone-300">{inv.batch}</td>
                        <td className="py-4 text-stone-300">{inv.item}</td>
                        <td className="py-4 font-bold text-white">{inv.amount}</td>
                        <td className="py-4">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-black border ${
                            inv.status === 'PAID' 
                              ? 'bg-[#00d26a]/15 text-[#00d26a] border-[#00d26a]/20' 
                              : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { user: session.user } };
};
