"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Command, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForgeStore } from "@/lib/forge-store";

/**
 * Lightweight catalog command palette. This intentionally does not pretend to
 * be a generative-AI agent: it routes buyers to real storefront destinations
 * and catalog search results.
 */
export const AIConcierge = () => {
  const { isConciergeOpen, toggleConcierge } = useForgeStore();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isConciergeOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 100);
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggleConcierge();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isConciergeOpen, toggleConcierge]);

  const navigate = (destination: string) => {
    router.push(destination);
    setInput("");
    toggleConcierge();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    const command = raw.toLowerCase();

    if (command === "cart" || command.includes("open cart") || command.includes("goto cart")) {
      navigate("/cart");
      return;
    }
    if (command === "wishlist" || command.includes("open wishlist")) {
      navigate("/wishlist");
      return;
    }
    if (command === "home" || command === "exit") {
      navigate("/");
      return;
    }
    if (command === "status" || command === "health") {
      navigate("/health");
      return;
    }

    const query = raw.replace(/^\s*(find|search)\s+/i, "").trim() || raw;
    navigate(`/products?query=${encodeURIComponent(query)}`);
  };

  return (
    <AnimatePresence>
      {isConciergeOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[10vh] sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleConcierge}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-accent" />
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.25em] text-white/45">
                  Product Finder
                </span>
              </div>
              <button
                type="button"
                onClick={toggleConcierge}
                aria-label="Close product finder"
                className="rounded-md p-1 transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4 text-white/45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center gap-4">
                <Sparkles className="h-5 w-5 text-accent" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Search products or type: cart, wishlist, health…"
                  aria-label="Search the Digital Swarm catalog"
                  className="flex-1 border-none bg-transparent font-outfit text-xl font-light text-white outline-none placeholder:text-white/20"
                />
                <div className="flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/30">
                  <Command className="h-3 w-3" /> ENTER
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/5 pt-6 sm:grid-cols-3">
                <SuggestionCard title="AI agents" desc="Search agent products" onClick={() => setInput("AI Agent")} />
                <SuggestionCard title="Playbooks" desc="Search playbooks" onClick={() => setInput("Playbook")} />
                <SuggestionCard title="Open cart" desc="Review selected products" icon={<ShoppingBag className="h-3.5 w-3.5" />} onClick={() => navigate("/cart")} />
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

function SuggestionCard({
  title,
  desc,
  onClick,
  icon = <Search className="h-3.5 w-3.5" />,
}: {
  title: string;
  desc: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-1 rounded-lg border border-white/5 bg-white/2 p-3 text-left transition-all hover:border-accent/30 hover:bg-white/5"
    >
      <div className="flex items-center gap-2 text-white/45">
        {icon}
        <span className="font-mono text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <span className="text-xs text-white/25">{desc}</span>
    </button>
  );
}
