"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Zap } from "lucide-react";
import { Button } from "../ui/Button";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeen = localStorage.getItem("digitalswarm_exit_intent");
    if (hasSeen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientY < 5) {
        setIsVisible(true);
        localStorage.setItem("digitalswarm_exit_intent", "true");
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const closePopup = () => {
    setIsVisible(false);
    localStorage.setItem("digitalswarm_exit_intent", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 lg:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[-1]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#0f1115] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] max-w-lg w-full relative border border-white/10 flex flex-col sm:flex-row"
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Visual Side */}
            <div className="bg-gradient-to-br from-cyan-900 to-blue-900 sm:w-2/5 p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden border-r border-white/5">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.4)_0%,transparent_70%)] blur-xl" />
               <Zap className="w-16 h-16 mb-4 relative z-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
               <h3 className="text-3xl font-black uppercase tracking-tight relative z-10 leading-none">Wait!</h3>
            </div>

            {/* Form Side */}
            <div className="sm:w-3/5 p-8 bg-[#0a0c10] flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Check Your Inbox!</h4>
                  <p className="text-gray-400 text-sm">We&apos;ve just sent your 15% discount code.</p>
                  <Button variant="outline" className="mt-6 w-full text-white hover:bg-white/10 border-white/20" onClick={closePopup}>Continue Protocol</Button>
                </div>
              ) : (
                <>
                  <h4 className="text-2xl font-bold text-white mb-2 leading-tight tracking-tight">Do not leave empty-handed.</h4>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Deploy your swarm for less. Get a secret <strong className="text-cyan-400">15% OFF</strong> code right now to initialize scaling.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter console email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-sm text-white transition-all font-mono"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,107,53,0.3)] from-primary to-[#FF8C61] hover:shadow-[0_0_25px_rgba(255,107,53,0.5)] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 border-none transition-all uppercase tracking-wide"
                    >
                      {loading ? "Decrypting..." : (
                        <>
                          Unlock 15% Discount <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  <button onClick={closePopup} className="text-xs text-center w-full mt-4 text-gray-500 hover:text-primary underline underline-offset-4 decoration-current/30 cursor-pointer uppercase font-black tracking-widest">
                    No thanks, load full price.
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
