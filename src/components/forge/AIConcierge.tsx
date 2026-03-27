"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Terminal, Cpu, Zap, Command, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForgeStore } from "@/lib/forge-store";

export const AIConcierge = () => {
  const { isConciergeOpen, toggleConcierge, setSystemStatus } = useForgeStore();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isConciergeOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") toggleConcierge();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isConciergeOpen, toggleConcierge]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;
    
    setSystemStatus("processing");
    
    // Command Logic
    setTimeout(() => {
      if (cmd.includes("find") || cmd.includes("search")) {
        const query = cmd.replace("find", "").replace("search", "").trim();
        router.push(`/products?search=${encodeURIComponent(query)}`);
      } else if (cmd.includes("goto cart") || cmd.includes("open cart")) {
        router.push("/products");
      } else if (cmd.includes("show all") || cmd.includes("registry")) {
        router.push("/products");
      } else if (cmd.includes("home") || cmd.includes("exit")) {
        router.push("/");
      } else if (cmd.includes("status")) {
        alert("SYSTEM_SAFE // ALL_PROTOCOL_OPERATIONAL // v2.04_FORGE");
      } else {
        router.push(`/products?search=${encodeURIComponent(cmd)}`);
      }
      
      setSystemStatus("idle");
      setInput("");
      toggleConcierge();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isConciergeOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-[10vh] px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleConcierge}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Console Interface */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header / Meta */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
                  Forge AI Protocol v2.0
                </span>
              </div>
              <button 
                onClick={toggleConcierge}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            </div>

            {/* Main Command Input */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="relative flex items-center gap-4 group">
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Identify your deployment requirements..."
                  className="flex-1 bg-transparent border-none outline-none text-xl font-outfit font-light placeholder:text-white/20 text-white"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-white/30">
                  <Command className="w-3 h-3" />
                  <span>ENTER</span>
                </div>
              </div>

              {/* Suggestions / Status Bar */}
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SuggestionCard 
                  icon={<Cpu className="w-3.5 h-3.5" />} 
                  title="Next.js Stacks" 
                  desc="Optimize performance" 
                  onClick={() => setInput("find Next.js")}
                />
                <SuggestionCard 
                  icon={<Zap className="w-3.5 h-3.5" />} 
                  title="AI Agent Kits" 
                  desc="Autonomous logic" 
                   onClick={() => setInput("find AI Agents")}
                />
                <SuggestionCard 
                  icon={<Sparkles className="w-3.5 h-3.5" />} 
                  title="UI Protocols" 
                  desc="Advanced visuals" 
                   onClick={() => setInput("find visual kit")}
                />
              </div>
            </form>

            {/* Bottom Glow */}
            <div className="h-1 w-full bg-linear-to-r from-transparent via-accent/30 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const SuggestionCard = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col gap-1 p-3 bg-white/2 border border-white/5 rounded-lg text-left hover:bg-white/5 hover:border-accent/30 transition-all group"
  >
    <div className="flex items-center gap-2 text-white/40 group-hover:text-accent transition-colors">
      {icon}
      <span className="text-[10px] font-mono uppercase tracking-widest leading-none">{title}</span>
    </div>
    <span className="text-xs text-white/20 group-hover:text-white/40 transition-colors">{desc}</span>
  </button>
);
