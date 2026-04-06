"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { trackLead } from "@/components/analytics/FBPixel";

/**
 * Exit Intent Modal — Variant B
 * Headline: "WAIT — Your Swarm Awaits"
 * CTA: "CLAIM FREE CHEATSHEET"
 * Color scheme: #CCFF00 on black (reversed from Variant A)
 */
export function ExitIntentModalB() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    },
    [hasShown]
  );

  useEffect(() => {
    const dismissed = sessionStorage.getItem("exit_modal_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("exit_modal_dismissed", "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent_B" }),
      });
      if (res.ok) {
        trackLead("exit_intent_B");
        setIsSuccess(true);
        setTimeout(() => {
          handleDismiss();
        }, 2500);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismiss();
          }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-md bg-[#CCFF00] border-4 border-black shadow-[20px_20px_0_#000] overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-2 bg-black w-full" />

            {/* Close button */}
            <button
              id="exit-modal-b-close"
              onClick={handleDismiss}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 bg-black text-[#CCFF00] flex items-center justify-center hover:scale-110 transition-transform border border-black"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-10">
              {!isSuccess ? (
                <>
                  {/* Icon */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,0.2)]">
                      <Zap className="w-5 h-5 text-[#CCFF00]" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/60 italic">
                      SWARM_INTEL // FREE_DROP
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-tight mb-3 text-black">
                    WAIT —<br />
                    Your Swarm<br />
                    Awaits.
                  </h2>

                  <p className="text-sm font-black uppercase tracking-widest text-black/60 italic leading-relaxed mb-8">
                    Don&apos;t leave without your free{" "}
                    <span className="text-black underline decoration-2 underline-offset-2">
                      AI Ops Cheatsheet
                    </span>{" "}
                    — 27 automation playbooks used by ₹10Cr+ founders.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4" id="exit-modal-b-form">
                    <div>
                      <label
                        htmlFor="exit-modal-b-email"
                        className="block text-[9px] font-black uppercase tracking-widest text-black/50 mb-2"
                      >
                        Your Email
                      </label>
                      <input
                        id="exit-modal-b-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="agent@swarm.infra"
                        className="w-full h-12 bg-black text-[#CCFF00] border-2 border-black px-4 font-mono font-black text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-black/30 italic"
                      />
                    </div>
                    <button
                      id="exit-modal-b-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-black text-[#CCFF00] border-2 border-black font-black uppercase italic tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-[6px_6px_0_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
                    >
                      {isSubmitting ? "TRANSMITTING..." : "CLAIM FREE CHEATSHEET →"}
                    </button>
                    <p className="text-[9px] text-black/40 italic text-center font-black uppercase tracking-widest">
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-6 text-center"
                >
                  <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
                    <Zap className="w-8 h-8 text-[#CCFF00]" />
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-3 text-black">
                    NODE_LINKED
                  </h3>
                  <p className="text-xs font-black uppercase tracking-widest text-black/60 italic">
                    Your AI Ops Cheatsheet is inbound. Check your inbox.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
