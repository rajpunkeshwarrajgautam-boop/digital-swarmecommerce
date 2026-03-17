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
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
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
        <span className="text-2xl font-black italic tracking-tighter leading-none text-white transition-all duration-300 uppercase flex items-center gap-2">
            DIGITAL
            <span className="text-primary font-black not-italic">/</span>
            SWARM
        </span>
      </div>
    </div>
  );
}
