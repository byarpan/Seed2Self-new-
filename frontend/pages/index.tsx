import Head from "next/head";
import Link from "next/link";
import { Sprout } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070908] text-[#e3e8e5] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <Head>
        <title>Seed2Shelf | Trusted Agricultural Traceability</title>
      </Head>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1511_1px,transparent_1px),linear-gradient(to_bottom,#0f1511_1px,transparent_1px)] bg-[size:6rem_6rem] pointer-events-none opacity-30 z-0" />
      
      {/* Premium Centered Background Radial Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-[#070908] to-[#070908]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 px-6 py-6 max-w-7xl w-full mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-400" />
          <span className="font-bold text-lg tracking-tight text-white">Seed2Shelf</span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/auth" 
            className="text-stone-300 hover:text-white text-xs font-semibold tracking-wide transition"
          >
            Sign In
          </Link>
          <Link 
            href="/auth" 
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.05)]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Centered Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 flex-grow max-w-3xl mx-auto space-y-8">
        
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-bold text-emerald-400">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Traceability meets Blockchain</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white">
          Seed2Shelf<span className="text-emerald-400">.</span>
        </h1>

        <p className="text-stone-400 text-lg md:text-xl leading-relaxed font-normal max-w-2xl">
          Every harvest has a story. Track, trace, and trade agricultural products across every stage of the supply chain using secure escrow-based transactions.
        </p>



      </main>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-white/[0.04] bg-[#070908] py-8 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-xs font-semibold">
          <p>© 2026 Seed2Shelf Supply Chain Trust Engine. Deployed on Local Testnet.</p>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-stone-300 transition">About</Link>
            <Link href="/" className="hover:text-stone-300 transition">Privacy</Link>
            <Link href="/" className="hover:text-stone-300 transition">Terms</Link>
            <a href="#" className="hover:text-stone-300 transition">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
