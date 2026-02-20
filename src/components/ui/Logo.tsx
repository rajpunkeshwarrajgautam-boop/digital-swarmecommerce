"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated Logo: "The Digital Core"
 * Combines "The Pulse" (orbiting/breathing core) and "The Swarm" (grid array/data points).
 * 
 * Concept:
 * A central singularity (Pulse) that is feeding energy into a surrounding matrix (Swarm).
 */
export function Logo({ className = "" }: { className?: string }) {
  
  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Symbol Container */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        
        {/* layer 1: The Swarm Grid (Background Field) */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] opacity-30 group-hover:opacity-60 transition-opacity duration-500">
             {[...Array(4)].map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        scale: [1, 0.8, 1],
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.5,
                        ease: "easeInOut" 
                    }}
                    className="rounded-sm bg-primary"
                />
             ))}
        </div>

        {/* Layer 2: The Core Pulse (Singularity) */}
        <motion.div 
            className="w-4 h-4 rounded-full bg-primary relative z-10 shadow-[0_0_15px_rgba(0,229,255,0.5)]"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
            <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping" />
        </motion.div>

        {/* Layer 3: The Orbiting Data Stream */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-primary/10 group-hover:border-primary/30 transition-colors"
        >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_currentColor]" />
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[2px] w-1 h-1 bg-primary/50 rounded-full" />
        </motion.div>

      </div>

      {/* Text Branding */}
      <div className="flex flex-col justify-center h-10">
        <span className="text-lg font-bold tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 group-hover:from-primary group-hover:to-accent transition-all duration-500 uppercase">
            DIGITAL
        </span>
        <span className="text-[9px] font-mono text-muted-foreground tracking-[0.15em] uppercase opacity-70 group-hover:opacity-100 group-hover:tracking-[0.25em] transition-all duration-500">
            SWARM
        </span>
      </div>
    </div>
  );
}
