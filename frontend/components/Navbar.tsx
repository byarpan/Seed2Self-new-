import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  UserPlus, 
  LogIn, 
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSignUp) {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        setIsModalOpen(false);
        router.push(router.pathname);
      }
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSignUp(false);
        setError(""); // Clear error on successful signup
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  const openModal = (signup: boolean) => {
    setIsSignUp(signup);
    setIsModalOpen(true);
    setError("");
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
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <Card className="relative overflow-hidden border-white/10 bg-stone-900/80 backdrop-blur-2xl shadow-2xl text-stone-100 font-sans">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Gradient Decoration inside Card */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-agri-green-DEFAULT to-agri-gold-DEFAULT" />

                  <CardHeader className="space-y-3 pt-8 pb-4">
                    <div className="mx-auto bg-stone-800/50 p-3 rounded-full border border-white/5 mb-2">
                      {isSignUp ? (
                        <UserPlus className="h-6 w-6 text-agri-green-DEFAULT" />
                      ) : (
                        <LogIn className="h-6 w-6 text-[#00d26a]" />
                      )}
                    </div>
                    <CardTitle className="text-3xl text-center font-bold text-white">
                      {isSignUp ? "Create an Account" : "Log In"}
                    </CardTitle>
                    <CardDescription className="text-center text-stone-400">
                      {isSignUp
                        ? "Join the transparent agricultural network."
                        : "Enter your credentials to access your dashboard."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4 text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {isSignUp && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-stone-300 ml-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full rounded-xl border border-white/10 bg-stone-950/50 px-4 py-3 text-white placeholder-stone-500 focus:border-[#00d26a] focus:outline-none focus:ring-1 focus:ring-agri-green-DEFAULT transition-all"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300 ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="w-full rounded-xl border border-white/10 bg-stone-950/50 px-4 py-3 text-white placeholder-stone-500 focus:border-[#00d26a] focus:outline-none focus:ring-1 focus:ring-agri-green-DEFAULT transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-300 ml-1">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          className="w-full rounded-xl border border-white/10 bg-stone-950/50 px-4 py-3 text-white placeholder-stone-500 focus:border-[#00d26a] focus:outline-none focus:ring-1 focus:ring-agri-green-DEFAULT transition-all"
                        />
                      </div>

                      {isSignUp && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-stone-300 ml-1">Role</label>
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-white/10 bg-stone-950/50 px-4 py-3 text-white focus:outline-none focus:border-[#00d26a] transition-all [&>option]:bg-stone-900"
                          >
                            <option value="FARMER">Farmer</option>
                            <option value="PROCESSOR">Processor</option>
                            <option value="DISTRIBUTOR">Distributor</option>
                            <option value="RETAILER">Retailer</option>
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                      )}

                      <button type="submit" className="w-full rounded-xl bg-agri-green-DEFAULT py-3 font-semibold text-white shadow-lg transition-colors hover:bg-agri-green-800 mt-2 cursor-pointer">
                        {isSignUp ? "Sign Up" : "Log In"}
                      </button>
                    </form>
                  </CardContent>

                  <CardFooter className="flex flex-col items-center justify-center pb-8 border-t border-white/5 pt-6 mt-2">
                    <p className="text-sm text-stone-400 mb-4">
                      {isSignUp
                        ? "Already have an account?"
                        : "Don't have an account yet?"}
                    </p>
                    <button
                      onClick={toggleMode}
                      className="text-sm font-medium text-agri-gold-DEFAULT hover:text-agri-gold-light transition-colors underline-offset-4 hover:underline cursor-pointer"
                    >
                      {isSignUp
                        ? "Switch to Login"
                        : "Switch to Sign Up"}
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
