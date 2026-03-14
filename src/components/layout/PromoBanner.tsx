"use client";

import { useEffect, useState } from "react";
import { Clock, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner only on client to avoid hydration mismatch
    setTimeout(() => setIsVisible(true), 0);
    
    // Set an expiration time 4 hours from now
    // In a real app, this would come from a database or a secure daily reset
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 4);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 text-white overflow-hidden relative z-50"
        >
          <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm font-bold relative z-10">
            
            <div className="flex items-center gap-2">
              <span className="bg-black/20 p-1 rounded-full"><Tag className="w-4 h-4" /></span>
              <span className="uppercase tracking-wider">Flash Sale: 40% Off All AI Agents (GOD TIER)</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-base bg-black/20 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-white/70" />
              <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
              <span className="animate-pulse">:</span>
              <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
              <span className="animate-pulse">:</span>
              <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
            </div>

            <Link href="/products?category=AI+Agents">
              <button className="bg-white text-black px-4 py-1 rounded-full text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                Shop Now
              </button>
            </Link>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
