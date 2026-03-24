"use client";

import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function EmailCapture() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <section className="py-32 bg-secondary relative overflow-hidden">
      <div className="container px-6 mx-auto relative z-10 w-full max-w-5xl">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
          {/* Accent Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter uppercase italic leading-none mb-6">
              Join the <span className="text-primary italic">Swarm</span>
            </h2>
            <p className="text-secondary/50 font-bold text-lg uppercase tracking-tight mb-12">
              Get the latest architectural reports and exclusive early-access protocols. No spam. Join 1,500+ elite developers.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-black text-secondary italic uppercase">Neural Uplink Complete!</h4>
                <p className="text-secondary/40 font-bold uppercase tracking-widest text-xs">Check your inbox for the welcome protocol.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <input 
                    type="email" 
                    required
                    placeholder="ENTER YOUR PROTOCOL EMAIL..."
                    className="w-full h-16 bg-secondary/5 border-2 border-transparent focus:border-primary/20 focus:bg-white px-8 rounded-2xl font-black uppercase text-secondary italic tracking-tight placeholder:text-secondary/20 outline-hidden transition-all"
                  />
                </div>
                <button 
                  disabled={status === "loading"}
                  className="h-16 px-10 bg-primary text-white font-black uppercase italic rounded-2xl border-4 border-secondary hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[8px_8px_0_rgba(26,26,46,1)] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {status === "loading" ? "Uplinking..." : "Subscribe"}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}

            <div className="mt-8 flex items-center gap-4 opacity-30">
               <div className="flex -space-x-1">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-secondary border border-white" />)}
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Secured by industry standards</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Pattern */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
    </section>
  );
}
