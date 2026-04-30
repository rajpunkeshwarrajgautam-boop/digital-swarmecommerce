"use client";

import { motion } from "framer-motion";

/**
 * Optimized System Broadcast: 
 * Replaces the repetitive "boot sequence" ticker with a clean, high-performance brand fade-in.
 * Completes in 800ms as per UX optimization requirements.
 */
export function SystemBroadcast() {
  return (
    <div className="w-full bg-primary/10 border-b border-white/5 overflow-hidden py-1 relative group">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-primary/80"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-black italic">DIGITAL SWARM // SYSTEM_READY</span>
          <span className="hidden md:inline text-white/10">|</span>
          <span className="hidden md:inline text-white/30 tracking-widest">Neural_Uplink_Established</span>
        </motion.div>
      </div>

      {/* Sync Status Badge */}
      <div className="absolute top-0 right-4 h-full flex items-center gap-1.5 z-20 pointer-events-none">
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[8px] font-bold text-primary font-mono tracking-widest opacity-40">SYNC: LIVE</span>
      </div>
    </div>
  );
}
