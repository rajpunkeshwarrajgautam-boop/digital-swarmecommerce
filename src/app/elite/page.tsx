"use client";

import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { products } from "@/lib/data";
import { ShieldCheck, Zap, Activity, Users, Lock, Hexagon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EliteTierPage() {
  const { addItem, toggleCart } = useCartStore();
  
  const eliteProduct = products.find(p => p.id === "swarm-elite-subscription");

  const handleSubscribe = () => {
    if (eliteProduct) {
      addItem(eliteProduct);
      toggleCart();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-inter pt-24 pb-20">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#001a33,transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#001122,transparent_40%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <header className="text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-24 h-24 mx-auto mb-8 relative flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />
            <Hexagon className="w-full h-full text-cyan-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] stroke-1" />
            <ShieldCheck className="w-10 h-10 text-white absolute absolute-center drop-shadow-lg" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-cyan-500 font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4"
          >
            Secure Neural Network Access
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6"
          >
            Swarm <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">Elite</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Stop buying isolated systems. Get continuous access to our evolving architecture, weekly new AI models, and direct access to our core engineering team. This is the 1%.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Features Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <div className="flex gap-4 p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <Zap className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Weekly Payload Deliveries</h3>
                <p className="text-gray-400 text-sm">Every Friday, we drop a brand new, fully functioning AI agent codebase into the vault. Yours to download and deploy.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <Users className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Private Discord Hierarchy</h3>
                <p className="text-gray-400 text-sm">Bypass the public noise. Network with other 7-figure engineers and founders in our gated, heavily encrypted Discord server.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-cyan-900/10 border border-cyan-500/20 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <Activity className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">1-on-1 Slack Uplink</h3>
                <p className="text-gray-400 text-sm">Stuck on a bug? Need architectural advice? Our Lead Engineers will jump into a private Slack thread with you to solve it.</p>
              </div>
            </div>
          </motion.div>

          {/* Pricing Plane */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500/10 blur-[50px] rounded-full" />
            <div className="relative p-1 bg-linear-to-b from-cyan-500/50 to-transparent rounded-3xl overflow-hidden">
              <div className="bg-[#050a10] rounded-[22px] p-8 md:p-12 relative overflow-hidden backdrop-blur-xl">
                {/* Visual grid in card */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                    <Lock className="w-3 h-3" /> Secure Monthly Protocol
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-2xl text-gray-400 font-bold">₹</span>
                    <span className="text-7xl font-black italic tracking-tighter">3,999</span>
                    <span className="text-gray-400 font-bold mt-6">/ mo</span>
                  </div>

                  <p className="text-sm text-gray-400 mb-10">Cancel anytime. Zero lock-in contracts. Instant access upon verification.</p>

                  <button 
                    onClick={handleSubscribe}
                    className="w-full relative group overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase italic tracking-widest text-lg py-5 rounded-xl transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                       Initialize Elite Uplink -&gt;
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </button>

                  <p className="mt-6 text-xs text-gray-500 font-mono flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Vault
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
