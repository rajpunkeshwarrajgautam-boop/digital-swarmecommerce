"use client";

import { motion } from "framer-motion";
import { Send, Radio, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

/**
 * Newsletter subscription component.
 * Wired to the real /api/newsletter Resend-powered endpoint.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Signal acquired. Check your inbox.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Transmission failed. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please retry.");
    } finally {
      if (status !== "idle") {
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 4000);
      }
    }
  };

  return (
    <section className="bg-white py-32 border-y-8 border-black relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="text-[20vw] font-black uppercase italic leading-none tracking-tighter whitespace-nowrap -rotate-12 translate-y-1/4">
          OPERATIONAL STREAM // OPERATIONAL STREAM // OPERATIONAL STREAM
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16">

          {/* Left: Copy */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic"
            >
              <Radio className="w-3 h-3 animate-pulse text-[#CCFF00]" />
              Live Frequency
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase italic leading-[0.85] mb-6"
            >
              Join the <br />
              <span className="text-primary">Operational</span> <br />
              Swarm.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-black/60 font-medium uppercase text-xs tracking-widest leading-relaxed"
            >
              Engineering protocols, zero-day vulnerability reports, and marketplace drops — straight to your inbox.
            </motion.p>

            {/* Perks */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 space-y-2"
            >
              {["Zero spam protocol", "Exclusive early access", "Weekly drop alerts"].map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/40">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  {perk}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
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
                disabled={status === "loading" || status === "success"}
                className="w-full bg-black/5 border-8 border-black p-6 pr-36 font-black uppercase italic tracking-tighter text-xl focus:bg-[#CCFF00]/10 outline-none transition-all shadow-[14px_14px_0_#000] focus:shadow-[10px_10px_0_#E83A30] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status !== "idle" || !email}
                aria-label="Subscribe to newsletter"
                className={`absolute right-3 top-3 bottom-3 px-6 font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all ${
                  status === "success"
                    ? "bg-[#CCFF00] text-black"
                    : status === "error"
                    ? "bg-[#E83A30] text-white"
                    : "bg-black text-white hover:bg-primary hover:text-black"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {status === "loading" && <span className="animate-pulse">SYNCING</span>}
                {status === "success" && <><CheckCircle2 className="w-4 h-4" /> SYNCED</>}
                {status === "error" && <><AlertCircle className="w-4 h-4" /> RETRY</>}
                {status === "idle" && <><Send className="w-4 h-4" /> Connect</>}
              </button>
            </form>

            {/* Status Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-[11px] font-black uppercase tracking-widest ${
                  status === "success" ? "text-green-600" : "text-[#E83A30]"
                }`}
              >
                {message}
              </motion.p>
            )}

            {/* Trust Strip */}
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
