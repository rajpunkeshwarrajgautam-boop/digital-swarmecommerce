"use client";

import { useState, useEffect } from "react";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Cpu, Star, ArrowRight, Zap, Filter, Command } from "lucide-react";
import { swarmSearch, SearchResult } from "@/lib/search";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NeuralSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query) {
        setIsSearching(true);
        const res = await swarmSearch(query);
        setResults(res);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Neural Search</h1>
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em]">Protocol_Discovery_Active</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-[#CCFF00] rounded-none blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-black border-4 border-white/10 p-2">
              <Search className="w-6 h-6 ml-4 text-gray-500" />
              <input 
                type="text" 
                autoFocus
                placeholder="FIND_SWARM_ASSETS..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent p-6 text-xl font-black italic uppercase text-white outline-none placeholder:text-gray-800"
              />
              <div className="hidden md:flex items-center gap-2 mr-6 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-gray-600">
                <Command className="w-2 h-2" />
                <span>K</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 italic">
                <Filter className="w-3 h-3" />
                <span>{results.length} Nodes_Matched</span>
              </div>
              {isSearching && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 animate-ping rounded-full" />
                  <span className="text-[9px] font-black uppercase text-cyan-500">Querying_Swarm...</span>
                </div>
              )}
            </div>

            <AnimatePresence>
              <div className="grid grid-cols-1 gap-4">
                {results.map((res) => (
                  <SearchCard key={res.id} result={res} />
                ))}
                {query && results.length === 0 && !isSearching && (
                  <div className="py-20 text-center space-y-4">
                    <Zap className="w-12 h-12 text-gray-900 mx-auto" />
                    <p className="text-gray-700 font-black italic uppercase text-xl tracking-widest">
                      NULL_RESULT: No nodes detected for query.
                    </p>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function SearchCard({ result }: { result: SearchResult }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <GlassCard className="p-6 border-2 border-white/5 hover:border-[#CCFF00]/30 rounded-none bg-white/[0.02] transition-all group">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-gray-600 group-hover:text-[#CCFF00] transition-colors" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black italic uppercase text-white tracking-tight">{result.name}</h3>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-white/5 border border-white/10 text-gray-500 italic">
                  {result.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-[9px] font-black text-[#CCFF00] uppercase italic">
                  <Star className="w-2 h-2 fill-current" />
                  <span>Trust: {result.reputation}</span>
                </div>
                <span className="text-[9px] font-mono text-gray-600 uppercase">UID: {result.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-[9px] font-black uppercase text-gray-600 italic">PRICE</div>
              <div className="text-xl font-black italic text-white tracking-tighter">₹{result.price}</div>
            </div>
            <Link href={`/product/${result.id}`} className="p-3 border-2 border-white/10 group-hover:border-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
