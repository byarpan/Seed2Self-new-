import Head from "next/head";
import Link from "next/link";
import { Truck, ArrowLeft } from "lucide-react";

export default function FarmerShipments() {
  const mockShipments = [
    { id: "SHP-772", batch: "Batch #SF-1021", destination: "Heritage Food Processing Hub, Mandya", status: "IN TRANSIT", date: "July 15, 2026" },
    { id: "SHP-765", batch: "Batch #SF-1018", destination: "AgriProc Central Cold Storage, Bangalore", status: "DELIVERED", date: "July 10, 2026" }
  ];

  return (
    <div className="min-h-screen relative text-white pt-6 pb-20">
      <Head>
        <title>Shipments | Seed2Shelf</title>
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
              <Truck className="w-8 h-8 text-[#00d26a]" />
              Harvest Shipments Log
            </h1>
            <p className="text-stone-400 text-xs font-medium mt-1">
              Track logistics dispatches and transport handoffs to buyers.
            </p>
          </div>
        </div>

        <div className="matte-glass p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="space-y-4">
            {mockShipments.map((shp) => (
              <div key={shp.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#00d26a] font-bold">{shp.id}</span>
                    <span className="text-stone-400 text-xs">• {shp.batch}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Destination: {shp.destination}</h3>
                  <p className="text-xs text-stone-400">Dispatched: {shp.date}</p>
                </div>

                <div className="shrink-0">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${
                    shp.status === 'DELIVERED' 
                      ? 'bg-[#00d26a]/15 text-[#00d26a] border-[#00d26a]/20' 
                      : 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                  }`}>
                    {shp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
