"use client";

import { LogoPulse, LogoSwarm, LogoGlitch } from "@/components/logos/LogoVariants";
import { Logo } from "@/components/ui/Logo";

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-black text-white p-24 flex flex-col gap-24 items-center justify-center">
      <h1 className="text-4xl font-bold mb-12">LOGO VARIANT SHOWCASE</h1>
      
      {/* Variant 1: Pulse */}
      <div className="flex flex-col items-center gap-4 border border-zinc-800 p-8 rounded-2xl w-96 bg-zinc-900/50">
        <h2 className="text-muted-foreground text-sm uppercase tracking-widest">Variant 1: The Pulse</h2>
        <div className="p-8"><LogoPulse /></div>
      </div>

       {/* Variant 2: Swarm */}
       <div className="flex flex-col items-center gap-4 border border-zinc-800 p-8 rounded-2xl w-96 bg-zinc-900/50">
        <h2 className="text-muted-foreground text-sm uppercase tracking-widest">Variant 2: The Swarm</h2>
        <div className="p-8"><LogoSwarm /></div>
      </div>

       {/* Variant 3: Glitch */}
       <div className="flex flex-col items-center gap-4 border border-zinc-800 p-8 rounded-2xl w-96 bg-zinc-900/50">
        <h2 className="text-muted-foreground text-sm uppercase tracking-widest">Variant 3: The Glitch</h2>
        <div className="p-8"><LogoGlitch /></div>
      </div>

      {/* Variant 4: The Combined (Final) */}
      <div className="flex flex-col items-center gap-4 border border-primary/50 p-8 rounded-2xl w-96 bg-zinc-900/80 shadow-[0_0_50px_-10px_rgba(251,191,36,0.2)]">
        <h2 className="text-primary text-sm uppercase tracking-widest font-bold">The Chosen One (Combined)</h2>
        <div className="p-8"><Logo /></div>
      </div>

    </div>
  );
}
