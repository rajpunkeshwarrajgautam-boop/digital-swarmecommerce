"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { Terminal, Activity, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";

export default function ProductsPage() {
  const { data: productsData, isLoading } = useSwarmSWR<Product[]>('/api/products');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isNeural, setIsNeural] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const rawProducts = useMemo(() => productsData || [], [productsData]);

  const categories = useMemo(() => 
    ["All", ...Array.from(new Set(rawProducts.map(p => p.category)))],
    [rawProducts]
  );

  // 🛰️ NEURAL DISCOVERY ENGINE
  useEffect(() => {
    const searchSequence = async () => {
      if (!searchQuery && !isNeural && activeCategory === "All") {
        setFilteredProducts(rawProducts);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch('/api/marketplace/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, isNeural })
        });
        const data = await res.json();
        let results = data.results || [];

        // Apply Local Category & Sort filters
        if (activeCategory !== "All") {
          results = results.filter((p: Product) => p.category === activeCategory);
        }

        if (sortBy === "price-asc") results.sort((a: Product, b: Product) => a.price - b.price);
        else if (sortBy === "price-desc") results.sort((a: Product, b: Product) => b.price - a.price);

        setFilteredProducts(results);
      } catch (err) {
        console.error('[SEARCH_FAULT] Uplink failure:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchSequence, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isNeural, activeCategory, sortBy, rawProducts]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32">
      {/* Background Decor */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-[1600px] relative z-10">
        
        {/* Header Section */}
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
             <div className="h-px flex-1 bg-white/5" />
             <div className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary italic">registry_lookup.v4</span>
             </div>
             <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <div className="space-y-8 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-outfit font-black italic uppercase tracking-tighter leading-[0.8] text-white"
            >
              Protocol <br />
              <span className="text-white/10 italic">Registry</span>
            </motion.h1>
            <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.4em] max-w-xl italic leading-relaxed">
              Autonomous asset distribution system. {isNeural ? 'Neural Link Discovery Active.' : 'Authorized access only.'}
            </p>
          </div>
        </header>

        {/* 2-Column Catalog Layout */}
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Sidebar Area */}
          <FilterSidebar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resultsCount={filteredProducts.length}
            isNeural={isNeural}
            setIsNeural={setIsNeural}
          />

          {/* Main Product Area */}
          <main className="flex-1 min-w-0">
            {isLoading || isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-white/2 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                <ProductGrid products={filteredProducts} />
                {isNeural && filteredProducts.some(p => p.matchDensity) && (
                   <div className="flex flex-col items-center gap-2 mt-8">
                      <p className="text-[8px] font-mono font-black text-white/10 uppercase tracking-widest text-center">
                        Atmospheric_Similarity_Ranking_Active
                      </p>
                      <div className="w-12 h-1 bg-primary/20 rounded-full" />
                   </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Systems Status Bar */}
        <footer className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Protocol Trust</span>
                 <div className="flex gap-1.5">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-3 bg-primary/40" />)}
                 </div>
              </div>
              <div className="flex items-center gap-8 text-[9px] font-mono font-black uppercase tracking-[0.3em] text-white/10 italic">
                 <span className="flex items-center gap-3">
                    <Activity className={`w-3.5 h-3.5 ${isSearching ? 'text-primary animate-spin' : 'animate-pulse'}`} /> 
                    Live_Sync: {isSearching ? 'Processing_Neural_Link...' : 'Online'}
                 </span>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                 <Zap className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">Asset_Protection_v4</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                 <Shield className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">Authorized_Transfer</span>
              </div>
           </div>
        </footer>

      </div>
    </div>
  );
}
