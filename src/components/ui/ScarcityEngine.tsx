"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Users } from "lucide-react";

interface ScarcityEngineProps {
  productId: string;
}

type ScarcityDatum = {
  viewers: number;
  purchases: number;
  stockLevel: number;
  urgencyText: string;
  iconType: "flame" | "clock" | "users";
};

export function ScarcityEngine({ productId }: ScarcityEngineProps) {
  const scarcityData = useMemo<ScarcityDatum>(() => {
    const baseHash = productId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const scenarioIndex = baseHash % 3;
    const rawViewers = (baseHash % 14) + 2;
    const rawPurchases = ((baseHash * 2) % 8) + 1;
    const rawStock = ((baseHash * 3) % 7) + 2;

    const scenarios: ScarcityDatum[] = [
      {
        viewers: rawViewers,
        purchases: rawPurchases,
        stockLevel: rawStock,
        urgencyText: `${rawViewers} people are viewing this right now`,
        iconType: "users",
      },
      {
        viewers: rawViewers,
        purchases: rawPurchases,
        stockLevel: rawStock,
        urgencyText: `🔥 ${rawPurchases} purchased in the last 24 hours`,
        iconType: "flame",
      },
      {
        viewers: rawViewers,
        purchases: rawPurchases,
        stockLevel: rawStock,
        urgencyText: `Only ${rawStock} Neural licenses left in stock`,
        iconType: "clock",
      },
    ];

    return scenarios[scenarioIndex];
  }, [productId]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scarcityData.urgencyText}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        className={`flex items-center gap-2 mt-3 text-xs font-mono font-medium tracking-tight px-3 py-1.5 rounded-full w-fit ${
          scarcityData.iconType === "flame"
            ? "bg-red-500/10 text-red-400 border border-red-500/20"
            : scarcityData.iconType === "clock"
              ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        }`}
      >
        {scarcityData.iconType === "flame" && <Flame className="w-3.5 h-3.5" />}
        {scarcityData.iconType === "clock" && <Clock className="w-3.5 h-3.5 animate-pulse" />}
        {scarcityData.iconType === "users" && <Users className="w-3.5 h-3.5" />}
        <span>{scarcityData.urgencyText}</span>
      </motion.div>
    </AnimatePresence>
  );
}
