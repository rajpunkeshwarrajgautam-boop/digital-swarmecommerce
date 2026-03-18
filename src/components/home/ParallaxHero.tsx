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
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.05] pointer-events-none" />
      
      {/* Floating 3D Element Sim (Advanced CSS 3D) */}
      <motion.div 
        animate={{ 
          rotateY: [0, 360],
          z: [0, 20, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-80 h-80 hidden xl:block preserve-3d pointer-events-none"
      >
        <div className="absolute inset-0 border-[0.5px] border-primary/20 bg-zinc-950/80 transform rotate-45 flex items-center justify-center">
            <div className="w-full h-full border border-primary/10 animate-pulse" />
            <div className="absolute text-[8px] font-black tracking-[1em] text-primary transform -rotate-45 opacity-20">SYSTEM_RECOVERY_LOADED</div>
        </div>
        <div className="absolute inset-2 border border-primary/40 bg-zinc-900/40 transform -rotate-12" />
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
                  className="text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-black italic uppercase leading-[0.75] tracking-[-0.08em] inline-block"
                >
                  {char === "_" ? <span className="text-primary">_</span> : char}
                </motion.span>
             ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 max-w-3xl border-l border-primary/40 pl-10"
          >
            <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
                We Help Indian Businesses <br/> 
                <span className="text-primary underline underline-offset-[12px] decoration-2">Scale to 7-Figures</span> <br/>
                with Data-Driven Marketing.
            </h2>
            <p className="text-sm md:text-base text-white/40 font-bold uppercase italic tracking-[0.2em] leading-relaxed max-w-xl">
                The absolute standard in algorithmic growth. 
                Optimized blueprints for high-performance market dominance.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-wrap gap-6"
        >
          <Link href="/contact">
            <Button size="xl" className="shadow-[20px_20px_0px_rgba(var(--primary-rgb),0.1)] active:shadow-none active:translate-x-2 active:translate-y-2 bg-primary text-black hover:bg-white transition-all font-black uppercase italic tracking-[0.2em]">
              Get Free Strategy Call
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="xl" className="border-white/10 hover:border-primary hover:text-primary transition-all font-black uppercase italic tracking-[0.2em]">
              View Protocols
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
        <div className="w-px h-24 bg-linear-to-b from-white to-transparent" />
      </motion.div>
    </div>
  );
}
