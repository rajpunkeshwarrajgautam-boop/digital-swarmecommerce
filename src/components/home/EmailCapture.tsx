"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setLoading(true);
    // Simulate subscription
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section className="py-40 bg-white border-t border-black/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Final Push */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left gap-8"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-50 border border-cyan-100 shadow-sm w-fit">
              <Zap className="w-4 h-4 text-cyan-500 fill-cyan-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-cyan-600 uppercase italic">Conversion Protocol</span>
            </div>

            <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter text-gray-900">
              STILL <br />
              <span className="text-cyan-500">HESITATING?</span>
            </h2>
            
            <p className="text-gray-500 text-lg font-bold uppercase tracking-tight max-w-md leading-tight">
              Access the baseline architectural mainframe. All code protocols are ready for production. 
              <span className="text-gray-900"> High ROI established in 2,400+ deployments.</span>
            </p>

            <Link href="/products" className="group">
              <button className="inline-flex items-center gap-6 bg-black text-white font-black text-2xl px-12 py-6 rounded-none shadow-[12px_12px_0_#22d3ee] hover:shadow-[6px_6px_0_#22d3ee] hover:translate-x-1 hover:translate-y-1 transition-all duration-300 uppercase tracking-widest italic">
                Enter Void
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Right: Soft Conversion (Not Ready to Buy?) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-50 rounded-[3rem] p-10 md:p-14 border border-black/5 relative"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">NOT READY TO BUY?</h3>
                <p className="text-gray-400 font-bold uppercase tracking-tight text-xs">
                  Join 11,000+ developers receiving the <span className="text-cyan-600">Free AI Agent Blueprint</span> and weekly code injections.
                </p>
              </div>

              <div className="w-full">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center gap-6 py-10 bg-white rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xl font-black uppercase italic text-gray-900">Uplink Established</span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Check your command center (Inbox).</span>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                      <div className="relative group">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="EMAIL_IDENTIFIER@HOST.COM"
                          required
                          className="w-full px-8 py-6 bg-white border-2 border-transparent text-gray-900 font-black text-xl uppercase italic rounded-2xl focus:outline-none focus:border-black transition-all placeholder:text-gray-200 shadow-sm"
                        />
                        <div className="absolute inset-0 rounded-2xl border-2 border-black/5 pointer-events-none group-hover:border-black/10 transition-colors" />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-black text-white font-black uppercase italic rounded-2xl border-4 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 group/btn"
                      >
                        {loading ? "LINKING..." : (
                          <>
                            Get Free Blueprint <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/5">
                        <div className="flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">No Spam Protocol</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Unsubscribe Anytime</span>
                        </div>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

