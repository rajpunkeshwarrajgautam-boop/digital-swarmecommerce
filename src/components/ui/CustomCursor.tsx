"use client";

import { useEffect, useRef } from "react";

/**
 * CustomCursor — Planet ONO style
 * A large trailing ring + small dot that follows the mouse with lerp easing.
 * Changes label on hover over interactive elements.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip touch devices

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
        dotRef.current.style.opacity = "1";
      }

      // Detect hover target
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [data-cursor]");
      const cursorLabel = isInteractive?.getAttribute?.("data-cursor");

      if (ringRef.current) {
        if (isInteractive) {
          ringRef.current.style.width = "80px";
          ringRef.current.style.height = "80px";
          ringRef.current.style.borderColor = "var(--primary)";
          ringRef.current.style.backgroundColor = "rgba(125,207,255,0.08)";
          ringRef.current.style.mixBlendMode = "normal";
        } else {
          ringRef.current.style.width = "40px";
          ringRef.current.style.height = "40px";
          ringRef.current.style.borderColor = "rgba(255,255,255,0.4)";
          ringRef.current.style.backgroundColor = "transparent";
          ringRef.current.style.mixBlendMode = "difference";
        }
      }

      if (labelRef.current) {
        labelRef.current.textContent = cursorLabel || "";
        labelRef.current.style.opacity = cursorLabel ? "1" : "0";
      }
    };

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      if (ringRef.current) {
        const w = parseInt(ringRef.current.style.width || "40");
        ringRef.current.style.transform = `translate(${ringX - w / 2}px, ${ringY - w / 2}px)`;
        ringRef.current.style.opacity = "1";
      }
      rafId = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full border-2 transition-[width,height,border-color,background-color] duration-200 flex items-center justify-center"
        style={{ width: 40, height: 40, opacity: 0, mixBlendMode: "difference" }}
      >
        <span
          ref={labelRef}
          className="text-[9px] font-black uppercase tracking-widest text-white opacity-0 transition-opacity duration-150 select-none"
        />
      </div>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] w-2 h-2 rounded-full bg-primary"
        style={{ opacity: 0 }}
      />
    </>
  );
}
