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
      className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-[#eff3ff] via-[#ffffff] to-[#fff0f5]"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/80 shadow-sm w-fit glass">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-700 tracking-wide">v2.0 Now Available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-[#111827] leading-[1.1] tracking-tight uppercase max-w-full">
            Launch Your <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 inline-block w-full truncate sm:whitespace-normal">
              SaaS Effortlessly
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
            Create a beautiful storefront, manage orders, and start selling globally — all from one simple dashboard powered by autonomous AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Link href="/products" className="w-full sm:w-auto block">
              <button className="w-full sm:w-auto clay-btn text-base gap-2 group">
                Browse Agents
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/freebies" className="w-full sm:w-auto block">
              <button className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-gray-700 font-bold border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Free Tools
              </button>
            </Link>
          </div>
          
          <div className="flex items-center gap-6 mt-6 text-sm text-gray-500 font-semibold">
            <span className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs">✓</span> 
              No coding required
            </span>
            <span className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs">✓</span> 
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
            {/* Soft UI Dashboard Mockup Representation */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-white rounded-3xl clay-card p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 z-20">
              {/* Fake dashboard header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f26496] to-pink-400 flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div className="h-5 w-32 bg-gray-100 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
                  <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
                </div>
              </div>
              
              {/* Fake dashboard stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="h-3 w-16 bg-gray-200 rounded-full mb-4" />
                  <div className="h-8 w-24 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg" />
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100">
                  <div className="h-3 w-16 bg-blue-200 rounded-full mb-4" />
                  <div className="h-8 w-24 bg-[#8b5cf6] rounded-lg" />
                </div>
              </div>

              {/* Fake chart/list */}
              <div className="flex-1 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex flex-col gap-4">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm" />
                      <div className="flex flex-col gap-2">
                        <div className="h-2.5 w-24 bg-gray-200 rounded-full" />
                        <div className="h-2 w-16 bg-gray-100 rounded-full" />
                      </div>
                    </div>
                    <div className="h-4 w-12 bg-green-100 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating decorative elements mimicking 3D objects */}
            <motion.div 
              className="hidden sm:flex absolute -right-6 top-24 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl clay-card z-30 items-center justify-center"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
            >
              <div className="text-3xl sm:text-4xl drop-shadow-md">🚀</div>
            </motion.div>
            
            <motion.div 
              className="hidden sm:flex absolute -left-8 bottom-32 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full clay-card z-30 items-center justify-center p-3 sm:p-4"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-full h-full bg-pink-100 rounded-full flex items-center justify-center shadow-inner">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#f26496] rounded-full shadow-md" />
              </div>
            </motion.div>

            <motion.div 
              className="absolute right-0 sm:right-12 -bottom-4 sm:-bottom-6 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl clay-card z-10 flex items-center justify-center"
              animate={{ y: [0, 10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
            >
              <div className="text-xl sm:text-2xl drop-shadow-md">💎</div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
