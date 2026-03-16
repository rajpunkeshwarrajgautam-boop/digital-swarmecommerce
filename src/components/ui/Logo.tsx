"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated Logo: "The Digital Core"
 * Replaced with custom Lottie animation from user.
 */
export function Logo({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className={cn("flex items-center gap-3 select-none group", className)}>
      {/* Symbol Container: Replaced with Lottie Animation */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {mounted && (
          /* @ts-expect-error - lottie-player is a web component */
          <lottie-player
            src="/logo-animation.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Text Branding - Hidden on mobile */}
      <div className="hidden sm:flex items-center">
        <span className="text-xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 group-hover:from-primary group-hover:to-accent transition-all duration-500 uppercase flex items-center gap-1.5">
            DIGITAL
            <span className="text-primary group-hover:text-accent transition-colors duration-500 inline-block scale-x-125 font-black">/</span>
            SWARM
        </span>
      </div>
    </div>
  );
}
