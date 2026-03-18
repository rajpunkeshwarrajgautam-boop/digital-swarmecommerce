"use client";

import { Star, ArrowRight, Download, ShieldCheck, Zap, CheckCircle, Gift, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductHuntHub() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-mono">
      
      {/* ONO Industrial Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-primary text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] w-fit italic"
            >
              [ PH_IDENTIFIED_v2.0 ]
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]">
              ST0P_BUILDING <br /> <span className="text-primary tracking-tighter not-italic">START_SHIPPING.</span>
            </h1>
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 pt-12">
               <p className="text-2xl text-white/40 max-w-2xl font-bold uppercase italic tracking-tighter leading-tight">
                  Welcome, Hunter. You&apos;ve bypassed the noise. <br/>
                  Exclusive <span className="text-white">40% DISCOUNT</span> unlocked for the PH community.
               </p>
               
               <div className="flex flex-col gap-6 w-full md:w-auto">
                  <Link href="/products">
                    <button className="bg-primary text-black font-black px-12 py-6 uppercase italic tracking-[0.3em] hover:bg-white transition-all text-xs border-none shadow-[20px_20px_0px_rgba(var(--primary-rgb),0.1)] active:shadow-none w-full md:w-auto">
                      CLAIM_PH_DISCOUNT_v40
                    </button>
                  </Link>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary/40 italic">
                    <Terminal className="w-4 h-4" /> AUTH_TOKEN: HUNTER40
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Grid */}
      <section className="py-24 border-b border-white/5 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 divide-x divide-white/5 border border-white/5">
            <div className="p-12 space-y-6 hover:bg-primary/5 transition-colors group">
                <Zap className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Bypass_Setup</h3>
                <p className="text-white/40 text-sm font-bold uppercase italic tracking-tighter leading-relaxed">
                    Zero manual boilerplate. Production-grade Clerk_Auth, Supabase_Cloud, and Tailwind_Core integrated into every protocol.
                </p>
            </div>
            <div className="p-12 space-y-6 hover:bg-primary/5 transition-colors group">
                <ShieldCheck className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Scalable_Kernal</h3>
                <p className="text-white/40 text-sm font-bold uppercase italic tracking-tighter leading-relaxed">
                    Clean TypeScript blueprints. Next.js 15+ Server Components. Built for high-velocity scaling, not just demo scripts.
                </p>
            </div>
            <div className="p-12 space-y-6 hover:bg-primary/5 transition-colors group">
                <Download className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Universal_License</h3>
                <p className="text-white/40 text-sm font-bold uppercase italic tracking-tighter leading-relaxed">
                    Commercial rights included. Ship unlimited sub-mainframes for yourself or clients without recurring taxation.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tactical Stats */}
      <section className="py-32 relative border-b border-white/5">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div>
                    <p className="text-5xl font-black tracking-tighter italic">₹3.5M+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-4 italic">DEV_TIME_SAVED</p>
                </div>
                <div>
                    <p className="text-5xl font-black tracking-tighter italic">4.2k</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mt-4 italic">UNITS_DEPLOYED</p>
                </div>
                <div>
                    <p className="text-5xl font-black tracking-tighter italic">18+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mt-4 italic">ELITE_PROTOCOLS</p>
                </div>
                <div>
                    <p className="text-5xl font-black tracking-tighter italic text-primary">24h</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/50 mt-4 italic">SUPPORT_SLA</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Transmition */}
      <section className="py-48 bg-primary text-black relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl bg-black w-[500px] h-[500px] rounded-none translate-x-1/2 -translate-y-1/2 transition-all group-hover:scale-150 duration-700" />
        <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
            <div className="flex justify-center gap-4">
              <Gift className="w-16 h-16" />
            </div>
            <h2 className="text-5xl md:text-9xl font-black italic uppercase tracking-[0.1em] leading-none">READY_TO_SHIP?</h2>
            <div className="max-w-xl mx-auto py-8 border-y-2 border-black/20">
               <p className="text-lg font-black uppercase tracking-widest italic">
                  USE_KEY: <span className="bg-black text-white px-4 py-2 mx-2">HUNTER40</span> // VALID_LIFETIME
               </p>
            </div>
            <div className="pt-12">
                <Link href="/products">
                    <button className="bg-black text-white font-black px-16 py-8 uppercase italic tracking-[0.4em] hover:bg-zinc-900 transition-all text-xl border-none shadow-[20px_20px_0px_rgba(0,0,0,0.1)] active:shadow-none">
                        ENTER_CATALOG
                    </button>
                </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-12 pt-12 opacity-50">
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest italic">
                   <CheckCircle className="w-5 h-5" /> SECURE_STRIPE_GATEWAY
                </div>
                <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest italic">
                   <CheckCircle className="w-5 h-5" /> INSTANT_PROTO_DELIVERY
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}
