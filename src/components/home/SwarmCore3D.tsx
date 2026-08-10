"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { Box, Cpu, ShieldCheck, Sparkles, Zap } from "lucide-react";

export function SwarmCore3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const rotateX = useSpring(pointer.y * -8, { stiffness: 90, damping: 18 });
  const rotateY = useSpring(pointer.x * 10, { stiffness: 90, damping: 18 });

  useEffect(() => {
    if (reduceMotion) return;
    const node = rootRef.current;
    if (!node) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      setPointer({ x, y });
    };

    const onLeave = () => setPointer({ x: 0, y: 0 });
    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto flex aspect-square w-full max-w-[620px] items-center justify-center [perspective:1400px]"
      aria-label="Interactive Digital Swarm architecture visualization"
    >
      <div className="absolute inset-[7%] rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute inset-[17%] rounded-full bg-accent/10 blur-[70px]" />

      <motion.div
        className="relative h-[78%] w-[78%] [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/25 shadow-[0_0_80px_rgba(224,191,117,0.08)] [transform:rotateX(72deg)]"
          animate={reduceMotion ? undefined : { rotateZ: 360 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-[10%] rounded-full border border-accent/20 [transform:rotateY(64deg)]"
          animate={reduceMotion ? undefined : { rotateZ: -360 }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-[22%] rounded-full border border-white/10 [transform:rotateX(58deg)_rotateY(22deg)]"
          animate={reduceMotion ? undefined : { rotateZ: 360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
        />

        <div className="absolute inset-[24%] [transform-style:preserve-3d]">
          <div className="absolute inset-0 rotate-45 rounded-[28%] border border-primary/35 bg-[linear-gradient(145deg,rgba(225,194,126,.18),rgba(255,255,255,.025)_45%,rgba(125,94,255,.08))] shadow-[0_30px_120px_rgba(0,0,0,.75)] backdrop-blur-xl [transform:translateZ(50px)]" />
          <div className="absolute inset-[10%] -rotate-12 rounded-[24%] border border-white/10 bg-black/45 [transform:translateZ(90px)]" />
          <motion.div
            className="absolute inset-[24%] flex items-center justify-center rounded-3xl border border-primary/50 bg-[#09090d]/90 shadow-[0_0_70px_rgba(224,191,117,.18)] [transform:translateZ(130px)]"
            animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-12 w-12 text-primary" strokeWidth={1.3} />
          </motion.div>
        </div>

        {[
          { Icon: Cpu, label: "AI", className: "left-0 top-[17%] [transform:translateZ(80px)]" },
          { Icon: ShieldCheck, label: "SECURE", className: "right-0 top-[28%] [transform:translateZ(100px)]" },
          { Icon: Zap, label: "FAST", className: "bottom-[10%] left-[16%] [transform:translateZ(90px)]" },
          { Icon: Box, label: "ASSETS", className: "bottom-[5%] right-[10%] [transform:translateZ(70px)]" },
        ].map(({ Icon, label, className }) => (
          <motion.div
            key={label}
            className={`absolute ${className} flex items-center gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl`}
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: label.length * 0.12 }}
          >
            <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-white/60">{label}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-x-[14%] bottom-[5%] h-16 rounded-[50%] bg-black/80 blur-2xl" />
    </div>
  );
}
