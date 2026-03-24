"use client";

import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, X, ArrowRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { products } from "@/lib/data";
import { Product } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const router = useRouter();

  const fuse = new Fuse(products, {
    keys: ["name", "description", "category", "features"],
    threshold: 0.3,
    distance: 100,
  });

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = fuse.search(query).map(r => r.item).slice(0, 5);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (productId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/products/${productId}`);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/50 hover:bg-gray-200/50 border border-black/5 transition-all group lg:min-w-[160px]"
      >
        <SearchIcon className="w-4 h-4 text-gray-500 group-hover:text-gray-900" />
        <span className="hidden lg:block text-xs font-bold text-gray-400 group-hover:text-gray-600">Search Protocol</span>
        <kbd className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[10px] font-black text-gray-400">
          <span className="text-[8px]">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />

            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl z-[101] overflow-hidden border border-black/5"
            >
              <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                <SearchIcon className="w-6 h-6 text-cyan-500" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Query the matrix... (e.g. 'AI Agents', 'React')"
                  className="flex-1 bg-transparent text-xl font-bold text-gray-900 outline-none placeholder:text-gray-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Tactical Matches</p>
                    {results.map((product) => (
                      <button 
                        key={product.id}
                        onClick={() => handleSelect(product.id)}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 group transition-all text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-black/5 group-hover:scale-105 transition-transform">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-cyan-600 transition-colors uppercase tracking-tight">{product.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.category} — {product.description}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                          <ArrowRight className="w-4 h-4 text-cyan-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.length > 1 ? (
                  <div className="py-12 text-center">
                    <Zap className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching protocols found</p>
                  </div>
                ) : (
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <QuickLink label="Elite Subscriptions" href="/elite" />
                    <QuickLink label="AI Agent Swarms" href="/products?category=AI+Agents" />
                    <QuickLink label="UI Infrastructure" href="/products?category=Web+Development" />
                    <QuickLink label="Strategic Bundles" href="/bundle-builder" />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 flex justify-between items-center border-t border-gray-100">
                <div className="flex gap-4">
                  <KbdHint keyName="Enter" label="Select" />
                  <KbdHint keyName="Esc" label="Close" />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase italic">Digital Swarm Semantic Search v2.4</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <Link 
      href={href}
      className="p-4 rounded-2xl border border-gray-100 hover:border-cyan-500/30 hover:bg-cyan-50/50 transition-all group"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-600 group-hover:text-gray-900 text-sm uppercase tracking-tight">{label}</span>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-cyan-500 transition-colors" />
      </div>
    </Link>
  );
}

function KbdHint({ keyName, label }: { keyName: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-white text-[9px] font-black text-gray-500 shadow-sm">{keyName}</kbd>
      <span className="text-[9px] font-bold text-gray-400 uppercase">{label}</span>
    </div>
  );
}
