"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, Filter, Terminal, Activity, Zap, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

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

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating-desc") return (b.rating || 0) - (a.rating || 0);
      return 0; // Featured (original order)
    });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32">
      {/* Background Decor */}
      <div className="absolute inset-x-0 top-0 h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
             <div className="h-px flex-1 bg-white/5" />
             <div className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary italic">registry_lookup.v3</span>
             </div>
             <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-16">
            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl md:text-9xl font-outfit font-black italic uppercase tracking-tighter leading-[0.8] text-white"
              >
                Protocol <br />
                <span className="text-white/10 italic">Registry</span>
              </motion.h1>
              <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.4em] max-w-xl italic leading-relaxed">
                Autonomous asset distribution system. Authorized access only. All transfers are cryptographically secured.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-md w-full group"
            >
              <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Query Registry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/2 border border-white/5 p-6 pl-16 focus:bg-white/5 focus:border-primary/40 outline-none transition-all font-mono uppercase tracking-widest text-xs italic"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-px bg-white/10" />
            </motion.div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-20 pb-10 border-b border-white/5">
          <div className="flex items-center gap-3 mr-6 text-white/20">
            <Filter className="w-4 h-4" />
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">Tier_Filter</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2 text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all border ${
                  activeCategory === cat 
                    ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(255,107,53,0.3)]" 
                    : "bg-white/2 border-white/5 text-white/30 hover:bg-white/5 hover:border-white/20"
                }`}
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-10 w-px bg-white/5 hidden md:block" />

          <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-2">
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-white/20">Sort_By:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] font-mono font-black uppercase tracking-[0.2em] text-primary outline-none cursor-pointer appearance-none text-center"
            >
              <option value="featured" className="bg-[#0a0a0f]">Featured</option>
              <option value="price-asc" className="bg-[#0a0a0f]">Price: Low-High</option>
              <option value="price-desc" className="bg-[#0a0a0f]">Price: High-Low</option>
              <option value="rating-desc" className="bg-[#0a0a0f]">Top Rated</option>
            </select>
          </div>
          
          <div className="ml-auto flex items-center gap-8 text-[9px] font-mono font-black uppercase tracking-[0.3em] text-white/10 italic">
             <span className="flex items-center gap-3">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Live_Sync: Online
             </span>
             <span>Registry_Count: {filteredProducts.length}</span>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-white/2 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, transform: 'translateY(20px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px)' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="py-40 text-center border border-white/5 bg-white/1 relative overflow-hidden group">
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity" 
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '20px 20px' }} 
             />
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-8">
                   <Shield className="w-10 h-10 text-white/5" />
                </div>
                <h2 className="text-4xl font-outfit font-black uppercase italic tracking-tighter text-white/40">Query_Null</h2>
                <p className="mt-4 text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/20">No matching protocols identified in the forge.</p>
                <ForgeButton 
                   className="mt-12" 
                   onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                   variant="outline"
                >
                   Reset Uplink
                </ForgeButton>
             </div>
          </div>
        )}

        {/* Systems Status Bar */}
        <div className="mt-40 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Protocol Trust</span>
                 <div className="flex gap-1.5">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-3 bg-primary/40" />)}
                 </div>
              </div>
              <div className="flex flex-col gap-2">
                 <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">Security Level</span>
                 <span className="text-[11px] font-mono text-primary font-black italic">ELITE_ENCRYPTED</span>
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                 <Zap className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">Automated_Provisioning</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                 <Shield className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em]">Asset_Protection_v4</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
