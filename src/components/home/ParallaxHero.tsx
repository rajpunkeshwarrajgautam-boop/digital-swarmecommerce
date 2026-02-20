"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ParallaxHero() {
  const ref = useRef(null);
  
  return (
    <div ref={ref} className="w-full h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center">
        {/* Floating Stickers */}
        <motion.div 
            animate={{ rotate: [0, 10, 0], y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-32 h-32 bg-primary rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 hidden md:flex"
        >
            <span className="font-titan text-xl rotate-[-10deg]">New!</span>
        </motion.div>

        <motion.div 
            animate={{ rotate: [0, -5, 0], y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 right-[10%] w-40 h-40 bg-accent text-white rounded-lg border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-10 hidden md:flex"
        >
             <span className="font-titan text-2xl rotate-[5deg] text-center leading-none">Best<br/>Seller</span>
        </motion.div>

        {/* Main Typography */}
        <div className="relative z-20 text-center px-4">
            <h1 className="text-[12vw] leading-[0.8] font-titan text-black drop-shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                DIGITAL<br/>SWARM
            </h1>
            <h2 className="text-2xl md:text-4xl font-fredoka mt-8 bg-black text-white px-6 py-2 inline-block -rotate-2 transform">
                The Future of Digital Commerce
            </h2>
            
            <div className="mt-12 flex justify-center gap-6">
                <Link href="/products">
                    <button className="btn-primary">
                        Shop Collection
                    </button>
                </Link>
            </div>
        </div>
        
        {/* Decorative Lines/Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
}
