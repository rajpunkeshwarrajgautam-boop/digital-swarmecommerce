"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { Terminal, Activity, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Newsletter } from "@/components/home/Newsletter";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";

  const { data: productsData, isLoading } = useSwarmSWR<Product[]>('/api/products');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setActiveCategory(categoryFromUrl);
  }, [categoryFromUrl]);
  const [sortBy, setSortBy] = useState("featured");
  const [isNeural, setIsNeural] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const rawProducts = useMemo(() => productsData || [], [productsData]);

  const categories = useMemo(() => 
    ["All", ...Array.from(new Set(rawProducts.map(p => p.category)))],
    [rawProducts]
  );
  const comparisonProducts = useMemo(
    () =>
      [...filteredProducts]
        .sort((a, b) => (b.rating * 100 + b.price / 1000) - (a.rating * 100 + a.price / 1000))
        .slice(0, 3),
    [filteredProducts]
  );
  const itemListJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: filteredProducts.slice(0, 12).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://digitalswarm.in/product/${product.id}`,
        name: product.name,
      })),
    }),
    [filteredProducts]
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
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
                <ProductGrid
                  products={filteredProducts}
                  listName={isNeural ? "products_registry_neural" : `products_registry_${activeCategory.toLowerCase().replace(/\s+/g, "_")}`}
                />
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

        <section className="mt-20 border border-white/10 bg-white/2 p-8">
          <h2 className="text-xl font-outfit font-black uppercase italic tracking-tight mb-6">Top Pick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border-b border-white/10">
                  <th className="py-3">Product</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Rating</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {comparisonProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 text-sm">
                    <td className="py-4 font-bold">{product.name}</td>
                    <td className="py-4 text-white/60">{product.category}</td>
                    <td className="py-4 text-primary">{product.rating.toFixed(1)}</td>
                    <td className="py-4">₹{product.price.toLocaleString("en-IN")}</td>
                    <td className="py-4">
                      <Link href={`/product/${product.id}`} className="text-primary hover:underline">
                        View Offer
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
      <Newsletter />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
