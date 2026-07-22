import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, LogIn } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModeIsSignUp?: boolean;
}

export default function AuthModal({ isOpen, onClose, initialModeIsSignUp = false }: AuthModalProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialModeIsSignUp);
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
        onClose();
        if (router.pathname === "/") {
          router.push("/trace"); // default route or let user click profile
        } else {
          router.push(router.pathname);
        }
      }
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSignUp(false);
        setError("");
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

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
                    type="button"
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
  );
}
