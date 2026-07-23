import Head from "next/head";
import Link from "next/link";
import { ClipboardList, ArrowLeft } from "lucide-react";

export default function FarmerOrders() {
  const mockOrders = [
    { id: "ORD-901", buyer: "AgriProc Industries", crop: "Organic Basmati Grain", quantity: "1,200 kg", price: "₹1,44,000", status: "PENDING ACCEPTANCE" },
    { id: "ORD-884", buyer: "Heritage Food Processors", crop: "Alphonso Mangoes Grade A", quantity: "500 kg", price: "₹75,000", status: "ACCEPTED" }
  ];

  return (
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Orders | Seed2Shelf</title>
      </Head>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/farmer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-[#00d26a]" />
              Incoming Purchase Orders
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              Review and accept purchase offers from verified processors and distributors.
            </p>
          </div>
        </div>

        <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#00d26a] font-bold">{order.id}</span>
                    <span className="text-stone-400 text-xs">• Offered by <strong className="text-white">{order.buyer}</strong></span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{order.crop}</h3>
                  <p className="text-xs text-stone-300">Quantity: {order.quantity} | Total Value: <strong className="text-[#00d26a]">{order.price}</strong></p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {order.status === "PENDING ACCEPTANCE" ? (
                    <button
                      onClick={() => alert(`Order ${order.id} accepted!`)}
                      className="px-5 py-2.5 bg-[#00d26a] hover:bg-[#00b25a] text-black font-extrabold text-xs rounded-xl transition shadow-lg shadow-[#00d26a]/20 cursor-pointer"
                    >
                      Accept Order
                    </button>
                  ) : (
                    <span className="text-xs px-3 py-1.5 rounded-full font-bold bg-green-500/20 text-[#00d26a] border border-green-500/20">
                      ✓ Order Accepted
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
