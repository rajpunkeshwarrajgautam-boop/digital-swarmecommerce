"use client";

import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { Search, ShoppingCart, Cpu, Code2, LayoutDashboard, BrainCircuit, Rocket, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/10 flex flex-col"
          >
            <Command label="Command Menu" loop className="flex flex-col h-full">
              <div className="flex items-center border-b border-black/5 p-4">
                <Search className="w-5 h-5 text-secondary/40 mr-3" />
                <Command.Input
                  autoFocus
                  placeholder="Search Swarm Protocols (⌘K)..."
                  className="flex-1 bg-transparent outline-none text-secondary font-bold placeholder:text-secondary/20 h-10"
                  onValueChange={setSearch}
                />
                <div className="flex items-center gap-1 ml-4">
                  <span className="px-2 py-0.5 rounded-md bg-secondary/5 text-secondary/30 text-[10px] font-black border border-secondary/10">ESC</span>
                </div>
              </div>

              <Command.List className="max-h-[350px] overflow-y-auto p-4 scrollbar-hide">
                <Command.Empty className="py-12 text-center text-secondary/40 font-bold italic">
                  Critical Error: No matching protocols found.
                </Command.Empty>

                <Command.Group heading="Directives" className="mb-4">
                  <Item icon={BrainCircuit} onSelect={() => runCommand(() => router.push('/ai-agents'))}>AI Agents</Item>
                  <Item icon={Code2} onSelect={() => runCommand(() => router.push('/software-stacks'))}>Software Stacks</Item>
                  <Item icon={Cpu} onSelect={() => runCommand(() => router.push('/neural-swarms'))}>Neural Swarms</Item>
                  <Item icon={Rocket} onSelect={() => runCommand(() => router.push('/elite-access'))}>Elite Access</Item>
                </Command.Group>

                <Command.Group heading="Products" className="mb-4">
                   {products.map(product => (
                     <Item 
                       key={product.id} 
                       icon={ShoppingCart} 
                       onSelect={() => runCommand(() => router.push(`/product/${product.id}`))}
                     >
                       <div className="flex flex-col">
                         <span>{product.name}</span>
                         <span className="text-[10px] text-secondary/40 font-bold uppercase">{product.category}</span>
                       </div>
                     </Item>
                   ))}
                </Command.Group>

                <Command.Group heading="System">
                  <Item icon={LayoutDashboard} onSelect={() => runCommand(() => router.push('/pricing'))}>Pricing Protocol</Item>
                  <Item icon={X} onSelect={() => setOpen(false)}>Close Terminal</Item>
                </Command.Group>
              </Command.List>
              
              <div className="bg-secondary/5 p-3 flex items-center justify-between border-t border-black/5 px-6">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-tighter text-secondary/60">Uplink Stable</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-black text-secondary/20 uppercase tracking-widest italic">
                    Digital Swarm // v3.2.0
                 </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Item({ children, icon: Icon, onSelect }: { children: React.ReactNode, icon: any, onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer aria-selected:bg-primary/5 aria-selected:text-primary transition-all group"
    >
      <Icon className="w-5 h-5 text-secondary/40 group-aria-selected:text-primary" />
      <div className="flex-1 text-sm font-black uppercase italic tracking-tight text-secondary group-aria-selected:text-primary">
        {children}
      </div>
      <ArrowRight className="w-4 h-4 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
    </Command.Item>
  );
}
