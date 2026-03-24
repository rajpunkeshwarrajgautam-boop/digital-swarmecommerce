"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="bg-primary py-3 px-6 text-white overflow-hidden relative group">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 relative z-10">
        <div className="flex items-center gap-3">
          <span className="bg-secondary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">Special Offer</span>
          <span className="font-black uppercase italic tracking-tighter text-sm md:text-base">Launch Week Special - 30% OFF all products</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 italic">Offer ends in</span>
          <div className="flex items-center gap-1 font-black text-lg md:text-xl font-mono italic">
            <span>{format(timeLeft.days)}</span>:
            <span>{format(timeLeft.hours)}</span>:
            <span>{format(timeLeft.minutes)}</span>:
            <span>{format(timeLeft.seconds)}</span>
          </div>
        </div>

        <button className="bg-white text-primary font-black uppercase italic px-6 py-2 rounded-xl text-sm hover:scale-105 transition-transform shadow-lg">
          Claim Discount
        </button>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
      </div>
    </div>
  );
}
