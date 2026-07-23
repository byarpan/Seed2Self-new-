import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { 
  BarChart3, 
  Sprout, 
  Package, 
  ClipboardList, 
  Truck, 
  MapPin, 
  Layers, 
  Calendar,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function FarmerHubDashboard() {
  const { data: session } = useSession();
  const farmerName = session?.user?.name || "Farmer";
  const farmerId = (session?.user as any)?.farmerId || "S2S-FRM-000001";

  const [farmInfo, setFarmInfo] = useState({
    farmName: "Green Horizon Organic Acres",
    farmLocation: "Ratnagiri, Maharashtra, India",
    landArea: "12.5 Acres",
    mainCrops: "Alphonso Mangoes, Organic Basmati, Desi Wheat",
    farmingType: "Organic & Regenerative",
    regDate: "January 15, 2026"
  });

  return (
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Farmer Hub Dashboard | Seed2Shelf</title>
      </Head>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/20 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
              <Sprout className="w-3.5 h-3.5" /> Farmer Hub Protocol
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Farmer Hub Dashboard
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              Manage farm produce logistics, inventory escrow, and blockchain batch lineage.
            </p>
          </div>

          <Link
            href="/farmer/farmerHub/harvestHub"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00d26a] hover:bg-[#00b25a] text-black font-extrabold text-xs transition shadow-lg shadow-[#00d26a]/20 shrink-0"
          >
            <span>Register Harvest Batch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Farm Information Section */}
        <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-green-300 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#00d26a]" />
              Farm Information & Details
            </h2>
            <span className="text-xs font-mono font-bold text-stone-400 bg-stone-900 border border-white/10 px-3 py-1 rounded-lg">
              ID: {farmerId}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase block">Farm Name</span>
              <p className="font-bold text-white text-base">{farmInfo.farmName}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00d26a]" /> Farm Location
              </span>
              <p className="font-bold text-white text-base">{farmInfo.farmLocation}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase block flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#00d26a]" /> Total Land Area
              </span>
              <p className="font-bold text-white text-base">{farmInfo.landArea}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1 md:col-span-2">
              <span className="text-xs text-stone-400 font-bold uppercase block">Main Cultivated Crops</span>
              <p className="font-bold text-[#00d26a] text-base">{farmInfo.mainCrops}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs text-stone-400 font-bold uppercase block">Farming Practice</span>
              <p className="font-bold text-white text-base">{farmInfo.farmingType}</p>
            </div>
          </div>
        </div>

        {/* Feature Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#00d26a]" />
            Farmer Hub Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Harvest Hub */}
            <Link
              href="/farmer/farmerHub/harvestHub"
              className="matte-glass p-6 rounded-2xl border border-white/10 hover:border-[#00d26a]/40 transition group flex flex-col justify-between h-44"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a]">
                  <Sprout className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#00d26a] group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Harvest Hub</h3>
                <p className="text-xs text-stone-400 mt-1">Log fresh harvest batches to escrow</p>
              </div>
            </Link>

            {/* Inventory */}
            <Link
              href="/farmer/farmerHub/inventory"
              className="matte-glass p-6 rounded-2xl border border-white/10 hover:border-[#00d26a]/40 transition group flex flex-col justify-between h-44"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a]">
                  <Package className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#00d26a] group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Crop Inventory</h3>
                <p className="text-xs text-stone-400 mt-1">Manage registered harvest inventory</p>
              </div>
            </Link>

            {/* Orders */}
            <Link
              href="/farmer/farmerHub/orders"
              className="matte-glass p-6 rounded-2xl border border-white/10 hover:border-[#00d26a]/40 transition group flex flex-col justify-between h-44"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a]">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#00d26a] group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Purchase Orders</h3>
                <p className="text-xs text-stone-400 mt-1">Review processor buying requests</p>
              </div>
            </Link>

            {/* Shipments */}
            <Link
              href="/farmer/farmerHub/shipments"
              className="matte-glass p-6 rounded-2xl border border-white/10 hover:border-[#00d26a]/40 transition group flex flex-col justify-between h-44"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a]">
                  <Truck className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#00d26a] group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Shipments</h3>
                <p className="text-xs text-stone-400 mt-1">Track dispatch and transit handoffs</p>
              </div>
            </Link>

            {/* Reports */}
            <Link
              href="/farmer/farmerHub/reports"
              className="matte-glass p-6 rounded-2xl border border-white/10 hover:border-[#00d26a]/40 transition group flex flex-col justify-between h-44"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-xl bg-[#00d26a]/10 border border-[#00d26a]/20 text-[#00d26a]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#00d26a] group-hover:translate-x-1 transition" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Reports & Analytics</h3>
                <p className="text-xs text-stone-400 mt-1">Review yield and escrow summaries</p>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
