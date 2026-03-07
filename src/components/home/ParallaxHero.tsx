"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ParallaxHero() {
  const ref = useRef(null);

  return (
    <div ref={ref} className="w-full h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center">

      {/* Floating Trust Badges */}
      <motion.div
        animate={{ rotate: [0, 3, 0], y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[8%] bg-primary text-white rounded-2xl border-4 border-transparent px-4 py-3 shadow-xl z-10 hidden md:flex flex-col items-center gap-1"
      >
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-white text-white" />
          ))}
        </div>
        <span className="font-black text-xs leading-none">500+ Reviews</span>
      </motion.div>

      <motion.div
        animate={{ rotate: [0, -4, 0], y: [0, 16, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 right-[8%] bg-accent text-white rounded-2xl border-4 border-transparent px-4 py-3 shadow-xl z-10 hidden md:flex flex-col items-center gap-1"
      >
        <span className="font-black text-2xl leading-none">5 min</span>
        <span className="font-bold text-xs leading-none text-center">Setup Guide<br/>Included</span>
      </motion.div>

      {/* Main Typography */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm md:text-base font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4"
        >
          Premium Digital Products for Developers &amp; Creators
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[10vw] md:text-[7vw] leading-[0.85] font-titan text-foreground drop-shadow-md"
        >
          Launch Your<br/>Next Project<br/>
          <span className="text-gradient">Today</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mt-6 leading-relaxed"
        >
          Source code, UI kits &amp; digital templates trusted by <strong className="text-foreground">2,000+ indie developers</strong> — skip months of work and ship faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link href="/products">
            <Button variant="cyberpunk" size="lg" className="h-16 px-10 group">
              View Catalog
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
          <Link href="/about">
            <button className="flex items-center gap-2 bg-transparent text-foreground font-bold text-lg px-8 py-4 rounded-full border-4 border-border hover:border-foreground transition-all duration-200">
              Our Story
            </button>
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground flex-wrap"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Instant Download
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            Secure SSL Checkout
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            30-Day Guarantee
          </span>
        </motion.div>
      </div>

      {/* Decorative dot-grid */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[20px_20px]" />
    </div>
  );
}
