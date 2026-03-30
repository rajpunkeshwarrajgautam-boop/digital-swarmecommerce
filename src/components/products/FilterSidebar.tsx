"use client";

import { Search, Filter, X, ChevronRight, Zap } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resultsCount: number;
}

export function FilterSidebar({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  resultsCount,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-80 flex flex-col gap-8 sticky top-32 h-fit">
      
      {/* Search Module */}
      <section className="relative group">
        <div className="absolute -inset-px bg-accent/20 blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative bg-white/2 border border-white/5 p-1 flex items-center gap-2 focus-within:border-accent/40 transition-all">
          <div className="p-3 text-white/20 group-focus-within:text-accent transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search Registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[10px] font-mono uppercase tracking-widest italic text-white placeholder:text-white/10 py-3"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="p-3 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* Categories Module */}
      <section className="flex flex-col gap-4">
        <header className="flex items-center gap-3 border-l-2 border-accent pl-4 py-1">
          <Filter className="w-3.5 h-3.5 text-accent" />
          <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white">Sector_Filter</h4>
        </header>
        <div className="flex flex-col gap-1 mt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`group flex items-center justify-between p-3 text-[10px] font-mono uppercase tracking-[0.2em] transition-all border-l-2 ${
                activeCategory === cat
                  ? "bg-accent/5 border-accent text-accent"
                  : "bg-transparent border-transparent text-white/30 hover:bg-white/2 hover:text-white/60"
              }`}
            >
              <span className="truncate">{cat}</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${activeCategory === cat ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
            </button>
          ))}
        </div>
      </section>

      {/* Sorting Module */}
      <section className="flex flex-col gap-4">
        <header className="flex items-center gap-3 border-l-2 border-primary pl-4 py-1">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white">Sequence_Logic</h4>
        </header>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {[
            { id: "featured", label: "Protocol Order" },
            { id: "price-asc", label: "Cost: Ascending" },
            { id: "price-desc", label: "Cost: Descending" },
            { id: "rating-desc", label: "Elite Rating" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id)}
              className={`p-3 text-[9px] font-mono uppercase tracking-[0.2em] text-left border ${
                sortBy === option.id
                  ? "bg-primary/5 border-primary text-primary"
                  : "bg-white/2 border-white/5 text-white/20 hover:border-white/20 hover:text-white/40"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* Status Module */}
      <section className="bg-white/2 border border-white/5 p-6 mt-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 scale-150 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
          <Zap className="w-12 h-12 text-accent" />
        </div>
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Active Results</span>
            <span className="text-xl font-outfit font-black italic text-white">{resultsCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] font-mono text-accent uppercase tracking-[0.2em]">Synchronized</span>
          </div>
        </div>
      </section>

    </aside>
  );
}
