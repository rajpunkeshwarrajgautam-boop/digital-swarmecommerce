"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

/** Deterministic “asset id” so SSR and client match (avoids React #418 from Math.random). */
function stableAssetId(name: string, image: string): string {
  const s = `${name}|${image}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const n = h >>> 0;
  return n.toString(36).toUpperCase().slice(0, 7).padEnd(7, "0");
}

interface HolographicBoxProps {
  image: string;
  name: string;
}

export function HolographicBox({ image, name }: HolographicBoxProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const [isHovered, setIsHovered] = useState(false);
  const assetId = useMemo(() => stableAssetId(name, image), [name, image]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="relative w-full aspect-square flex items-center justify-center py-12 overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1500px" }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[70%] h-[85%] transition-shadow duration-500"
      >
        {/* The Box */}
        
        {/* Front Face */}
        <div 
          style={{ transform: "translateZ(60px)" }}
          className="absolute inset-0 bg-zinc-900 border-2 border-primary/40 rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent pointer-events-none z-10" />
          <Image src={image} alt={name} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover opacity-90" unoptimized={image.endsWith(".svg")} />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black via-black/80 to-transparent z-20">
            <h4 className="text-[10px] font-titan text-primary tracking-widest uppercase line-clamp-2">{name}</h4>
            <div className="w-full h-1 bg-primary/20 rounded-full mt-2 overflow-hidden">
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-primary/60 w-1/3"
                />
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          style={{ transform: "translateZ(-60px) rotateY(180deg)" }}
          className="absolute inset-0 bg-zinc-950 border-2 border-white/10 rounded-3xl flex items-center justify-center p-8"
        >
             <Image src={image} alt={name} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover opacity-10 grayscale blur-sm" unoptimized={image.endsWith(".svg")} />
             <div className="z-10 text-center opacity-20">
                <p className="text-[8px] font-mono leading-relaxed">PROPERTY OF DIGITAL SWARM<br/>ENCRYPTED ASSET<br/>ID: {assetId}</p>
             </div>
        </div>

        {/* Right Face */}
        <div 
          style={{ 
            width: "120px",
            height: "100%",
            left: "100%",
            transform: "translateX(-50%) rotateY(90deg)" 
          }}
          className="absolute top-0 bg-zinc-950 border-y-2 border-r-2 border-white/10 rounded-r-3xl"
        >
          <div className="h-full w-full flex items-center justify-center rotate-90 whitespace-nowrap overflow-hidden">
            <span className="text-[10px] font-mono text-white/10 uppercase tracking-[1em] animate-pulse">DEPLOYMENT PROTOCOL</span>
          </div>
        </div>

        {/* Left Face */}
        <div 
          style={{ 
            width: "120px",
            height: "100%",
            right: "100%",
            transform: "translateX(50%) rotateY(-90deg)" 
          }}
          className="absolute top-0 bg-zinc-950 border-y-2 border-l-2 border-white/10 rounded-l-3xl"
        />

        {/* Top Face */}
        <div 
          style={{ 
            width: "100%",
            height: "120px",
            bottom: "100%",
            transform: "translateY(50%) rotateX(90deg)" 
          }}
          className="absolute left-0 bg-zinc-900 border-x-2 border-t-2 border-white/10 rounded-t-3xl"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,245,220,0.1),transparent)]" />
        </div>

        {/* Bottom Face */}
        <div 
          style={{ 
            width: "100%",
            height: "120px",
            top: "100%",
            transform: "translateY(-50%) rotateX(-90deg)" 
          }}
          className="absolute left-0 bg-zinc-900 border-x-2 border-b-2 border-white/10 rounded-b-3xl shadow-[0_40px_100px_rgba(0,0,0,1)]"
        />

        {/* Iridescent Layer */}
        <motion.div
            className="absolute inset-0 pointer-events-none z-30 opacity-20 rounded-3xl"
            style={{
                background: "linear-gradient(135deg, #ff00ff22, #00ffff22, #ffff0022)",
                transform: "translateZ(61px)",
                mixBlendMode: "screen",
            }}
            animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
                opacity: isHovered ? 0.3 : 0.1,
            }}
            transition={{
                backgroundPosition: { duration: 5, repeat: Infinity, repeatType: "mirror" },
                opacity: { duration: 0.3 }
            }}
        />
      </motion.div>
      
      {/* Floor Shadow */}
      <div 
        className="absolute bottom-4 w-48 h-12 bg-black/60 blur-2xl rounded-full"
        style={{ transform: "rotateX(70deg)" }}
      />
    </div>
  );
}
