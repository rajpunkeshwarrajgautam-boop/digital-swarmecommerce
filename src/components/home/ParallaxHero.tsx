"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ParallaxHero() {
  const ref = useRef(null);

  return (
    <div ref={ref} className="w-full min-h-[90vh] py-20 relative overflow-hidden bg-background flex flex-col items-center justify-center">

      {/* Floating Trust Badges - Integrated Better */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-[10%] bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-3 shadow-2xl z-10 hidden xl:flex flex-col items-center gap-1"
      >
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-primary text-primary" />
          ))}
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter">Trusted by 2k+ Devs</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-24 right-[10%] bg-primary/10 backdrop-blur-md rounded-2xl border border-primary/20 px-5 py-3 shadow-2xl z-10 hidden xl:flex flex-col items-center gap-1"
      >
        <span className="font-black text-xl text-primary leading-none italic">5 MIN</span>
        <span className="font-bold text-[10px] uppercase tracking-tight text-center">Setup Guide</span>
      </motion.div>

      {/* Main Typography */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="px-4 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-bold uppercase tracking-[0.3em] text-primary mb-8"
        >
          New Era of Development
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[1.1] sm:leading-[0.9] italic uppercase"
        >
          Build Faster.<br/>
          <span className="text-gradient">Ship Smarter.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-8 leading-relaxed font-medium"
        >
          Premium production-ready source code, UI kits &amp; AI templates. 
          Stop wasting weeks on boilerplate — <span className="text-foreground border-b-2 border-primary/30">download, configure, and launch today.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row justify-center gap-5 w-full max-w-md sm:max-w-none"
        >
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="cyberpunk" size="lg" className="w-full h-16 px-12 group shadow-2xl shadow-primary/20">
              Explore The Catalog
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
          <Link href="/about" className="w-full sm:w-auto">
            <button className="w-full flex items-center justify-center gap-2 bg-white/5 text-foreground font-bold text-lg h-16 px-10 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300">
              How It Works
            </button>
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-border/30 flex items-center justify-center gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex-wrap"
        >
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Instant Download
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            Safe SSL Checkout
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            30-Day Support
          </span>
        </motion.div>
      </div>

      {/* Decorative dot-grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
    </div>
  );
}
