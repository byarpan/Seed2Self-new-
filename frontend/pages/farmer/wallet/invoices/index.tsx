import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Receipt, ArrowLeft, Download, FileText } from "lucide-react";

export default function WalletInvoices() {
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
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Wallet Invoices | Seed2Shelf</title>
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
              <Receipt className="w-7 h-7 text-[#00d26a]" />
              Invoices & Statements
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              Agricultural batch trade invoices and payment release slips.
            </p>
          </div>
        </div>

        <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-stone-400 text-xs font-black uppercase">
                  <th className="pb-4">Invoice ID</th>
                  <th className="pb-4">Batch Reference</th>
                  <th className="pb-4">Item Details</th>
                  <th className="pb-4">Total Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00d26a]" />
                      {inv.id}
                    </td>
                    <td className="py-4 text-stone-300 font-mono text-xs">{inv.batch}</td>
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
                    <td className="py-4 text-right">
                      <button
                        onClick={() => alert(`Invoice ${inv.id} download initiated.`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
