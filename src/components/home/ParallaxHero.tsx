"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const letterVariants: Variants = {
    initial: { y: "110%", rotateZ: 10 },
    animate: (i: number) => ({
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.8,
        delay: 0.2 + i * 0.1,
        ease: "circOut",
      },
    }),
  };

  const text = "DIGITAL_SWARM";

  return (
    <div ref={containerRef} className="w-full min-h-[95vh] relative overflow-hidden bg-background border-b border-white/5 flex flex-col items-center justify-center pt-24 perspective-[1000px]">
      
      {/* Ono Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Floating 3D Element Sim (Advanced CSS 3D) */}
      <motion.div 
        animate={{ 
          rotateY: [0, 360],
          z: [0, 50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-80 h-80 hidden xl:block preserve-3d"
      >
        <div className="absolute inset-0 border-[0.5px] border-primary/20 bg-zinc-950/20 backdrop-blur-3xl transform rotate-45 flex items-center justify-center">
            <div className="w-full h-full border border-primary/10 animate-pulse" />
            <div className="absolute text-[8px] font-black tracking-[1em] text-primary transform -rotate-45 opacity-20">SYSTEM_RECOVERY_LOADED</div>
        </div>
        <div className="absolute inset-2 border border-primary/40 bg-transparent transform -rotate-12" />
        <div className="absolute inset-8 border border-white/5 bg-zinc-900/40 transform rotate-90" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-start gap-12">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-primary text-black px-4 py-1 text-[10px] font-black uppercase tracking-[0.5em] origin-left"
        >
          [ CORE_PROTOCOL_INIT ]
        </motion.div>

        <div className="flex flex-col gap-0 select-none">
          <div className="flex flex-wrap gap-x-[0.05em] overflow-hidden py-4">
             {text.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-black italic uppercase leading-[0.75] tracking-[-0.08em] inline-block"
                >
                  {char === "_" ? <span className="text-primary">_</span> : char}
                </motion.span>
             ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 max-w-xl border-l-[1px] border-white/10 pl-10"
          >
            <p className="text-lg md:text-xl text-white/50 font-bold leading-tight uppercase italic tracking-tighter">
                The absolute standard in algorithmic source code. 
                Optimized blueprints for the high-performance developer ecosystem.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 flex flex-wrap gap-6"
        >
          <Link href="/products">
            <Button className="h-24 px-16 bg-white text-black font-black uppercase tracking-[0.2em] rounded-none text-2xl hover:bg-primary hover:scale-[1.02] transition-all duration-500 shadow-[20px_20px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-2 active:translate-y-2">
              Sync Vault
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="h-24 px-16 border-[1px] border-white/20 text-white/50 font-black uppercase tracking-[0.2em] rounded-none text-2xl hover:border-white hover:text-white transition-all duration-300">
              Operations
            </Button>
          </Link>
        </motion.div>

        {/* Technical Specs Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-32 w-full grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/5"
        >
          {[
            { label: "Protocol", value: "NEXT_ARCH_V2" },
            { label: "Throughput", value: "ULTRA_LATENCY" },
            { label: "Encryption", value: "SILK_SHA256" },
            { label: "Status", value: "LIVE_NODES" }
          ].map((spec, i) => (
            <div key={i} className="flex flex-col gap-2 group cursor-crosshair">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/50 group-hover:text-primary transition-colors italic">{spec.label}</span>
              <span className="text-xl font-black uppercase italic tracking-tighter text-white/30 group-hover:text-white transition-colors">{spec.value}</span>
              <div className="w-0 group-hover:w-full h-px bg-primary transition-all duration-500" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-6 hidden md:flex flex-col items-center gap-4 opacity-20"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.4em] rotate-90 origin-left ml-4">Scroll_Down</span>
        <div className="w-px h-24 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </div>
  );
}
