"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ParallaxHero() {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-background pt-32 pb-20">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-accent/5 opacity-50" />
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full" 
        />
      </div>

      <div className="container relative z-10 px-6 mx-auto w-full max-w-7xl flex flex-col items-center text-center">
        {/* Starting Price Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border-2 border-primary/20 shadow-xl shadow-primary/5 mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-secondary italic">MARKETPLACE_LIVE // STARTING AT ₹1,499</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-9xl font-black text-secondary italic tracking-tighter uppercase leading-[0.85] mb-10"
        >
          LAUNCH YOUR <br />
          <span className="text-primary relative">
            SaaS EMPIRE
            <div className="absolute -bottom-4 left-0 right-0 h-4 bg-secondary/5 -z-10 -skew-x-12" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-secondary/60 font-bold text-lg md:text-xl uppercase tracking-tight max-w-2xl mb-16 leading-tight"
        >
          Premium Code Templates & UI Kits for Elite Developers. 
          Stop rebuilding. <span className="text-secondary underline decoration-primary/40 decoration-4">Start shipping with the swarm.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 mb-24"
        >
          <button 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="h-20 px-12 bg-primary text-white font-black uppercase italic rounded-3xl border-4 border-secondary hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[10px_10px_0_rgba(26,26,46,1)] flex items-center justify-center gap-4 group"
          >
            Browse Products
            <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          </button>
          
          <Link 
            href="/demo"
            className="h-20 px-12 bg-white text-secondary font-black uppercase italic rounded-3xl border-4 border-secondary hover:bg-secondary/5 transition-all flex items-center justify-center gap-4"
          >
            View Demo
          </Link>
        </motion.div>

        {/* Product Preview Cards (3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { tag: "BEST SELLER", name: "Next.js SaaS Kit", price: "₹2,999", img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=400" },
            { tag: "NEW RELEASE", name: "AI Agent Boilerplate", price: "₹3,499", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400" },
            { tag: "TRENDING", name: "React UI Kit Pro", price: "₹1,999", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400" }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="bg-white p-5 rounded-[2.5rem] border-4 border-secondary/5 shadow-2xl shadow-secondary/5 group hover:border-primary/40 transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-8 left-8 z-20">
                <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full">{card.tag}</span>
              </div>
              <div className="aspect-video rounded-4xl overflow-hidden bg-secondary/5 mb-6 relative">
                 <Image 
                   src={card.img} 
                   alt={card.name} 
                   fill 
                   className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
                 />
                 <div className="absolute inset-0 bg-linear-to-t from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex justify-between items-end px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-accent mb-1 italic">V3_SYSTEM_VERIFIED</span>
                  <span className="font-black uppercase italic tracking-tighter text-secondary text-xl leading-none">{card.name}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-secondary/40 line-through">₹{(parseInt(card.price.replace('₹','').replace(',','')) * 1.3).toLocaleString('en-IN')}</span>
                   <span className="font-black text-primary text-2xl leading-none">{card.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
