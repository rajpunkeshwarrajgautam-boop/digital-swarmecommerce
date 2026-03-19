"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

/**
 * ParallaxHero — Planet ONO inspired
 *
 * Visual signature:
 * - Vivid yellow-to-black color scheme with section color blocking
 * - Thick black outlined display text (pop-art sticker style)
 * - Floating decorative shapes with parallax depth
 * - Scale-pop entrance animations
 * - Comic speech bubble tag
 * - Scattered star/sparkle decorations
 */
export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -240]);

  const floatVariants = {
    animate: {
      y: [0, -18, 0],
      rotate: [0, 3, -3, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen relative overflow-hidden bg-[#ffc737]"
      style={{ cursor: "none" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Floating sparkle stars — Planet ONO signature decoration */}
      {[
        { top: "12%", left: "8%", right: undefined, bottom: undefined, size: 28, delay: 0 },
        { top: "22%", left: undefined, right: "6%", bottom: undefined, size: 20, delay: 0.5 },
        { top: undefined, left: "5%", right: undefined, bottom: "30%", size: 16, delay: 1 },
        { top: "60%", left: undefined, right: "12%", bottom: undefined, size: 24, delay: 0.3 },
        { top: "40%", left: "42%", right: undefined, bottom: undefined, size: 18, delay: 0.8 },
      ].map((star, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-20 text-black font-black select-none"
          style={{ top: star.top, left: star.left, right: star.right, bottom: star.bottom, fontSize: star.size }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: star.delay }}
        >
          ✦
        </motion.div>
      ))}

      {/* Top navigation bar — Planet ONO style: split around logo */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 border-b-4 border-black">
        <div className="flex items-center gap-10">
          <Link href="/products" className="text-sm font-black uppercase tracking-[0.15em] text-black hover:text-[#e34c26] transition-colors" data-cursor="SHOP">
            Products
          </Link>
          <Link href="/bundle-builder" className="text-sm font-black uppercase tracking-[0.15em] text-black hover:text-[#e34c26] transition-colors" data-cursor="BUILD">
            Bundles
          </Link>
        </div>

        {/* Center logo badge */}
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="absolute left-1/2 top-4 -translate-x-1/2"
        >
          <div
            className="bg-black text-[#ffc737] px-6 py-2 font-black text-xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_#000]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.1em" }}
          >
            DIGITAL SWARM
          </div>
        </motion.div>

        <div className="flex items-center gap-10">
          <Link href="/freebies" className="text-sm font-black uppercase tracking-[0.15em] text-black hover:text-[#e34c26] transition-colors" data-cursor="FREE">
            Freebies
          </Link>
          <Link href="/contact" className="text-sm font-black uppercase tracking-[0.15em] text-black hover:text-[#e34c26] transition-colors" data-cursor="CONTACT">
            Contact
          </Link>
        </div>
      </nav>

      {/* ── HERO MAIN CONTENT ── */}
      <div className="relative z-30 flex flex-col md:flex-row items-center justify-between min-h-screen pt-28 px-8 md:px-16 gap-12">

        {/* Left: Comic speech bubble tag */}
        <motion.div
          className="flex flex-col items-start gap-6 shrink-0"
          style={{ y: y2 }}
        >
          {/* Speech bubble sticker — Planet ONO's signature element */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: -6 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "backOut" }}
            className="relative"
          >
            <div
              className="bg-white border-4 border-black px-8 py-6 text-center shadow-[8px_8px_0px_#000] relative"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 75%, 85% 75%, 75% 100%, 65% 75%, 0 75%)",
                paddingBottom: "3rem",
              }}
            >
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#e34c26] mb-1">AI-POWERED</span>
              <span
                className="block text-5xl md:text-6xl font-black uppercase text-black leading-[0.9]"
                style={{
                  WebkitTextStroke: "2px black",
                  textShadow: "4px 4px 0px rgba(0,0,0,0.2)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                SWARM
                <br />
                INTEL
              </span>
            </div>
          </motion.div>

          {/* Floating sub-tag */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="bg-[#e34c26] border-4 border-black px-5 py-2 shadow-[4px_4px_0px_#000] -rotate-2"
          >
            <span className="text-white font-black text-xs uppercase tracking-[0.3em]">🚀 India&apos;s #1 AI Agent Store</span>
          </motion.div>
        </motion.div>

        {/* Center: Giant floating illustration area */}
        <motion.div
          className="relative flex-1 flex items-center justify-center"
          style={{ y: y1 }}
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="relative"
          >
            {/* The central oval tray — Planet ONO's floating product showcase */}
            <div
              className="relative w-[340px] h-[280px] md:w-[460px] md:h-[380px] bg-[#e34c26] border-4 border-black shadow-[12px_12px_0px_#000] flex items-center justify-center"
              style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", overflow: "hidden" }}
            >
              {/* AI Brain SVG representation */}
              <div className="text-center p-8">
                <div
                  className="text-8xl md:text-9xl font-black text-white leading-none select-none"
                  style={{
                    WebkitTextStroke: "3px black",
                    textShadow: "6px 6px 0px rgba(0,0,0,0.3)",
                  }}
                >
                  🤖
                </div>
                <div className="mt-4 bg-black text-[#ffc737] px-4 py-1 font-black text-xs uppercase tracking-[0.3em] border-2 border-[#ffc737]">
                  7 AI AGENTS
                </div>
              </div>
            </div>

            {/* Orbiting badges */}
            {[
              { label: "Sales", angle: 0, color: "#7dcfff", delay: 0 },
              { label: "Finance", angle: 60, color: "#9ece6a", delay: 0.2 },
              { label: "Legal", angle: 120, color: "#bb9af7", delay: 0.4 },
              { label: "HR", angle: 240, color: "#ff9e64", delay: 0.6 },
              { label: "Property", angle: 300, color: "#73daca", delay: 0.8 },
            ].map((badge, i) => {
              const rad = (badge.angle * Math.PI) / 180;
              const r = 180;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <motion.div
                  key={i}
                  className="absolute font-black text-[10px] uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] whitespace-nowrap"
                  style={{
                    left: `calc(50% + ${x}px - 30px)`,
                    top: `calc(50% + ${y}px - 14px)`,
                    background: badge.color,
                    color: "#000",
                    letterSpacing: "0.15em",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + badge.delay, type: "spring", stiffness: 200 }}
                >
                  {badge.label}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right: Main headline & CTA */}
        <motion.div
          className="flex flex-col gap-6 max-w-sm flex-shrink-0"
          style={{ y: y3 }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <h1
            className="text-5xl md:text-7xl font-black uppercase leading-[0.85] text-black"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              WebkitTextStroke: "2px black",
              textShadow: "5px 5px 0px rgba(0,0,0,0.15)",
            }}
          >
            SMARTER
            <br />
            THAN YOUR
            <br />
            <span style={{ WebkitTextStroke: "2px black", color: "#e34c26", textShadow: "5px 5px 0px rgba(0,0,0,0.2)" }}>
              WHOLE
              <br />
              TEAM.
            </span>
          </h1>

          <p className="text-sm font-bold text-black/70 leading-relaxed max-w-[260px]">
            AI agents that do the work of a full department. Sales intelligence, legal audits, market research — all in one click.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/products" data-cursor="SHOP">
              <motion.div
                className="flex items-center justify-between bg-black text-[#ffc737] border-4 border-black px-6 py-4 font-black text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0px_rgba(0,0,0,0.3)] cursor-pointer"
                whileHover={{ x: -4, y: -4, boxShadow: "10px 10px 0px rgba(0,0,0,0.3)" }}
                whileTap={{ x: 2, y: 2, boxShadow: "2px 2px 0px rgba(0,0,0,0.3)" }}
                transition={{ duration: 0.1 }}
              >
                Browse Agents
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>

            <Link href="/freebies" data-cursor="FREE">
              <motion.div
                className="flex items-center justify-between bg-[#ffc737] text-black border-4 border-black px-6 py-4 font-black text-sm uppercase tracking-[0.2em] shadow-[6px_6px_0px_#000] cursor-pointer"
                whileHover={{ x: -4, y: -4, boxShadow: "10px 10px 0px #000" }}
                whileTap={{ x: 2, y: 2, boxShadow: "2px 2px 0px #000" }}
                transition={{ duration: 0.1 }}
              >
                <span className="flex items-center gap-2"><Zap className="w-4 h-4" />Free Tools</span>
                <span className="text-[10px] bg-black text-[#ffc737] px-2 py-0.5">FREE</span>
              </motion.div>
            </Link>
          </div>

          {/* Carousel navigation dots — Planet ONO style */}
          <div className="flex items-center gap-4 mt-4">
            <motion.button
              className="w-12 h-12 border-3 border-black bg-white flex items-center justify-center font-black text-lg shadow-[4px_4px_0px_#000]"
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0px #000" }}
              whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0px #000" }}
              style={{ borderWidth: 3, borderRadius: 0 }}
            >
              ←
            </motion.button>
            <div className="flex gap-2">
              <div className="w-6 h-2 bg-black" />
              <div className="w-2 h-2 bg-black/30 rounded-full" />
              <div className="w-2 h-2 bg-black/30 rounded-full" />
            </div>
            <motion.button
              className="w-12 h-12 border-3 border-black bg-white flex items-center justify-center font-black text-lg shadow-[4px_4px_0px_#000]"
              whileHover={{ x: -2, y: -2, boxShadow: "6px 6px 0px #000" }}
              whileTap={{ x: 1, y: 1, boxShadow: "1px 1px 0px #000" }}
              style={{ borderWidth: 3, borderRadius: 0 }}
            >
              →
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator — Planet ONO's double chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-black/50">Scroll</span>
        <div className="text-black font-black text-xl leading-none">⌄⌄</div>
      </motion.div>
    </div>
  );
}
