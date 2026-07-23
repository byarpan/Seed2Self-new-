import Head from "next/head";
import { useState } from "react";
import AuthModal from "@/components/common/Modal/AuthModal";
import Navbar from "@/components/common/Navbar/Navbar";
import type { ReactElement } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <Head>
        <title>Seed2Shelf - Home</title>
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
      
      {/* Global Navbar Overlay */}
      <Navbar />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialModeIsSignUp={isSignUp} 
      />
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
