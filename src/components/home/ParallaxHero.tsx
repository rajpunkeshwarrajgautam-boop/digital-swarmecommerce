"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ParallaxHero() {
  const ref = useRef(null);

  return (
    <div ref={ref} className="w-full min-h-[95vh] relative overflow-hidden bg-background border-b border-white/5 flex flex-col items-center justify-center pt-24">
      
      {/* Ono Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-10 pointer-events-none" />
      
      {/* Floating 3D Element Sim (Toon Style) */}
      <motion.div 
        animate={{ 
          rotateX: [0, 15, 0],
          rotateY: [0, 25, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-[15%] w-64 h-64 border-4 border-primary bg-zinc-950/50 backdrop-blur-xl hidden xl:block preserve-3d shadow-[20px_20px_0px_#000]"
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <span className="text-4xl font-black italic text-primary leading-none opacity-20">SWARM_SYSTEM_01</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-start gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary text-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.4em]"
        >
          [ Status: Ready to Ship ]
        </motion.div>

        <div className="flex flex-col gap-0">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black italic uppercase leading-[0.8] tracking-[-0.08em] select-none"
          >
            Digital<br/>
            <span className="text-primary">Swarm</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 max-w-2xl border-l-4 border-primary pl-8"
          >
            <p className="text-xl md:text-2xl text-white/70 font-bold leading-tight uppercase italic tracking-tighter">
              The high-performance source code vault for developers who build the future. 
              Zero boilerplate, just pure architectural power.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Link href="/products">
            <Button className="h-20 px-12 bg-white text-black font-black uppercase tracking-widest rounded-none text-xl hover:bg-primary transition-all duration-300 shadow-[10px_10px_0px_#000000]">
              Access Vault
              <ArrowRight className="w-6 h-6 ml-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="h-20 px-12 border-4 border-white text-white font-black uppercase tracking-widest rounded-none text-xl hover:bg-white hover:text-black transition-all duration-300">
              Operations
            </Button>
          </Link>
        </motion.div>

        {/* Technical Specs Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 w-full grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5 opacity-40"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Protocol</span>
            <span className="text-lg font-black uppercase italic">NEXT.JS_15</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Encryption</span>
            <span className="text-lg font-black uppercase italic">SECURE_PG</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Delivery</span>
            <span className="text-lg font-black uppercase italic">INSTANT_SYNC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Status</span>
            <span className="text-lg font-black uppercase italic">LIVE_24/7</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Scroll</span>
        <div className="w-[2px] h-12 bg-white" />
      </motion.div>
    </div>
  );
}
