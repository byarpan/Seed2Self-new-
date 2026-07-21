import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Search, Bell, ChevronRight, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <Head>
        <title>Seed2Shelf - Premium Supply Chain</title>
      </Head>
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
      />
      
      {/* Subtle overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-background/20 z-0"></div>

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
          <div className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-1.5">
            ✦ Seed2Shelf
          </div>
          
          <div className="hidden md:flex items-center text-sm text-muted-foreground gap-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          
          <button className="bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
            Request Demo
          </button>
        </nav>

        {/* Hero Content */}
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
            className="mt-5 flex items-center gap-3 justify-center"
          >
            <button className="bg-primary text-primary-foreground rounded-full px-6 py-4 text-sm font-medium hover:bg-primary/90 transition-colors">
              Explore Platform
            </button>
            <button className="h-[52px] w-[52px] flex items-center justify-center rounded-full bg-background border-0 shadow-[0_2px_12px_rgba(0,0,0,.08)] hover:bg-background/80 transition-colors">
              <Play className="h-4 w-4 fill-foreground text-foreground ml-1" />
            </button>
          </motion.div>

          <DashboardPreview />
        </main>
      </div>
    </div>
  );
}
