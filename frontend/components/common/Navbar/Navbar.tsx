import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "../Modal/AuthModal";
import Sidebar from "../Sidebar/Sidebar";
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
  BarChart3,
  GitBranch,
  ShieldCheck,
  Bell
} from "lucide-react";

const getHubConfig = (role: string) => {
  switch (role) {
    case "FARMER":
      return {
        title: "Farmer Hub",
        basePath: "/farmer/farmerHub/dashboard",
        items: [
          { name: "Dashboard", url: "/farmer/farmerHub/dashboard", icon: BarChart3 },
          { name: "Harvest Hub", url: "/farmer/farmerHub/harvestHub", icon: Sprout },
          { name: "Inventory", url: "/farmer/farmerHub/inventory", icon: Package },
          { name: "Orders", url: "/farmer/farmerHub/orders", icon: ClipboardList },
          { name: "Shipments", url: "/farmer/farmerHub/shipments", icon: Truck },
          { name: "Reports", url: "/farmer/farmerHub/reports", icon: BarChart3 },
          { name: "Trace Produce", url: "/home/trace-product", icon: GitBranch }
        ]
      };
    case "PROCESSOR":
      return {
        title: "Processor Hub",
        basePath: "/processor/processorHub/dashboard",
        items: [
          { name: "Processor Dashboard", hash: "", icon: BarChart3 },
          { name: "Marketplace", url: "/processor/processorHub/marketplace", icon: Sprout },
          { name: "Processed Inventory", hash: "#inventory", icon: Package },
          { name: "Incoming Orders", hash: "#orders", icon: ClipboardList },
          { name: "Trace Lineage", url: "/home/trace-product", icon: GitBranch }
        ]
      };
    case "DISTRIBUTOR":
      return {
        title: "Distributor Hub",
        basePath: "/distributor",
        items: [
          { name: "Logistics Portal", hash: "", icon: Truck },
          { name: "Marketplace", url: "/customer/marketplace", icon: Package },
          { name: "In Transit Inventory", hash: "#inventory", icon: ClipboardList },
          { name: "Trace Lineage", url: "/home/trace-product", icon: GitBranch }
        ]
      };
    case "RETAILER":
      return {
        title: "Retailer Hub",
        basePath: "/retailer",
        items: [
          { name: "Retail Storefront", hash: "", icon: Home },
          { name: "Marketplace", url: "/customer/marketplace", icon: Package },
          { name: "Inventory", hash: "#inventory", icon: ClipboardList },
          { name: "Trace Lineage", url: "/home/trace-product", icon: GitBranch }
        ]
      };
    default:
      return null;
  }
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userRole = session?.user?.role;
  const isFarmer = userRole === "FARMER";
  const hubConfig = userRole ? getHubConfig(userRole) : null;
  const profileId = (session?.user as any)?.farmerId || (session?.user as any)?.processorId || session?.user?.id;
  const isAuthenticated = status === "authenticated";

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      if (session.user.image) {
        setProfilePhotoUrl(session.user.image);
      }

      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.profilePhoto) {
              setProfilePhotoUrl(data.profilePhoto);
            }
          }
        } catch (err) {
          console.error("Error loading user profile photo:", err);
        }
      };

      fetchUserData();

      const handleProfileUpdate = () => fetchUserData();
      window.addEventListener("profileUpdated", handleProfileUpdate);

      return () => {
        window.removeEventListener("profileUpdated", handleProfileUpdate);
      };
    }
  }, [session?.user?.id, session?.user?.image]);

  const openModal = (signUp: boolean) => {
    setIsSignUpMode(signUp);
    setIsAuthModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await signOut({ redirect: false });
    window.location.href = window.location.origin;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-navbar transition-all duration-300">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Far Left Side: SaaS Logo Image */}
            <Link href={isFarmer ? "/farmer" : "/"} className="flex items-center group select-none">
              <img 
                src="/assets/icons/logo.png" 
                alt="Seed2Shelf Logo" 
                className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]" 
              />
            </Link>

            {/* Middle Navigation - Rendered ONLY when authenticated and NOT Farmer */}
            {isAuthenticated && !isFarmer && (
              <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/" className={`transition-colors ${router.pathname === "/" ? "text-[#00d26a]" : "text-stone-300 hover:text-white"}`}>
                  Home
                </Link>

                <Link href="/customer/marketplace" className={`transition-colors ${router.pathname.includes("marketplace") ? "text-[#00d26a]" : "text-stone-300 hover:text-white"}`}>
                  Marketplace
                </Link>

                <Link href="/home/trace-product" className={`transition-colors ${router.pathname.includes("trace") ? "text-[#00d26a]" : "text-stone-300 hover:text-white"}`}>
                  Trace Produce
                </Link>

                {/* Dynamic Hub Link */}
                {hubConfig && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors py-2 cursor-pointer"
                    >
                      <span>{hubConfig.title}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-[#141415] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-xs"
                        >
                          <Link 
                            href={hubConfig.basePath} 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-200 hover:bg-white/5 font-bold transition"
                          >
                            <Home className="w-4 h-4 text-[#00d26a]" />
                            <span>Dashboard Overview</span>
                          </Link>
                          
                          <div className="my-1 border-t border-white/5" />

                          {hubConfig.items.map((item, idx) => {
                            const Icon = item.icon;
                            const targetUrl = item.url || `${hubConfig.basePath}${item.hash}`;
                            return (
                              <Link 
                                key={idx} 
                                href={targetUrl}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-white/5 transition"
                              >
                                <Icon className="w-4 h-4 text-stone-400" />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Admin Portal Link */}
                {userRole === "ADMIN" && (
                  <Link href="/admin" className="flex items-center gap-1 text-[#00d26a] font-bold hover:underline">
                    <ShieldCheck className="w-4 h-4" />
                    Admin KYC
                  </Link>
                )}
              </div>
            )}

            {/* Right Side Controls */}
            {isFarmer ? (
              /* Farmer Top Navbar Controls: ONLY Hamburger + Bell + Profile Avatar */
              <div className="flex items-center gap-3">
                
                {/* Hamburger Menu (Opens Right Drawer) */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition cursor-pointer"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5 text-[#00d26a]" />
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white transition cursor-pointer relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 text-stone-300" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00d26a] rounded-full animate-pulse"></span>
                  </button>

                  <AnimatePresence>
                    {isNotificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-72 bg-[#141415] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-xs"
                      >
                        <div className="flex justify-between items-center pb-2 border-b border-white/10 mb-3">
                          <span className="font-bold text-white">Notifications</span>
                          <button
                            onClick={() => setIsNotificationOpen(false)}
                            className="text-stone-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="py-6 text-center text-stone-400 text-xs italic">
                          No notifications available.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Avatar */}
                <Link
                  href="/farmer/profile"
                  className="flex items-center gap-2 p-1 rounded-full border-2 border-[#00d26a]/40 hover:border-[#00d26a] transition cursor-pointer"
                  title="Farmer Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#162a1e] to-[#254d33] flex items-center justify-center font-black text-sm text-[#00d26a] overflow-hidden">
                    {profilePhotoUrl ? (
                      <img src={profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                    ) : session?.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      session?.user?.name ? session.user.name[0].toUpperCase() : "F"
                    )}
                  </div>
                </Link>

              </div>
            ) : (
              /* Non-Farmer Top Navbar Controls */
              <div className="flex items-center gap-4">
                {status === "authenticated" && session?.user ? (
                  <div className="flex items-center gap-3">
                    <Link 
                      href={userRole ? `/${userRole.toLowerCase()}/wallet` : "/farmer/wallet"}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-200 transition"
                    >
                      <WalletIcon className="w-3.5 h-3.5 text-[#00d26a]" />
                      <span>Wallet</span>
                    </Link>

                    {profileId && (
                      <Link 
                        href={userRole ? `/${userRole.toLowerCase()}/profile` : `/profile/${profileId}`}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-200 transition"
                      >
                        <User className="w-3.5 h-3.5 text-stone-300" />
                        <span>Profile</span>
                      </Link>
                    )}

                    <button 
                      onClick={() => setShowLogoutModal(true)}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  /* Single Segmented Pill Control for Authentication */
                  <div className="bg-white/5 border border-white/10 p-1 rounded-full flex items-center shadow-inner">
                    <button 
                      onClick={() => openModal(false)}
                      className="px-4 py-1.5 rounded-full text-xs font-bold text-stone-300 hover:text-white transition cursor-pointer"
                    >
                      Log In
                    </button>
                    <span className="text-white/20 text-xs font-light px-0.5">|</span>
                    <button 
                      onClick={() => openModal(true)}
                      className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#00d26a] hover:bg-[#00b25a] text-black transition shadow-md shadow-[#00d26a]/20 cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger (for Non-Farmer) */}
            {!isFarmer && (
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-stone-300 hover:text-white p-2"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* Render Farmer Sidebar */}
      {isFarmer && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialModeIsSignUp={isSignUpMode} 
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 matte-glass border border-white/10 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
                <LogOut className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
              <p className="text-stone-400 text-xs font-medium">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-stone-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
                >
                  Yes, Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
