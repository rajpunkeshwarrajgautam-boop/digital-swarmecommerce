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
        className="relative w-full aspect-square rounded-3xl overflow-hidden bg-secondary border border-border group perspective-1000 cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleAssemble}
    >
      {/* 1. The Void Background */}
      <div className="absolute inset-0 bg-secondary z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mixed-blend-overlay z-1" />
      
      {/* 2. Interference Layer (Before Assembly) */}
      {!isAssembled && (
        <motion.div 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: isHovering ? 0.3 : 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center digital-noise pointer-events-none"
        >
             <div className="text-muted-foreground/50 font-mono text-sm tracking-widest uppercase border border-muted-foreground/30 px-4 py-2 rounded backdrop-blur-sm">
                Click to Materialize
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
                className="p-3 rounded-full bg-background/80 backdrop-blur-md border border-border hover:bg-primary/10 transition-colors shadow-lg"
            >
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </motion.button>
         )}
         <div className="p-3 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg">
            <Move3d className={cn(
                "w-5 h-5 transition-colors",
                isAssembled ? "text-primary" : "text-muted-foreground"
            )} />
         </div>
      </div>

    </div>
  );
}
