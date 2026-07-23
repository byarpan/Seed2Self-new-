import { ReactNode } from "react";
import Navbar from "./Navbar";
import ChatAndNotifications from "./ChatAndNotifications";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col pt-16 relative bg-[#0a0f0a] overflow-hidden">
      {/* Global Background Image (excludes Home Page because it overrides getLayout) */}
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      <Navbar />
      <main className="flex-grow relative z-10">
        {children}
      </main>
      <ChatAndNotifications />
      <footer className="text-white/60 p-6 text-center text-sm mt-12">
        &copy; 2026 Seed2Shelf. All rights reserved.
      </footer>
    </div>
  );
}
