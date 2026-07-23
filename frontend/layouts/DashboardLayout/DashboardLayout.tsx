import { ReactNode } from "react";
import Navbar from "@/components/common/Navbar/Navbar";
import ChatAndNotifications from "@/components/shared/Chat/ChatAndNotifications";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col pt-16 text-white selection:bg-[#00d26a] selection:text-black relative">
      {/* Global Background Video Overlay (Vibrant Home Page Forest Video) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4"
        />
        {/* Soft subtle tint for readability while keeping the bright forest video fully visible */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <ChatAndNotifications />
    </div>
  );
}
