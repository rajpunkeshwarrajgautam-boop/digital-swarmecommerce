"use client";

import { motion } from "framer-motion";

export function LogoPulse() {
  return (
    <div className="flex items-center gap-3">
        {/* Symbol */}
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-primary/50"
            />
            {/* Inner Core */}
            <motion.div 
                animate={{ scale: [0.8, 1, 0.8], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            />
             {/* Orbiting Dot */}
             <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
             >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 bg-white rounded-full" />
             </motion.div>
        </div>
        {/* Text */}
        <div className="font-bold tracking-tight text-xl">
            DIGITAL<span className="text-primary">PULSE</span>
        </div>
    </div>
  );
}

export function LogoSwarm() {
    return (
      <div className="flex items-center gap-3">
          {/* Symbol */}
          <div className="relative w-10 h-10 grid grid-cols-3 gap-1 p-1">
             {[...Array(9)].map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ 
                        scale: [1, 0.5, 1],
                        opacity: [1, 0.3, 1],
                        backgroundColor: ["#fbbf24", "#ffffff", "#fbbf24"]
                    }}
                    transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: i * 0.1,
                        ease: "easeInOut" 
                    }}
                    className="rounded-full bg-primary"
                />
             ))}
          </div>
          {/* Text */}
          <div className="font-bold tracking-wider text-xl uppercase">
              The<span className="text-primary mx-1">Swarm</span>
          </div>
      </div>
    );
  }

  export function LogoGlitch() {
    return (
      <div className="flex items-center gap-3">
          {/* Symbol */}
          <div className="relative w-10 h-10 bg-black flex items-center justify-center overflow-hidden border border-primary/30">
             <motion.div
                animate={{ x: [-2, 2, -2], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-x-0 top-[20%] h-[2px] bg-primary/80"
             />
             <motion.div
                animate={{ x: [2, -2, 2], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror", delay: 0.1 }}
                className="absolute inset-x-0 bottom-[30%] h-px bg-red-500/80 mixed-blend-screen"
             />
             <div className="text-2xl font-black text-white relative z-10">A</div>
          </div>
          {/* Text */}
          <div className="font-mono font-bold text-xl relative">
              <span className="relative z-10">ANTIGRAVITY</span>
              <motion.span 
                animate={{ x: [-1, 1, -1], opacity: [0.5, 0] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 text-red-500 mix-blend-screen z-0"
              >
                  ANTIGRAVITY
              </motion.span>
              <motion.span 
                animate={{ x: [1, -1, 1], opacity: [0.5, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 text-cyan-500 mix-blend-screen z-0"
              >
                  ANTIGRAVITY
              </motion.span>
          </div>
      </div>
    );
  }
