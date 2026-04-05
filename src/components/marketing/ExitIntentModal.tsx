"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { ForgeToast } from "@/components/ui/ForgeToast";

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasFired, setHasFired] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Determine if we've already shown it this session
    const fired = sessionStorage.getItem("exit_intent_fired");
    if (fired) {
      setHasFired(true);
      return;
    }

    const mouseEvent = (e: MouseEvent) => {
      // If mouse leaves the top of the browser viewport (exit intent)
      if (e.clientY <= 0 && !hasFired && !isOpen) {
        setIsOpen(true);
        setHasFired(true);
        sessionStorage.setItem("exit_intent_fired", "true");
      }
    };

    // Mobile fallback (fire after 45 seconds of inactivity)
    let mobileTimer: NodeJS.Timeout;
    if (window.innerWidth < 768 && !hasFired) {
      mobileTimer = setTimeout(() => {
        setIsOpen(true);
        setHasFired(true);
        sessionStorage.setItem("exit_intent_fired", "true");
      }, 45000);
    }

    document.addEventListener("mouseleave", mouseEvent);
    
    return () => {
      document.removeEventListener("mouseleave", mouseEvent);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, [hasFired, isOpen, pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent_modal" }),
      });

      if (res.ok) {
         window.dispatchEvent(new CustomEvent('forge-toast', { 
            detail: { message: "Blueprint sent securely to your inbox.", type: "success" }
         }));
         setIsOpen(false);
      } else {
         throw new Error("Failed to subscribe");
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('forge-toast', { 
         detail: { message: "Uplink failed. Please try again later.", type: "error" }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-[#0d0d12] border border-primary/20 p-1 rounded-sm shadow-[0_0_100px_rgba(204,255,0,0.15)]"
        >
          <div className="absolute top-4 right-4 z-10 cursor-pointer text-zinc-500 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </div>

          <div className="border border-white/5 bg-black/50 p-8 pt-12 flex flex-col items-center text-center">
            
            <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
               <Lock className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <h2 className="text-3xl font-outfit font-black italic uppercase tracking-tighter mb-4 text-white">
              Leaving the <span className="text-primary">Swarm?</span>
            </h2>
            <p className="text-sm font-mono text-zinc-400 mb-8 max-w-[80%] leading-relaxed">
              Before you disconnect, download the <strong className="text-white">Omega Protocol PDF</strong>. A tactical guide to scaling Autonomous Agents inside your business.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                required
                placeholder="ENTER_SECURE_EMAIL..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-black/50 border border-white/10 px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary/50 text-white placeholder:text-zinc-600 transition-colors"
              />
              <ForgeButton 
                 type="submit" 
                 variant="primary" 
                 className="py-3 px-8 text-sm"
                 disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                     <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                     TRANSMITTING
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                     UNLOCK_PDF <Send className="w-4 h-4 ml-1" />
                  </span>
                )}
              </ForgeButton>
            </form>
            
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-6">
              100% Encrypted. No Spam. Unsubscribe Anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
