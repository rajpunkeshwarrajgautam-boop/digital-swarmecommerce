"use client";

import { motion } from "framer-motion";
import { Send, Radio, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { trackLead } from "@/components/analytics/FBPixel";
import { trackEcommerceEvent } from "@/lib/web-analytics";

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
        setMessage(data.message || "Subscription confirmed. Check your inbox.");
        trackLead("newsletter");
        trackEcommerceEvent("generate_lead", { source: "newsletter", placement: "onsite" });
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please retry.");
    }

    window.setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 5000);
  };

  return (
    <section className="bg-white py-28 border-y border-black/10 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-14">
          <div className="max-w-md">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Radio className="w-3 h-3 text-primary" /> Store updates
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-5xl md:text-6xl font-black text-black tracking-tighter uppercase leading-[0.9] mb-6">
              Get product <span className="text-primary">updates</span>.
            </motion.h2>
            <p className="text-black/60 text-sm leading-7">
              Subscribe for new product releases, practical implementation notes, and material store updates. Your email is saved through our configured Resend contact list.
            </p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="relative">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={status === "loading"}
                className="w-full rounded-2xl bg-black/5 border border-black/15 p-6 pr-36 font-semibold text-base text-black outline-none focus:border-primary transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="absolute right-2 top-2 bottom-2 rounded-xl px-6 font-black uppercase tracking-widest text-xs flex items-center gap-2 bg-black text-white hover:bg-primary hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Saving" : <><Send className="w-4 h-4" /> Subscribe</>}
              </button>
            </form>

            {message && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 flex items-center gap-2 text-sm font-semibold ${status === "success" ? "text-green-700" : "text-red-700"}`}>
                {status === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message}
              </motion.p>
            )}

            <p className="mt-5 text-xs text-black/40">
              No fabricated scarcity or hidden signup flow. Subscription succeeds only when the backend saves your contact.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
