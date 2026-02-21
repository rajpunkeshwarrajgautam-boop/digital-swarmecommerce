"use client";

import { motion } from "framer-motion";
import { Zap, Flame, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface ScarcityEngineProps {
  stockCount?: number;
  expiresInHours?: number;
}

export function ScarcityEngine({ stockCount, expiresInHours }: ScarcityEngineProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiresInHours) return;

    const endTime = Date.now() + expiresInHours * 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [expiresInHours]);

  return (
    <div className="space-y-3 mb-6">
      {stockCount && stockCount > 0 && stockCount <= 15 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-bold"
        >
          <Flame className="w-4 h-4 animate-pulse" />
          <span>URGENT: ONLY {stockCount} LICENSES REMAINING AT THIS PRICE!</span>
        </motion.div>
      )}

      {expiresInHours && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-lg text-sm font-bold"
        >
          <Clock className="w-4 h-4" />
          <span>OFFER ENDS IN: <span className="font-mono">{timeLeft}</span></span>
        </motion.div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <Zap className="w-3 h-3 text-primary" />
        <span>Digital items are delivered instantly upon purchase.</span>
      </div>
    </div>
  );
}
