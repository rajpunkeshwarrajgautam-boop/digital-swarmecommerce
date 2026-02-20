"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [particles, setParticles] = React.useState<{top: string, left: string, duration: string, delay: string}[]>([]);

  React.useEffect(() => {
    const newParticles = [...Array(20)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 2}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full z-0 overflow-hidden bg-neutral-950 flex flex-col items-center justify-center antialiased",
        className
      )}
    >
      <div className="absolute h-full w-full bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute inset-0 bg-transparent opacity-50 h-full w-full pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/10 to-transparent h-px w-3/4 blur-sm top-1/2 left-1/4 animate-beam-slide" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-500/10 to-transparent h-px w-3/4 blur-sm top-1/3 right-1/4 animate-beam-slide-reverse delay-1000" />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-sky-500/10 to-transparent h-px w-1/2 blur-sm bottom-1/4 left-1/3 animate-beam-slide delay-2000" />
        
        {/* Animated Particles/Nodes */}
        {particles.map((p, i) => (
            <div 
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-40"
                 style={{
                    top: p.top,
                    left: p.left,
                    animationDuration: p.duration,
                    animationDelay: p.delay
                 }}
            />
        ))}
      </div>
    </div>
  );
};
