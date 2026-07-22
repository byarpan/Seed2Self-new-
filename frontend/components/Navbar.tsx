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
  GitBranch
} from "lucide-react";

const getHubConfig = (role: string) => {
  switch (role) {
    case "FARMER":
      return {
        title: "Farmer Hub",
        basePath: "/farmer",
        items: [
          { name: "Harvest Hub", hash: "#harvest-hub", icon: Sprout },
          { name: "Inventory", hash: "#inventory", icon: Package },
          { name: "Orders", hash: "#orders", icon: ClipboardList },
          { name: "Shipments", hash: "#shipments", icon: Truck },
          { name: "Reports", hash: "#reports", icon: BarChart3 },
          { name: "Trace Lineage", url: "/trace", icon: GitBranch }
        ]
      };
    case "PROCESSOR":
      return {
        title: "Processor Hub",
        basePath: "/processor",
        items: [
          { name: "Processor Dashboard", hash: "", icon: BarChart3 },
          { name: "Marketplace", url: "/buy", icon: Sprout },
          { name: "Processed Inventory", hash: "#inventory", icon: Package },
          { name: "Incoming Orders", hash: "#orders", icon: ClipboardList },
          { name: "Trace Lineage", url: "/trace", icon: GitBranch }
        ]
      };
    case "DISTRIBUTOR":
      return {
        title: "Distributor Hub",
        basePath: "/distributor",
        items: [
          { name: "Logistics Portal", hash: "", icon: Truck },
          { name: "Marketplace", url: "/buy", icon: Package },
          { name: "In Transit Inventory", hash: "#inventory", icon: ClipboardList },
          { name: "Trace Lineage", url: "/trace", icon: GitBranch }
        ]
      };
    case "RETAILER":
      return {
        title: "Retailer Hub",
        basePath: "/retailer",
        items: [
          { name: "Retail Storefront", hash: "", icon: Home },
          { name: "Marketplace", url: "/buy", icon: Package },
          { name: "Inventory", hash: "#inventory", icon: ClipboardList },
          { name: "Trace Lineage", url: "/trace", icon: GitBranch }
        ]
      };
    default:
      return null;
  }
};

export default function Navbar() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [wallet, setWallet] = useState<string | null>(null);

  // Sidebar & Accordion States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFarmerHubExpanded, setIsFarmerHubExpanded] = useState(true);
  const [isWalletExpanded, setIsWalletExpanded] = useState(true);
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
      <nav className="fixed top-0 w-full z-50 glass-dark text-white px-6 md:px-12 h-[72px] flex items-center border-b border-white/10 shadow-lg">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
          {/* Left alignment: Logo only */}
          <Link 
            href="/" 
            className="text-3xl font-bold tracking-widest text-[#9CAF88] transition-colors duration-250 hover:text-white"
            style={{ fontFamily: "'Yeseva One', serif" }}
          >
            SEED2SHELF
          </Link>

          {/* Right Alignment: Dependent on Authentication Session */}
          {session ? (
            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-250 hover:scale-[1.03] text-white focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label="Open sidebar menu"
              >
                <Menu className="h-6 w-6 text-[#00d26a] hover:text-white transition-colors" />
              </button>

              {/* Notification Bell */}
              <button className="p-2 hover:bg-white/10 rounded-xl transition duration-250 hover:scale-[1.03] text-stone-300 hover:text-white cursor-pointer relative focus:outline-none">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#00d26a] rounded-full" />
              </button>

              {/* Profile Redirect Avatar */}
              <Link
                href={`/profile/${session.user.id}`}
                className="w-9 h-9 rounded-full bg-[#252525] border border-white/10 text-stone-300 hover:text-white hover:border-[#00d26a] flex items-center justify-center shrink-0 overflow-hidden transition-all duration-250 hover:scale-[1.05] cursor-pointer focus:outline-none"
                title={`Logged in as ${session.user.name}`}
                aria-label="View profile"
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
              </Link>
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

                {/* Wallet Accordion Menu */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsWalletExpanded(!isWalletExpanded)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-left cursor-pointer ${
                      router.pathname === "/wallet"
                        ? "bg-[#00d26a]/5 text-[#00d26a]"
                        : "text-stone-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <WalletIcon className="h-5 w-5 text-yellow-500" />
                      <span>Wallet</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-[#bdbdbd] transition-transform duration-300 ${
                        isWalletExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isWalletExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden pl-8 pr-2 space-y-1 mt-1 border-l border-[#333333]/50 ml-6"
                      >
                        {[
                          { name: "Wallet Balance", hash: "#wallet-balance", icon: WalletIcon },
                          { name: "Transactions", hash: "#transactions", icon: ArrowLeftRight },
                          { name: "Invoices", hash: "#invoices", icon: ClipboardList }
                        ].map((subItem) => {
                          const isActive = router.pathname === "/wallet" && activeHash === subItem.hash;
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.name}
                              href={`/wallet${subItem.hash}`}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all font-medium ${
                                isActive
                                  ? "bg-[#00d26a]/15 text-[#00d26a]"
                                  : "text-stone-400 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              <SubIcon className="h-3.5 w-3.5" />
                              <span>{subItem.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Role-Specific Hub Accordion */}
                {hubConfig && (
                  <div className="space-y-1">
                    <button
                      onClick={() => setIsFarmerHubExpanded(!isFarmerHubExpanded)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-left cursor-pointer ${
                        router.pathname === hubConfig.basePath
                          ? "bg-[#00d26a]/5 text-[#00d26a]"
                          : "text-stone-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Sprout className="h-5 w-5 text-[#00d26a]" />
                        <span>{hubConfig.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-[#bdbdbd] transition-transform duration-300 ${
                          isFarmerHubExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isFarmerHubExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden pl-8 pr-2 space-y-1 mt-1 border-l border-[#333333]/50 ml-6"
                        >
                          {hubConfig.items.map((subItem) => {
                            const isActive = isSubmenuActive(hubConfig.basePath, subItem.hash || "", subItem.url);
                            const SubIcon = subItem.icon;
                            const linkHref = subItem.url || `${hubConfig.basePath}${subItem.hash}`;
                            return (
                              <Link
                                key={subItem.name}
                                href={linkHref}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all font-medium ${
                                  isActive
                                    ? "bg-[#00d26a]/15 text-[#00d26a]"
                                    : "text-stone-400 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <SubIcon className="h-3.5 w-3.5" />
                                <span>{subItem.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
