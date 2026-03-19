"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useState, useRef } from "react";
import { Move3d, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { HolographicBox } from "./HolographicBox";

interface QuantumProductViewProps {
  image: string;
  name: string;
}

export function QuantumProductView({ image, name }: QuantumProductViewProps) {
  const [isAssembled, setIsAssembled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAssemble = async () => {
    if (isAssembled) return;
    
    // Trigger vibration if available
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    // Play unboxing animation sequence
    await controls.start("assembling");
    setIsAssembled(true);
    controls.start("assembled");
  };

  const resetAssembly = () => {
    setIsAssembled(false);
    controls.start("initial");
  };

  return (
    <div 
        ref={containerRef}
        className="relative w-full aspect-square border-4 border-black overflow-hidden bg-[#ffc737] shadow-[12px_12px_0px_rgba(0,0,0,1)] group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleAssemble}
    >
      {/* 1. The Void Background */}
      <div className="absolute inset-0 bg-[#ffc737] z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mixed-blend-overlay z-1" />
      
      {/* 2. Interference Layer (Before Assembly) */}
      {!isAssembled && (
        <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isHovering ? 0.3 : 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center digital-noise pointer-events-none"
        >
             <div className="bg-red-500 text-white font-black text-sm tracking-widest uppercase border-4 border-black px-6 py-3 shadow-[4px_4px_0px_#000] rotate-[-5deg]">
                Initialize Materialization
             </div>
        </motion.div>
      )}

      {/* 3. The Product (The Object) */}
      <motion.div
        initial="initial"
        animate={controls}
        variants={{
            initial: { 
                scale: 0.8, 
                opacity: 0.4, 
                filter: "blur(10px) grayscale(100%)",
                rotateX: 10,
                rotateY: 10,
            },
            assembling: {
                scale: [0.8, 1.1, 1],
                opacity: [0.4, 1],
                filter: ["blur(10px) grayscale(100%)", "blur(0px) grayscale(0%)"],
                rotateX: [10, -5, 0],
                rotateY: [10, -5, 0],
                transition: { duration: 0.8, ease: "circOut" }
            },
            assembled: {
                scale: 1,
                opacity: 1,
                filter: "blur(0px) grayscale(0%)",
                rotateX: 0,
                rotateY: 0,
                transition: { type: "spring", stiffness: 100 }
            }
        }}
        className="w-full h-full relative z-10 flex items-center justify-center"
      >
        {isAssembled ? (
          <HolographicBox image={image} name={name} />
        ) : (
          <Image 
              src={image} 
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                  "object-cover transition-transform duration-700",
                  isHovering && "scale-105"
              )}
              priority
          />
        )}
        
        {/* Holographic Overlay Effect */}
        <div className={cn(
            "absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-blue-500/20 mixed-blend-overlay transition-opacity duration-1000",
            isAssembled ? "opacity-30" : "opacity-0"
        )} />
      </motion.div>

      {/* 4. UI Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex gap-2">
         {isAssembled && (
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => { e.stopPropagation(); resetAssembly(); }}
                className="p-4 bg-black border-2 border-white/20 hover:border-primary transition-colors shadow-[4px_4px_0px_#000]"
            >
                <RotateCcw className="w-6 h-6 text-white" />
            </motion.button>
         )}
         <div className="p-4 bg-black border-2 border-white/20 transition-colors shadow-[4px_4px_0px_#000]">
            <Move3d className={cn(
                "w-6 h-6",
                isAssembled ? "text-primary" : "text-white/50"
            )} />
         </div>
      </div>

    </div>
  );
}
