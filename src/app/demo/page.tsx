"use client";

import { motion } from "framer-motion";
import { Play, Terminal, Zap, Shield, Globe, Cpu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          <div className="text-center space-y-6">
            <h1 className="text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none">Intelligence_Demo</h1>
            <p className="text-primary text-2xl font-bold uppercase tracking-[0.2em]">Witness the power of the Digital Swarm.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="p-1 border-2 border-white/10 bg-zinc-900 group hover:border-primary transition-all shadow-[12px_12px_0px_#000]">
               <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  <Play className="w-16 h-16 text-primary group-hover:scale-125 transition-transform" />
                  <div className="absolute bottom-4 left-4 text-[10px] font-black uppercase text-white/40 font-mono">Stream: Swarm_UI_Kit_v3.mp4</div>
               </div>
            </div>

            <div className="flex flex-col justify-center space-y-8">
               <div className="space-y-4">
                  <h3 className="text-4xl font-black italic uppercase italic">Seamless Deployment</h3>
                  <p className="text-white/40 font-bold uppercase tracking-tight text-sm">Experience the instant-sync architecture. From local chassis to global uplink in <span className="text-primary">60 seconds</span>. Our templates are engineered for pure velocity.</p>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <div className="h-1 w-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-primary w-3/4 animate-pulse" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-white/40 italic">LCP: 0.8s</span>
                  </div>
                  <div className="space-y-2">
                     <div className="h-1 w-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-[#a855f7] w-full" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-white/40 italic">Accessibility: 100%</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 pt-12">
             <Link href="/products">
                <Button className="bg-primary text-black hover:bg-white border-none px-12 h-16 text-xl font-black uppercase italic tracking-tighter transform hover:scale-105 transition-transform">
                  Browse the Swarm
                </Button>
             </Link>
             <Link href="/pricing">
                <Button variant="outline" className="border-white/20 text-white hover:border-primary px-12 h-16 text-xl font-black uppercase italic tracking-tighter">
                  View Upgrades
                </Button>
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
