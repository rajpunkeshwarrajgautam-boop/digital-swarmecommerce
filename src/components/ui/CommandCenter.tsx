"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { 
  Search, 
  LayoutGrid, 
  Zap, 
  Shield, 
  Globe, 
  Terminal, 
  Cpu,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";

export function CommandCenter() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { playClick } = useAudio();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        playClick();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [playClick]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] cursor-pointer group"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 text-xs font-mono tracking-widest text-zinc-400 group-hover:border-primary/50 group-hover:text-primary transition-all shadow-2xl"
        >
          <span className="flex items-center gap-1.5 font-bold">
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-white/5 uppercase">⌘</kbd>
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded border border-white/5 uppercase">K</kbd>
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span>OPEN FORGE COMMAND</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center border-b border-white/5 p-4 gap-3">
                <Search className="w-5 h-5 text-primary" />
                <Command.Input
                  placeholder="Execute protocol search..."
                  className="w-full bg-transparent border-none outline-none text-lg font-outfit placeholder:text-zinc-600"
                />
              </div>

              <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-800">
                <Command.Empty className="p-8 text-center text-zinc-500 font-mono text-sm">
                  NO ACTIVE PROTOCOLS DETECTED.
                </Command.Empty>

                <Command.Group heading="CORE INTERFACE" className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] p-2 pt-4">
                  <Item onSelect={() => runCommand(() => router.push("/"))}>
                    <Globe className="w-4 h-4" />
                    <span>Global Terminal (Home)</span>
                  </Item>
                  <Item onSelect={() => runCommand(() => router.push("/verticals"))}>
                    <LayoutGrid className="w-4 h-4" />
                    <span>Sector Hub (Verticals)</span>
                  </Item>
                  <Item onSelect={() => runCommand(() => router.push("/products"))}>
                    <Zap className="w-4 h-4" />
                    <span>Asset Catalog (Products)</span>
                  </Item>
                </Command.Group>

                <Command.Group heading="ELITE SECTORS" className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] p-2 pt-4">
                  <Item onSelect={() => runCommand(() => router.push("/products?category=Legal"))}>
                    <Shield className="w-4 h-4" />
                    <span>Legal Protocol</span>
                  </Item>
                  <Item onSelect={() => runCommand(() => router.push("/products?category=Finance"))}>
                    <Terminal className="w-4 h-4" />
                    <span>Finance Protocol</span>
                  </Item>
                  <Item onSelect={() => runCommand(() => router.push("/products?category=SaaS"))}>
                    <Cpu className="w-4 h-4" />
                    <span>SaaS Infrastructure</span>
                  </Item>
                  <Item onSelect={() => runCommand(() => router.push("/products?category=AI+Agent"))}>
                    <Sparkles className="w-4 h-4" />
                    <span>Autonomous Agents</span>
                  </Item>
                </Command.Group>

                <Command.Group heading="QUICK ACTIONS" className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] p-2 pt-4">
                  <Item onSelect={() => runCommand(() => window.dispatchEvent(new CustomEvent('toggle-ai-concierge')))}>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-primary font-bold">REBOOT AI CONCIERGE</span>
                  </Item>
                </Command.Group>
              </Command.List>

              <div className="p-3 border-t border-white/5 bg-black/40 flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>Navigate ↑↓ • Select ↵</span>
                <span className="text-primary/50">Elite Omega Status: Online</span>
              </div>
            </motion.div>
          </Command.Dialog>
        )}
      </AnimatePresence>
    </>
  );
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  const childArray = React.Children.toArray(children);
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 aria-selected:bg-primary/10 aria-selected:text-primary transition-all group"
    >
      <div className="p-2 bg-zinc-900 rounded-lg group-aria-selected:bg-primary/20 transition-colors">
        {childArray[0]}
      </div>
      <div className="flex flex-col">
        {childArray[1]}
      </div>
    </Command.Item>
  );
}
