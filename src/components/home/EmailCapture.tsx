"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";
import Link from "next/link";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setLoading(true);
    // Simulate subscription (replace with your email provider API call)
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-40 bg-background border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-5" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-start text-left">
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 w-full"
          >
            <h2 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
              System<br/>
              <span className="text-primary">Engagement</span>
            </h2>
            <p className="text-white/50 text-xl font-bold italic uppercase tracking-tighter mb-12 max-w-xl">
              Access the full architectural mainframe. All protocols are ready for immediate deployment.
            </p>
            <Link href="/products">
              <button className="group inline-flex items-center gap-6 bg-white text-black font-black text-2xl px-12 py-6 rounded-none shadow-[15px_15px_0px_#000] hover:shadow-[20px_20px_0px_#000] hover:-translate-y-1 transition-all duration-300 uppercase tracking-[0.2em] italic">
                Enter Void
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Email capture divider */}
          <div className="w-full h-px bg-white/5 mb-24 flex items-center justify-center">
            <span className="bg-background px-8 text-xs font-black uppercase tracking-[0.5em] text-white/20 italic">Alternative Connection</span>
          </div>

          {/* Email form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full flex flex-col md:flex-row justify-between items-end gap-12"
          >
            <div className="max-w-md">
              <h3 className="text-3xl font-black italic uppercase tracking-tight mb-4 text-primary">Transmission Protocol</h3>
              <p className="text-white/40 font-bold uppercase tracking-tighter text-sm">
                Secure a direct link to the Digital Swarm intelligence network. 
                Receive weekly system updates and architectural advancements.
              </p>
            </div>

            <div className="flex-1 w-full max-w-xl">
              {submitted ? (
                <div className="flex items-center justify-start gap-4 text-primary font-black uppercase italic py-8 border-b-4 border-primary">
                  <Send className="w-8 h-8" />
                  Link Established. Check Command Center.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-0 w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER_EMAIL_IDENTIFIER"
                    required
                    className="w-full px-0 py-8 bg-transparent border-b-4 border-white/10 text-white font-black text-2xl uppercase italic focus:outline-none focus:border-primary transition-all placeholder:text-white/10"
                  />
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">No Tracking. Zero Latency.</p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-4 bg-primary text-black font-black px-12 py-4 rounded-none border-b-4 border-black hover:bg-white transition-all text-sm uppercase tracking-widest"
                    >
                      {loading ? "LINKING..." : (
                        <>
                          Establish Link <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
