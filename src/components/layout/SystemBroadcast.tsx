"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Zap, Activity } from "lucide-react";

const MESSAGES = [
  "INITIALIZING ARMORED PRODUCTION SYNC...",
  "ESTABLISHING ELITE LEGAL PROTOCOL NODE...",
  "QUANTUM SECURITY HANDSHAKE: SUCCESS",
  "SECTOR HUB REGISTRY REFRESHED: 14+ ASSETS DETECTED",
  "AI CONCIERGE INTEGRITY: 100%",
  "DEEP BLACK PROTOCOL ENFORCED",
  "INDUSTRIAL GREEN SPECTRUM OPTIMIZED",
  "FORGE POWER BANK: ON-LINE",
  "SENTINEL RESEARCH INFILTRATOR: MONITORING",
  "SWARM SALES INFILTRATOR: NEOTIC REVENUE SYNC...",
  "READY FOR PROTOCOL EXECUTION."
];

export function SystemBroadcast() {
  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 overflow-hidden py-1.5 relative group">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-black/80 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-black/80 to-transparent z-10" />
      
      <motion.div 
        animate={{ x: [0, -2000] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex items-center gap-12 whitespace-nowrap px-8"
      >
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-primary/80 uppercase">
            {i % 4 === 0 && <Shield className="w-3 h-3" />}
            {i % 4 === 1 && <Zap className="w-3 h-3" />}
            {i % 4 === 2 && <Terminal className="w-3 h-3" />}
            {i % 4 === 3 && <Activity className="w-3 h-3" />}
            <span>{msg}</span>
          </div>
        ))}
      </motion.div>

      <div className="absolute top-0 right-4 h-full flex items-center gap-1.5 z-20">
        <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[8px] font-bold text-primary font-mono tracking-widest opacity-50">SYNC: LIVE</span>
      </div>
    </div>
  );
}
