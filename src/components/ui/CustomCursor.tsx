"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY, isVisible]);

  if (typeof window === "undefined") return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: springX,
        y: springY,
        pointerEvents: "none",
        zIndex: 10000,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="hidden md:block"
    >
      <div className="relative flex items-center justify-center">
        {/* Main Dot */}
        <div className="w-1.5 h-1.5 bg-primary rounded-none shadow-[0_0_10px_#ccff00]" />
        
        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-12 h-12 border border-primary/30 rounded-none rotate-45"
        />
        
        {/* Technical crosshairs */}
        <div className="absolute w-20 h-[1px] bg-primary/10" />
        <div className="absolute h-20 w-[1px] bg-primary/10" />
      </div>
    </motion.div>
  );
}
