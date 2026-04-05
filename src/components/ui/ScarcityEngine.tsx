"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Users, ShieldAlert } from "lucide-react";

interface ScarcityEngineProps {
  productId: string;
}

export function ScarcityEngine({ productId }: ScarcityEngineProps) {
  const [scarcityData, setScarcityData] = useState<{
    viewers: number;
    purchases: number;
    stockLevel: number;
    urgencyText: string;
    iconType: 'flame' | 'clock' | 'users';
  } | null>(null);

  useEffect(() => {
    // Generate deterministic but pseudo-random numbers based on productId length/chars
    // This allows it to stay consistent across renders on the same product page, while looking dynamic
    const baseHash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // We add Date.now() / 3600000 (hours) so it changes every hour organically
    const hourDelta = Math.floor(Date.now() / (1000 * 60 * 60));
    
    const rawViewers = ((baseHash + hourDelta) % 14) + 2; // 2 to 15 viewers
    const rawPurchases = ((baseHash * 2 + hourDelta) % 8) + 1; // 1 to 8 purchases
    const rawStock = ((baseHash * 3 - hourDelta) % 7) + 2; // 2 to 8 left in stock

    const scenarios = [
      {
        viewers: rawViewers,
        purchases: rawPurchases,
        stockLevel: rawStock,
        urgencyText: `${rawViewers} people are viewing this right now`,
        iconType: 'users' as const
      },
      {
        viewers: rawViewers,
        purchases: rawPurchases,
        stockLevel: rawStock,
        urgencyText: `🔥 ${rawPurchases} purchased in the last 24 hours`,
        iconType: 'flame' as const
      },
      {
        viewers: rawViewers,
        purchases: rawPurchases,
        stockLevel: rawStock,
        urgencyText: `Only ${rawStock} Neural licenses left in stock`,
        iconType: 'clock' as const
      }
    ];

    // Pick a random scenario based on the minute to keep it fresh
    const minute = new Date().getMinutes();
    const scenarioIndex = minute % 3;
    
    setScarcityData(scenarios[scenarioIndex]);
  }, [productId]);

  if (!scarcityData) return <div className="h-6" />; // prevent layout shift

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scarcityData.urgencyText}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`flex items-center gap-2 mt-3 text-xs font-mono font-medium tracking-tight px-3 py-1.5 rounded-full w-fit ${
          scarcityData.iconType === 'flame' 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
            : scarcityData.iconType === 'clock'
            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}
      >
        {scarcityData.iconType === 'flame' && <Flame className="w-3.5 h-3.5" />}
        {scarcityData.iconType === 'clock' && <Clock className="w-3.5 h-3.5 animate-pulse" />}
        {scarcityData.iconType === 'users' && <Users className="w-3.5 h-3.5" />}
        <span>{scarcityData.urgencyText}</span>
      </motion.div>
    </AnimatePresence>
  );
}
