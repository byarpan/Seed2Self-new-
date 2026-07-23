import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";
import { 
  X, 
  Menu, 
  ChevronDown, 
  Home, 
  User, 
  Wallet as WalletIcon, 
  Sprout, 
  LogOut, 
  Package, 
  ClipboardList, 
  Truck, 
  ArrowLeftRight, 
  BarChart3,
  ShieldCheck,
  Bell,
  GitBranch,
  QrCode
} from "lucide-react";




const getHubConfig = (role: string) => {
  switch (role) {
    case "FARMER":
      return {
        title: "Farmer Hub",
        basePath: "/farmer",
      };
    case "PROCESSOR":
      return {
        title: "Processor Hub",
        basePath: "/processor",
      };
    case "DISTRIBUTOR":
      return {
        title: "Distributor Hub",
        basePath: "/distributor",
      };
    case "RETAILER":
      return {
        title: "Retailer Hub",
        basePath: "/retailer",
      };
    default:
      return null;
  }
};

const isSupplyChainRole = (role?: string) =>
  ["FARMER", "PROCESSOR", "DISTRIBUTOR", "RETAILER"].includes(role ?? "");

export default function Navbar() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [wallet, setWallet] = useState<string | null>(null);

  // Sidebar & Accordion States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeHash, setActiveHash] = useState("");

  const [dbUser, setDbUser] = useState<any>(null);
  const hubConfig = session?.user?.role ? getHubConfig(session.user.role) : null;

  const fetchDbUser = async () => {
    if (!session?.user?.id) {
      setDbUser(null);
      return;
    }
    try {
      const res = await fetch(`/api/users/${session.user.id}`);
      if (res.ok) {
        setDbUser(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch user in Navbar", err);
    }
  };

  useEffect(() => {
    fetchDbUser();
  }, [session?.user?.id]);

  // Re-fetch when sidebar opens too to keep sync
  useEffect(() => {
    if (isSidebarOpen) {
      fetchDbUser();
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (session?.user?.walletAddress) {
      setWallet(session.user.walletAddress);
    } else {
      setWallet(null);
    }
  }, [session]);

  // Escape key listener to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hash & Route change listener to highlight submenu items
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };
    setActiveHash(window.location.hash);
    
    window.addEventListener("hashchange", handleHashChange);
    router.events.on("routeChangeComplete", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      router.events.off("routeChangeComplete", handleHashChange);
    };
  }, [router]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const openModal = (signup: boolean) => {
    setIsSignUp(signup);
    setIsModalOpen(true);
  };

  const isSubmenuActive = (basePath: string, hash: string, url?: string) => {
    if (url) {
      return router.pathname === url;
    }
    return router.pathname === basePath && activeHash === hash;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0a0f0a] text-white px-6 md:px-12 h-[72px] flex items-center border-b border-[#00d26a]/20 shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center select-none"
          >
            <img
              src="/images/logo.svg"
              alt="Seed2Shelf"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Right Alignment: Dependent on Authentication Session */}
          {session ? (
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  onBlur={() => setTimeout(() => setIsNotifOpen(false), 200)}
                  className="p-2 hover:bg-white/10 rounded-xl transition duration-250 hover:scale-[1.03] text-stone-300 hover:text-white cursor-pointer relative focus:outline-none"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00d26a] rounded-full" />
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-[#252525] border border-white/10 rounded-xl shadow-2xl p-4 z-50 flex flex-col items-center justify-center"
                    >
                      <Bell className="h-6 w-6 text-stone-500 mb-2" />
                      <p className="text-stone-300 text-sm font-medium">No notifications</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Avatar (opens sidebar) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-9 h-9 rounded-full bg-[#252525] border border-white/10 text-stone-300 hover:text-white hover:border-[#00d26a] flex items-center justify-center shrink-0 overflow-hidden transition-all duration-250 hover:scale-[1.05] cursor-pointer focus:outline-none"
                title={`Logged in as ${session.user.name}`}
                aria-label="Open sidebar menu"
              >
                {dbUser?.profilePhoto ? (
                  <img 
                    src={dbUser.profilePhoto} 
                    alt={dbUser.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-stone-300" />
                )}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => openModal(false)} 
              className="text-xs bg-agri-green-DEFAULT hover:bg-agri-green-800 px-6 py-2.5 rounded-full transition-all duration-250 font-bold text-white cursor-pointer shadow-[0_0_15px_rgba(39,98,57,0.4)] hover:shadow-[0_0_25px_rgba(39,98,57,0.6)] focus:outline-none"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Right-Side Sidebar Drawer & Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar Container - Slides out from the right edge */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full z-[90] bg-[#252525] border-l border-[#333333] shadow-2xl flex flex-col w-[85%] sm:w-[300px] md:w-[320px] text-white font-sans"
            >
              {/* Close button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Profile Section */}
              <div className="bg-[#1f1f1f] p-6 border-b border-[#333333] pt-12 flex flex-col items-start relative">
                <div className="flex items-center gap-4 mt-4 w-full">
                  {/* Circular Avatar */}
                  <div className="w-14 h-14 rounded-full bg-[#00d26a] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg border border-white/10 shrink-0 overflow-hidden">
                    {dbUser?.profilePhoto ? (
                      <img 
                        src={dbUser.profilePhoto} 
                        alt={dbUser.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {session?.user?.name ? session.user.name[0].toUpperCase() : "G"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-white truncate w-full">
                      {session?.user?.name || "Guest User"}
                    </span>
                    <span className="text-[10px] bg-[#00d26a]/15 text-[#00d26a] px-2.5 py-0.5 rounded-full font-bold self-start mt-1 capitalize border border-[#00d26a]/20">
                      {session?.user?.role ? session.user.role.toLowerCase() : "guest"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="flex-grow overflow-y-auto py-6 px-4 space-y-3 custom-scrollbar">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    router.pathname === "/"
                      ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                      : "text-stone-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>

                {/* Profile */}
                {session && (
                  <Link
                    href={`/profile/${session.user.id}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      router.pathname.startsWith("/profile")
                        ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                )}

                {/* Admin Portal (Only visible if role is ADMIN) */}
                {session?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      router.pathname === "/admin"
                        ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5 text-red-500" />
                    <span>Admin KYC</span>
                  </Link>
                )}

                {/* Wallet Link */}
                <Link
                  href="/wallet"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    router.pathname === "/wallet"
                      ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                      : "text-stone-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <WalletIcon className="h-5 w-5 text-yellow-500" />
                  <span>Wallet</span>
                </Link>

                {/* Role-Specific Hub: single direct link */}
                {hubConfig && (
                  <Link
                    href={hubConfig.basePath}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      router.pathname === hubConfig.basePath
                        ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Sprout className="h-5 w-5 text-[#00d26a]" />
                    <span>{hubConfig.title}</span>
                  </Link>
                )}

                {/* Trace Lineage: top-level for supply chain roles */}
                {isSupplyChainRole(session?.user?.role) && (
                  <Link
                    href="/trace"
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                      router.pathname === "/trace"
                        ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <GitBranch className="h-5 w-5" />
                    <span>Trace Lineage</span>
                  </Link>
                )}

                {/* Customer: Trace Lineage + Scan QR */}
                {session?.user?.role === "CUSTOMER" && (
                  <>
                    <Link
                      href="/trace"
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                        router.pathname === "/trace"
                          ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                          : "text-stone-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <GitBranch className="h-5 w-5" />
                      <span>Trace Lineage</span>
                    </Link>
                    <Link
                      href="/consumer#scan-qr"
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                        router.pathname === "/consumer" && activeHash === "#scan-qr"
                          ? "bg-[#00d26a]/10 text-[#00d26a] border-l-4 border-[#00d26a]"
                          : "text-stone-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <QrCode className="h-5 w-5" />
                      <span>Scan QR</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Sidebar Footer */}
              {session ? (
                <div className="p-4 border-t border-[#333333] bg-[#1f1f1f]">
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsSidebarOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl w-full text-left text-stone-300 hover:text-red-400 hover:bg-red-500/10 transition font-medium cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 border-t border-[#333333] bg-[#1f1f1f]">
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      openModal(false);
                    }}
                    className="w-full bg-[#00d26a] hover:bg-[#00b25a] text-black font-bold py-3 rounded-xl transition text-center shadow-lg cursor-pointer"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal Overlay & Auth Card */}
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialModeIsSignUp={isSignUp} 
      />
    </>
  );
}
