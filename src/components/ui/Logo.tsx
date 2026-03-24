"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated Logo: "The Digital Core"
 * Replaced with custom Lottie animation from user.
 * Standardized to 40px height / 120px width as per diagnostic report.
 */
export function Logo({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);
  
  return (
    <div className={cn("flex items-center gap-3 select-none group h-[40px] w-auto lg:w-[120px]", className)}>
      <span className="sr-only">Digital Swarm - Code Templates & UI Kits</span>
      {/* Symbol Container: Replaced with Lottie Animation */}
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
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
      <div className="flex items-center">
        <span className="text-xl font-black italic tracking-tighter leading-none text-secondary transition-all duration-300 uppercase flex items-center gap-1.5">
            DIGITAL
            <span className="text-primary font-black not-italic">/</span>
            SWARM
        </span>
      </div>
    </div>
  );
}

