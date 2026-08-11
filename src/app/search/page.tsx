"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Cpu, ArrowRight, Zap, Filter, Command } from "lucide-react";
import { swarmSearch, SearchResult } from "@/lib/search";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        setResults(await swarmSearch(query));
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <main className="min-h-screen bg-black pt-20 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">Catalog Search</h1>
          <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.25em]">Searches current listed products and features</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-accent/40 blur opacity-20 group-focus-within:opacity-40 transition duration-700" />
          <div className="relative flex items-center rounded-2xl bg-black border border-white/10 p-2">
            <Search className="w-6 h-6 ml-4 text-gray-500" />
            <input
              type="search"
              autoFocus
              aria-label="Search products"
              placeholder="Search products, categories, or included features..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent p-5 text-base md:text-lg font-semibold text-white outline-none placeholder:text-gray-700"
            />
            <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black text-gray-600">
              <Command className="w-3 h-3" /> K
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
              <Filter className="w-3 h-3" />
              <span>{results.length} matches</span>
            </div>
            {isSearching && <span className="text-[9px] font-black uppercase text-primary">Searching...</span>}
          </div>

          <AnimatePresence>
            <div className="grid grid-cols-1 gap-4">
              {results.map((result) => <SearchCard key={result.id} result={result} />)}
              {query.trim() && results.length === 0 && !isSearching && (
                <div className="py-20 text-center space-y-4">
                  <Zap className="w-12 h-12 text-gray-900 mx-auto" />
                  <p className="text-gray-600 font-bold uppercase text-sm tracking-widest">No listed product matches that search.</p>
                </div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function SearchCard({ result }: { result: SearchResult }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className="p-6 border border-white/8 hover:border-primary/30 rounded-2xl bg-white/[0.02] transition-all group">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5 min-w-0">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2 min-w-0">
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight truncate">{result.name}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500">{result.category}</span>
                <span className="text-[9px] font-mono text-gray-600">Relevance {result.matchScore}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
            <div>
              <div className="text-[9px] font-black uppercase text-gray-600">Price</div>
              <div className="text-xl font-black text-white">₹{result.price.toLocaleString('en-IN')}</div>
            </div>
            <Link href={`/product/${result.id}`} aria-label={`View ${result.name}`} className="p-3 rounded-xl border border-white/10 hover:border-primary hover:bg-primary hover:text-black transition-all">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
