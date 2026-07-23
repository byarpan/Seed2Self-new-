import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeftRight, ArrowUpRight, ArrowDownRight, Clock, ArrowLeft } from "lucide-react";

export default function WalletTransactions() {
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

  return (
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Wallet Transactions | Seed2Shelf</title>
      </Head>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/farmer/wallet"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ArrowLeftRight className="w-7 h-7 text-[#00d26a]" />
              Wallet Transactions
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              On-chain escrow transaction history and payout logs.
            </p>
          </div>
        </div>

        <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="p-5 bg-white/5 border border-white/5 hover:bg-white/10 transition rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                    <p className="text-xs text-stone-500 font-mono mt-0.5">{tx.hash}</p>
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

      </div>
    </div>
  );
}
