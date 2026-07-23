import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Play, Search, Bell, ChevronRight, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AuthModal from "@/components/AuthModal";
import type { ReactElement } from "react";

const DashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="mt-8 w-full max-w-5xl z-20 relative"
    >
      <div 
        className="rounded-2xl overflow-hidden p-3 md:p-4"
        style={{
          background: "rgba(255,255,255,.4)",
          border: "1px solid rgba(255,255,255,.5)",
          boxShadow: "var(--shadow-dashboard)",
          backdropFilter: "blur(22px)"
        }}
      >
        <div className="bg-background rounded-xl overflow-hidden flex flex-col text-[11px] select-none pointer-events-none text-foreground border border-border shadow-sm h-[500px]">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                S
              </div>
              <span className="font-semibold text-xs">Seed2Shelf</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="flex items-center gap-2 bg-secondary/50 rounded-md px-3 py-1.5 border border-border">
                <Search className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground flex-1">Search Produce, Batch or QR...</span>
                <span className="bg-background px-1.5 py-0.5 rounded border border-border text-[9px] text-muted-foreground font-medium">⌘K</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium cursor-pointer">
                New Shipment
              </div>
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div className="w-7 h-7 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center font-medium border border-accent/20 text-xs">
                RS
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-40 border-r border-border bg-background flex flex-col py-4 px-2 shrink-0">
              <div className="space-y-0.5">
                <div className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md font-medium">Dashboard</div>
                <div className="px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors">Shipments</div>
                <div className="px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors">Blockchain Records</div>
                <div className="px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors">Escrow Payments</div>
                <div className="px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors">QR Trace</div>
                <div className="px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors">Analytics</div>
                <div className="px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md transition-colors">Users</div>
              </div>

              <div className="mt-4 space-y-0.5">
                <div className="px-3 py-1.5 text-muted-foreground flex items-center justify-between rounded-md">
                  <span>Supply Chain</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
                <div className="px-3 py-1.5 text-muted-foreground flex items-center justify-between rounded-md">
                  <span>Reports</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              <div className="mt-6">
                <div className="px-3 text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Platform</div>
                <div className="space-y-0.5">
                  <div className="px-3 py-1.5 text-muted-foreground rounded-md">Smart Contracts</div>
                  <div className="px-3 py-1.5 text-muted-foreground rounded-md">Disputes</div>
                  <div className="px-3 py-1.5 text-muted-foreground rounded-md">Settings</div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Area */}
            <div className="flex-1 bg-secondary/30 p-6 overflow-hidden flex flex-col gap-6">
              
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Welcome, Rajesh</h2>
                  <p className="text-muted-foreground mt-1">Today's tomato shipment is now live on Ethereum.</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-medium">Record Handoff</div>
                  <div className="bg-background text-foreground border border-border px-4 py-1.5 rounded-full font-medium">Release Payment</div>
                  <div className="bg-background text-foreground border border-border px-4 py-1.5 rounded-full font-medium">Generate QR</div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-background p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-muted-foreground mb-1">Farm Price</div>
                  <div className="text-xl font-semibold">₹8/kg</div>
                </div>
                <div className="bg-background p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-muted-foreground mb-1">Retail Price</div>
                  <div className="text-xl font-semibold">₹60/kg</div>
                </div>
                <div className="bg-background p-4 rounded-xl border border-border shadow-sm">
                  <div className="text-muted-foreground mb-1">Price Gap</div>
                  <div className="text-xl font-semibold flex items-center gap-2">
                    +650%
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                </div>
                <div className="bg-background p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between">
                  <div className="text-muted-foreground">Escrow Status</div>
                  <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full font-medium w-fit mt-1 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Protected
                  </div>
                </div>
              </div>

              {/* Middle Section: Timeline & QR */}
              <div className="flex gap-4 h-full min-h-0">
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                  {/* Timeline */}
                  <div className="bg-background rounded-xl border border-border p-5 shadow-sm">
                    <div className="flex justify-between items-center relative">
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-border -z-10 -translate-y-1/2"></div>
                      
                      <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                        <span className="font-medium">Farmer</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                        <span className="font-medium">Processor</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                        <span className="font-medium">Distributor</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className="w-5 h-5 rounded-full border-2 border-accent bg-background flex items-center justify-center">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                        </div>
                        <span className="font-medium text-accent">Retailer</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className="w-5 h-5 rounded-full border-2 border-muted bg-background"></div>
                        <span className="text-muted-foreground">Consumer</span>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Table */}
                  <div className="bg-background rounded-xl border border-border shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="grid grid-cols-4 px-4 py-3 border-b border-border text-muted-foreground font-medium bg-secondary/30">
                      <div>Batch</div>
                      <div>Event</div>
                      <div>Block</div>
                      <div>Status</div>
                    </div>
                    <div className="flex-1 overflow-hidden p-2">
                      <div className="grid grid-cols-4 px-2 py-2.5 items-center hover:bg-secondary/50 rounded-lg transition-colors">
                        <div className="font-medium">TOM-1048</div>
                        <div>Farmer → Processor</div>
                        <div className="text-blue-500 font-mono">#23940198</div>
                        <div><span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px] font-medium border border-green-500/20">Verified</span></div>
                      </div>
                      <div className="grid grid-cols-4 px-2 py-2.5 items-center hover:bg-secondary/50 rounded-lg transition-colors">
                        <div className="font-medium">TOM-1048</div>
                        <div>Escrow Locked</div>
                        <div className="text-blue-500 font-mono">#23940205</div>
                        <div><span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px] font-medium border border-green-500/20">Confirmed</span></div>
                      </div>
                      <div className="grid grid-cols-4 px-2 py-2.5 items-center hover:bg-secondary/50 rounded-lg transition-colors">
                        <div className="font-medium">TOM-1048</div>
                        <div>Weight Verified</div>
                        <div className="text-blue-500 font-mono">#23940214</div>
                        <div><span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px] font-medium border border-green-500/20">Verified</span></div>
                      </div>
                      <div className="grid grid-cols-4 px-2 py-2.5 items-center hover:bg-secondary/50 rounded-lg transition-colors">
                        <div className="font-medium">TOM-1048</div>
                        <div>QR Generated</div>
                        <div className="text-blue-500 font-mono">#23940218</div>
                        <div><span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px] font-medium border border-green-500/20">Complete</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-64 flex flex-col gap-4">
                  {/* QR Card */}
                  <div className="bg-background border border-border p-4 rounded-xl shadow-sm text-center flex flex-col items-center">
                    <div className="bg-white p-2 rounded-lg border border-border shadow-sm mb-3 inline-block">
                       <QRCodeSVG value="https://seed2shelf.com/trace/TOM-1048" size={80} level="L" />
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Scan to view the complete farm-to-shelf journey.
                    </p>
                    
                    <div className="w-full text-left space-y-2 bg-secondary/50 p-3 rounded-lg border border-border/50">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Origin:</span>
                        <span className="font-medium">Nashik, MH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Farmer:</span>
                        <span className="font-medium">Rajesh Patil</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Harvest:</span>
                        <span className="font-medium">14 July</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stage:</span>
                        <span className="font-medium text-accent">Retail Ready</span>
                      </div>
                    </div>
                  </div>

                  {/* Smart Alerts */}
                  <div className="flex-1 space-y-2">
                    <div className="bg-background border border-border p-3 rounded-xl shadow-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></div>
                      <span className="text-muted-foreground leading-snug">Escrow payment released successfully.</span>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-xl shadow-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                      <span className="text-muted-foreground leading-snug">Weight shrinkage detected (2.1%) during processing.</span>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-xl shadow-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                      <span className="text-muted-foreground leading-snug">Price agreement verified between processor and distributor.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  return (
    <div className={`h-screen flex flex-col bg-background relative ${showExplore ? "overflow-y-auto" : "overflow-hidden"}`}>
      <Head>
        <title>Seed2Shelf - Premium Supply Chain</title>
      </Head>
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
      />
      
      {/* Subtle overlay for better text contrast if needed */}
      <div className="fixed inset-0 bg-background/20 z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
          <div className="flex items-center">
            <img src="/images/logo-black.svg" alt="Seed2Shelf" className="h-10 w-auto object-contain" />
          </div>
          

          
          {session ? (
            <div className="flex items-center gap-3">
              {showExplore && (
                <button 
                  onClick={() => setShowExplore(false)}
                  className="bg-secondary/50 backdrop-blur-md text-foreground border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  ← Back to Home
                </button>
              )}
              <button 
                onClick={() => router.push("/trace")}
                className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {showExplore && (
                <button 
                  onClick={() => setShowExplore(false)}
                  className="bg-secondary/50 backdrop-blur-md text-foreground border border-border rounded-full px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  ← Back to Home
                </button>
              )}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Login / Sign Up
              </button>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        {!showExplore && (
        <main className="flex-1 flex flex-col items-center w-full pt-8 md:pt-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-muted-foreground mb-6 shadow-sm"
          >
            Now securing India's food supply with Blockchain 🌾
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center font-display text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-foreground max-w-xl mx-auto"
          >
            Building a More <span className="italic font-display">Transparent</span> Food Supply
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-center text-base md:text-lg text-muted-foreground max-w-[700px] leading-relaxed mx-auto"
          >
            Track every handoff—from farmer to retailer—with immutable blockchain records, automated payment protection, and QR-powered transparency that lets consumers verify every journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 flex items-center gap-3 justify-center pb-20"
          >
            <button 
              onClick={() => setShowExplore(true)}
              className="bg-primary text-primary-foreground rounded-full px-6 py-4 text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Explore Platform
            </button>
          </motion.div>
        </main>
        )}

        {showExplore && (
          <div className="flex-1 w-full pt-4 pb-24 text-white">
            {/* Features Section */}
            <section id="features" className="relative z-10 py-12">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-display text-5xl md:text-6xl tracking-tight text-center mb-16 text-black">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="p-4">
                    <h3 className="font-display text-3xl tracking-tight mb-4 text-black">Immutable Blockchain Records</h3>
                    <p className="text-black text-base md:text-lg leading-relaxed font-medium">Every handoff in the supply chain is recorded immutably, ensuring full transparency from farm to shelf.</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-3xl tracking-tight mb-4 text-black">Escrow Payments</h3>
                    <p className="text-black text-base md:text-lg leading-relaxed font-medium">Automated escrow payments protect both buyers and sellers, releasing funds only when conditions are met.</p>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-3xl tracking-tight mb-4 text-black">QR-Powered Traceability</h3>
                    <p className="text-black text-base md:text-lg leading-relaxed font-medium">Consumers can scan a QR code to instantly verify the origin and journey of their food.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative z-10 py-24 border-t border-white/10 mt-12">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="font-display text-5xl md:text-6xl tracking-tight text-center mb-16 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center relative">
                  <div className="hidden md:block absolute top-10 left-16 right-16 h-px bg-white/20 z-0"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#00d26a] text-black rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_15px_rgba(0,210,106,0.5)]">1</div>
                    <h3 className="font-display text-2xl tracking-tight mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Farmer Harvests</h3>
                    <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Crops are harvested and a new batch is created on the blockchain.</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#00d26a] text-black rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_15px_rgba(0,210,106,0.5)]">2</div>
                    <h3 className="font-display text-2xl tracking-tight mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Processor Buys</h3>
                    <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Processor buys the batch via the marketplace; funds locked in escrow.</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#00d26a] text-black rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_15px_rgba(0,210,106,0.5)]">3</div>
                    <h3 className="font-display text-2xl tracking-tight mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Distributor Ships</h3>
                    <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Goods are handed off, tracking ownership transfers and conditions.</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#00d26a] text-black rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_15px_rgba(0,210,106,0.5)]">4</div>
                    <h3 className="font-display text-2xl tracking-tight mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Retailer Stocks</h3>
                    <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Retailer receives the verified product and stocks it on the shelf.</p>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#00d26a] text-black rounded-full flex items-center justify-center text-2xl font-black mb-6 shadow-[0_0_15px_rgba(0,210,106,0.5)]">5</div>
                    <h3 className="font-display text-2xl tracking-tight mb-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Consumer Verifies</h3>
                    <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Consumers scan the QR to see the complete history before buying.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
