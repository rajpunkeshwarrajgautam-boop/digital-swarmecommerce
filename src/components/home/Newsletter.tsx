"use client";

import { motion } from "framer-motion";
import { Send, Radio, Sparkles } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <section className="bg-white py-32 border-y-8 border-black relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="text-[20vw] font-black uppercase italic leading-[0.8] tracking-tighter whitespace-nowrap -rotate-12 translate-y-1/4">
          OPERATIONAL STREAM // OPERATIONAL STREAM // OPERATIONAL STREAM
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-md">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic"
            >
              <Radio className="w-3 h-3 animate-pulse" />
              Live Frequency
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase italic leading-[0.85] mb-6">
              Join the <br />
              <span className="text-primary">Operational</span> <br />
              Swarm.
            </h2>
            <p className="text-black/60 font-medium uppercase text-xs tracking-widest leading-relaxed">
              Hardened engineering protocols, zero-day vulnerabilities reports, and marketplace transmission updates.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <form onSubmit={handleSubmit} className="relative group">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER FREQUENCY (EMAIL)" 
                className="w-full bg-black/5 border-8 border-black p-8 pr-40 font-black uppercase italic tracking-tighter text-2xl focus:bg-[#CCFF00]/10 outline-none transition-all shadow-[16px_16px_0_#000] focus:shadow-[12px_12px_0_#ff6b35]"
              />
              <button 
                type="submit"
                disabled={status !== "idle"}
                className={`absolute right-4 top-4 bottom-4 px-8 bg-black text-white font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-3 ${status !== "idle" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {status === "loading" ? "SYNCING..." : status === "success" ? "SYNCED" : (
                  <>
                    <Send className="w-4 h-4" />
                    Connect
                  </>
                )}
              </button>
            </form>
            <div className="mt-8 flex items-center gap-6 opacity-30 grayscale pointer-events-none">
               <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">No Spam Protocol</span>
               </div>
               <div className="w-1 h-1 bg-black rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-widest italic">Encrypted Transmission</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
