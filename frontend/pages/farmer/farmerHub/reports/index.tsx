import Head from "next/head";
import Link from "next/link";
import { BarChart3, ArrowLeft, Clock } from "lucide-react";

export default function FarmerReports() {
  return (
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Reports | Seed2Shelf</title>
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
              <BarChart3 className="w-8 h-8 text-[#00d26a]" />
              Reports & Yield Analytics
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              Seasonal harvest performance analytics and revenue statements.
            </p>
          </div>
        </div>

        <div className="matte-glass p-12 rounded-3xl border border-white/10 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a] flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Coming Soon</h2>
          <p className="text-stone-400 text-xs max-w-md mx-auto">
            Detailed seasonal yield analytics, land productivity metrics, and income reports are currently being prepared for backend API integration.
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00d26a]">
              Status: Coming Soon
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
