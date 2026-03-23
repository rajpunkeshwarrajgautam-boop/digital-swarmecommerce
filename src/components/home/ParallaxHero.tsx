"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShoppingBag, Zap } from "lucide-react";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen relative overflow-hidden bg-transparent"
    >
      <div className="container relative z-30 flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen pt-28 pb-12 gap-8 lg:gap-12 px-4 sm:px-6 w-full max-w-7xl mx-auto overflow-hidden">
        
        {/* Left: Typography & CTAs */}
        <motion.div
          className="flex flex-col gap-6 lg:max-w-xl w-full"
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm w-fit backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">v2.0 Now Available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight uppercase max-w-full">
            Launch Your <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 inline-block w-full truncate sm:whitespace-normal">
              SaaS Effortlessly
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed max-w-lg">
            Create a beautiful storefront, manage orders, and start selling globally — all from one simple dashboard powered by autonomous AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Link href="/products" className="w-full sm:w-auto block">
              <button className="w-full sm:w-auto bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group">
                Browse Agents
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/freebies" className="w-full sm:w-auto block">
              <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-cyan-400" />
                Free Tools
              </button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 mt-6 text-sm text-gray-400 font-semibold">
            <span className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">✓</span> 
              No coding required
            </span>
            <span className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">✓</span> 
              Instant access
            </span>
          </div>
        </motion.div>

        {/* Right: 3D Aesthetic Mockup / Visual */}
        <motion.div
          className="relative w-full lg:w-1/2 flex items-center justify-center lg:h-[600px] mt-8 lg:mt-0"
          style={{ y: y1 }}
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square scale-90 sm:scale-100"
          >
            {/* Soft UI Dashboard Mockup Representation -> Transformed to Dark Cyber UI */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[#0f1115] rounded-3xl border border-white/10 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 z-20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* Fake dashboard header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div className="h-5 w-32 bg-white/10 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                </div>
              </div>
              
              {/* Fake dashboard stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="h-3 w-16 bg-white/20 rounded-full mb-4" />
                  <div className="h-8 w-24 bg-gradient-to-r from-gray-500 to-gray-400 rounded-lg" />
                </div>
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                  <div className="h-3 w-16 bg-cyan-500/40 rounded-full mb-4" />
                  <div className="h-8 w-24 bg-cyan-400 rounded-lg" />
                </div>
              </div>

              {/* Fake chart/list */}
              <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0a0c10] border border-white/10 shadow-sm" />
                      <div className="flex flex-col gap-2">
                        <div className="h-2.5 w-24 bg-white/20 rounded-full" />
                        <div className="h-2 w-16 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-cyan-500/20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating decorative elements mimicking 3D objects */}
            <motion.div 
              className="hidden sm:flex absolute -right-6 top-24 w-20 h-20 sm:w-24 sm:h-24 bg-[#0f1115] border border-white/10 rounded-3xl z-30 items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
            >
              <div className="text-3xl sm:text-4xl drop-shadow-md brightness-150">🚀</div>
            </motion.div>
            
            <motion.div 
              className="hidden sm:flex absolute -left-8 bottom-32 w-16 h-16 sm:w-20 sm:h-20 bg-[#0f1115] border border-white/10 rounded-full z-30 items-center justify-center p-3 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-full h-full bg-cyan-500/20 rounded-full flex items-center justify-center shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              </div>
            </motion.div>

            <motion.div 
              className="absolute right-0 sm:right-12 -bottom-4 sm:-bottom-6 w-14 h-14 sm:w-16 sm:h-16 bg-[#0f1115] border border-white/10 rounded-2xl z-10 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              animate={{ y: [0, 10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
            >
              <div className="text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] brightness-150">💎</div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
