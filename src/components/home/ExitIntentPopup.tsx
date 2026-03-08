"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Check if user has already seen it
    const hasSeen = localStorage.getItem("digitalswarm_exit_intent");
    if (hasSeen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger if mouse moves above the top edge of the window
      if (e.clientY <= 0 || e.clientY < 5) {
        setIsVisible(true);
        localStorage.setItem("digitalswarm_exit_intent", "true");
        // Remove listener after triggering
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    
    setLoading(true);
    // Simulate API call to save email (e.g. to Supabase contacts)
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[-1]"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full relative border border-black/10 flex flex-col sm:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 text-black/50 hover:text-black bg-white/50 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Visual Side */}
            <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 sm:w-2/5 p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
               <Mail className="w-16 h-16 mb-4 relative z-10 opacity-90 drop-shadow-lg" />
               <h3 className="text-3xl font-black uppercase tracking-tight relative z-10 leading-none">Wait!</h3>
            </div>

            {/* Form Side */}
            <div className="sm:w-3/5 p-8 bg-white flex flex-col justify-center">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50 cursor-pointer">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Check Your Inbox!</h4>
                  <p className="text-gray-500 text-sm">We&apos;ve just sent your 10% discount code.</p>
                  <Button variant="outline" className="mt-6 w-full text-black hover:bg-gray-50 border-gray-200" onClick={closePopup}>Continue Browsing</Button>
                </div>
              ) : (
                <>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2 leading-tight tracking-tight">Don&apos;t leave empty-handed.</h4>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Get a secret <strong className="text-pink-600">10% OFF</strong> code right now plus our free monthly developer insights.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-sm text-black transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-linear-to-r hover:-translate-y-0.5 shadow-md shadow-purple-500/20 from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 border-none transition-all"
                    >
                      {loading ? "Unlocking..." : (
                        <>
                          Unlock My 10% Off <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  <button onClick={closePopup} className="text-xs text-center w-full mt-4 text-gray-400 hover:text-gray-600 underline underline-offset-4 decoration-current/30 decoration-dashed">
                    No thanks, I&apos;ll pay full price.
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
