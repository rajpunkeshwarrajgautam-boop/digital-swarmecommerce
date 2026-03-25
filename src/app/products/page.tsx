"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, Sparkles, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "SaaS", "AI", "Modern", "Enterprise"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Asset Repository</span>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]"
              >
                Deployed <br />
                <span className="text-white/20 italic">Architectures</span>
              </motion.h1>
              <p className="text-white/40 text-lg font-black uppercase tracking-tight max-w-xl">
                The absolute standard in production-ready digital infrastructure.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-md w-full"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20" />
              <input 
                type="text" 
                placeholder="Search Assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border-4 border-black p-6 pl-14 focus:bg-white focus:text-black focus:border-primary outline-none transition-all font-black uppercase tracking-widest text-sm shadow-[8px_8px_0_#000]"
              />
            </motion.div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-16 pb-8 border-b border-white/5">
          <div className="flex items-center gap-2 mr-4 text-white/30">
            <Filter className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
          </div>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 border-4 text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-white text-black border-black shadow-[6px_6px_0_#ff6b35]" : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"}`}
            >
              {cat}
            </button>
          ))}
          
          <div className="ml-auto hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">
             <span>Count: {filteredProducts.length}</span>
             <span>Refreshed: 0ms</span>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-4/5 bg-white/5 border-4 border-white/5 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-40 text-center border-8 border-black border-dashed opacity-20">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">No Assets Found</h2>
             <p className="mt-4 text-xs font-black uppercase tracking-widest">Adjust your search parameters or categorization tier.</p>
          </div>
        )}

        {/* Truststrip */}
        <div className="mt-32 pt-20 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20 grayscale transition-all hover:opacity-100 hover:grayscale-0">
           <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Licensing</span>
           </div>
           <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Instant Provisioning</span>
           </div>
           <div className="flex items-center gap-3 italic">
              <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">Status: Ready to Deploy</span>
           </div>
        </div>

      </div>
    </div>
  );
}
