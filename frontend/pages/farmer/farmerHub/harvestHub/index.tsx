import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Sprout, ArrowLeft, PlusCircle, CheckCircle2 } from "lucide-react";

export default function HarvestHub() {
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRegisterHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCropName("");
      setQuantity("");
      setPrice("");
    }, 2500);
  };

  return (
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Harvest Hub | Seed2Shelf</title>
      </Head>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/farmer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Sprout className="w-8 h-8 text-[#00d26a]" />
              Harvest Hub
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              Log fresh crop harvests onto the blockchain escrow protocol.
            </p>
          </div>
        </div>

        {submitted && (
          <div className="p-4 mb-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-sm text-[#00d26a] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Harvest batch logged successfully to inventory!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2 matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-green-300 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#00d26a]" />
              Register New Harvest Batch
            </h2>

            <form onSubmit={handleRegisterHarvest} className="space-y-6">
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase block mb-2">Crop Name</label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Organic Alphonso Mangoes"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d26a] transition text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-stone-400 font-bold uppercase block mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d26a] transition text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 font-bold uppercase block mb-2">Price per kg (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00d26a] transition text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#00d26a] hover:bg-[#00b25a] text-black font-extrabold text-sm transition shadow-lg shadow-[#00d26a]/20 cursor-pointer"
                >
                  Log Harvest Batch
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-200">Harvest Protocol Info</h3>
            <ul className="space-y-3 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] mt-1.5 shrink-0"></span>
                <span>Each logged harvest generates a unique QR code for batch lineage tracking.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] mt-1.5 shrink-0"></span>
                <span>Harvest batches are automatically added to your crop inventory.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] mt-1.5 shrink-0"></span>
                <span>Escrow payouts unlock when delivery is confirmed by receiving processors.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
