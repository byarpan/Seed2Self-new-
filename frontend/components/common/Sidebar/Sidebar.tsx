import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  MapPin,
  ShieldCheck,
  Wallet as WalletIcon,
  ArrowLeftRight,
  Receipt,
  BarChart3,
  Sprout,
  Package,
  ClipboardList,
  Truck,
  GitBranch,
  LogOut,
  ChevronDown,
  ChevronRight,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [profileExpanded, setProfileExpanded] = useState(true);
  const [walletExpanded, setWalletExpanded] = useState(true);
  const [hubExpanded, setHubExpanded] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await signOut({ redirect: false });
    window.location.href = window.location.origin;
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Right-Side Drawer */}
      <aside
        className={`fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-72 bg-[#0c0d0e]/95 backdrop-blur-2xl border-l border-white/10 text-stone-200 transition-transform duration-300 ease-in-out overflow-y-auto custom-scrollbar flex flex-col justify-between p-4 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="space-y-4">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/5 px-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#00d26a]">
              Farmer Navigation
            </span>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1 text-xs font-semibold">

            {/* 1. Home */}
            <Link
              href="/farmer"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                isActive("/farmer")
                  ? "bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/20 font-bold"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home className="w-4 h-4 text-[#00d26a]" />
              <span>Home</span>
            </Link>

            {/* 2. Profile */}
            <Link
              href="/farmer/profile"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                isActive("/farmer/profile")
                  ? "bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/20 font-bold"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="w-4 h-4 text-[#00d26a]" />
              <span>Profile</span>
            </Link>

            {/* 3. Wallet Dropdown */}
            <div>
              <button
                onClick={() => setWalletExpanded(!walletExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <WalletIcon className="w-4 h-4 text-[#00d26a]" />
                  <span>Wallet</span>
                </div>
                {walletExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                )}
              </button>

              <AnimatePresence>
                {walletExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-6 pl-2 border-l border-white/10 space-y-1 mt-1"
                  >
                    <Link
                      href="/farmer/wallet"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/wallet")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <WalletIcon className="w-3.5 h-3.5" />
                      <span>Wallet Balance</span>
                    </Link>
                    <Link
                      href="/farmer/wallet/transactions"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/wallet/transactions")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Transactions</span>
                    </Link>
                    <Link
                      href="/farmer/wallet/invoices"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/wallet/invoices")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Invoices</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Farmer Hub Dropdown */}
            <div>
              <button
                onClick={() => setHubExpanded(!hubExpanded)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-stone-300 hover:text-white hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-[#00d26a]" />
                  <span>Farmer Hub</span>
                </div>
                {hubExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
                )}
              </button>

              <AnimatePresence>
                {hubExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-6 pl-2 border-l border-white/10 space-y-1 mt-1"
                  >
                    <Link
                      href="/farmer/farmerHub/dashboard"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/farmerHub/dashboard")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-[#00d26a] font-bold"
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/farmer/farmerHub/harvestHub"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/farmerHub/harvestHub")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Harvest Hub</span>
                    </Link>
                    <Link
                      href="/farmer/farmerHub/inventory"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/farmerHub/inventory")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Inventory</span>
                    </Link>
                    <Link
                      href="/farmer/farmerHub/orders"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/farmerHub/orders")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      <span>Orders</span>
                    </Link>
                    <Link
                      href="/farmer/farmerHub/shipments"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/farmerHub/shipments")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Shipments</span>
                    </Link>
                    <Link
                      href="/farmer/farmerHub/reports"
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition ${
                        isActive("/farmer/farmerHub/reports")
                          ? "bg-[#00d26a]/15 text-[#00d26a] font-bold"
                          : "text-stone-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Reports</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 5. Trace Produce */}
            <Link
              href="/home/trace-product"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                isActive("/home/trace-product")
                  ? "bg-[#00d26a]/15 text-[#00d26a] border border-[#00d26a]/20 font-bold"
                  : "text-stone-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <GitBranch className="w-4 h-4 text-[#00d26a]" />
              <span>Trace Produce</span>
            </Link>

          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

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
                Are you sure you want to log out of your Farmer account?
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
