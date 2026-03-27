"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";
import { ArrowLeft, ArrowRight, Bookmark, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ForgeButton } from "@/components/ui/ForgeButton";

// We take only featured products for this section
const featuredProducts = products.slice(0, 6);

export function FeaturedShowcase() {
  const [order, setOrder] = useState(featuredProducts.map((_, i) => i));
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeIndex = order[0];
  const activeProduct = featuredProducts[activeIndex];

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOrder((prev) => {
      const newOrder = [...prev];
      const first = newOrder.shift()!;
      newOrder.push(first);
      return newOrder;
    });
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setOrder((prev) => {
      const newOrder = [...prev];
      const last = newOrder.pop()!;
      newOrder.unshift(last);
      return newOrder;
    });
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  // Auto-play progress effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 0.5;
        });
      }
    }, 50);
    return () => clearInterval(timer);
  }, [isAnimating, handleNext]);

  return (
    <section className="relative w-full h-[800px] bg-[#0a0a0f] overflow-hidden group/showcase font-mono">
      {/* Background Layer: Active Product Image */}
      <AnimatePresence mode="popLayout">
        <motion.div
           key={activeProduct.id}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
           className="absolute inset-0"
        >
          <Image
             src={activeProduct.image}
             alt={activeProduct.name}
             fill
             className="object-cover grayscale brightness-[0.2]"
             priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0f] via-transparent to-transparent opacity-40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="container mx-auto px-6 h-full relative z-20 flex items-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
               key={activeProduct.id}
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: 100, opacity: 0 }}
               transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
               className="space-y-10"
            >
              <div className="flex items-center gap-6">
                <div className="h-px w-16 bg-primary" />
                <span className="text-primary font-black uppercase tracking-[0.5em] text-[10px] italic">
                   FEATURED_MODULE // 0{activeIndex + 1}
                </span>
              </div>

              <h2 className="text-8xl md:text-9xl font-black italic tracking-tighter leading-[0.8] text-white uppercase font-outfit">
                {activeProduct.name.split(' ').map((word, i) => (
                  <span key={i} className="block last:text-white/10">
                    {word}
                  </span>
                ))}
              </h2>

              <p className="text-white/40 text-xs font-mono uppercase tracking-widest leading-loose max-w-lg italic">
                {activeProduct.description}
              </p>

              <div className="flex items-center gap-8 pt-6">
                 <Link href={`/product/${activeProduct.id}`}>
                   <ForgeButton className="px-14 py-8 text-2xl group/btn transform hover:scale-105 transition-transform duration-500">
                      INITIALIZE_UPLINK <MoveRight className="ml-4 w-6 h-6 group-hover/btn:translate-x-3 transition-transform" />
                   </ForgeButton>
                 </Link>
                 <button className="w-16 h-16 border border-white/5 bg-white/2 flex items-center justify-center hover:bg-white/5 hover:border-primary/40 transition-all group/mark relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                    <Bookmark className="w-6 h-6 text-white/20 group-hover:text-primary transition-colors relative z-10" />
                 </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Slider: Cards with industrial clip-paths */}
        <div className="absolute bottom-24 right-0 left-0 lg:left-auto lg:right-6 lg:w-[600px] h-[280px] flex gap-8 px-6 lg:px-0">
          <AnimatePresence>
            {order.slice(1, 4).map((idx, i) => (
              <motion.div
                key={featuredProducts[idx].id}
                layoutId={featuredProducts[idx].id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative flex-1 border border-white/5 bg-white/2 group/card cursor-pointer overflow-hidden"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
                onClick={() => {
                   if (i === 0) handleNext();
                }}
              >
                <Image
                  src={featuredProducts[idx].image}
                  alt={featuredProducts[idx].name}
                  fill
                  className="object-cover grayscale transition-all duration-700 group-hover/card:grayscale-0 group-hover/card:scale-110 brightness-50 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <p className="text-[9px] font-mono font-black italic text-primary uppercase mb-2 tracking-[0.3em]">{featuredProducts[idx].category}</p>
                  <h4 className="text-sm font-outfit font-black text-white uppercase leading-none tracking-tighter truncate">{featuredProducts[idx].name}</h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination & Global Progress */}
        <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-10">
             <div className="flex gap-4">
                <button 
                  onClick={handlePrev} 
                  className="w-14 h-14 border border-white/5 bg-white/2 flex items-center justify-center hover:bg-white/5 hover:border-primary/40 transition-all group"
                >
                  <ArrowLeft className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                </button>
                <button 
                  onClick={handleNext} 
                  className="w-14 h-14 border border-white/5 bg-white/2 flex items-center justify-center hover:bg-white/5 hover:border-primary/40 transition-all group"
                >
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                </button>
             </div>
             
             {/* Dynamic Progress Bar */}
             <div className="hidden md:flex items-center gap-6 w-[350px]">
                <span className="text-[10px] font-mono font-black text-white/10 italic">01</span>
                <div className="flex-1 h-px bg-white/5 relative overflow-hidden">
                   <motion.div 
                     className="absolute top-0 left-0 h-full bg-primary"
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 0.1 }}
                   />
                </div>
                <span className="text-[10px] font-mono font-black text-white/10 italic">0{featuredProducts.length}</span>
             </div>
          </div>

          <div className="flex items-center gap-6 overflow-hidden h-16">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="text-6xl font-black italic text-primary font-outfit tracking-tighter"
              >
                0{activeIndex + 1}
              </motion.span>
            </AnimatePresence>
            <div className="w-px h-10 bg-white/10" />
            <span className="text-xl font-black text-white/5 font-outfit">/ 0{featuredProducts.length}</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-black opacity-[0.01] pointer-events-none select-none italic uppercase tracking-tighter font-outfit">
        FORGE
      </div>
    </section>
  );
}
