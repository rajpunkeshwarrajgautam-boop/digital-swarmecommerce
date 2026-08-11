"use client";

import { Search, X, Sparkles } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  resultsCount: number;
  isNeural: boolean;
  setIsNeural: (val: boolean) => void;
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
  isNeural,
  setIsNeural,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:sticky lg:top-28 lg:h-fit lg:w-[310px]">
      <div className="border border-black/20 bg-[#f1eee6]">
        <div className="flex items-center justify-between border-b border-black/20 px-5 py-4">
          <span className="font-mono text-[9px] font-black uppercase tracking-[.2em]">Catalog controls</span>
          <span className="font-mono text-[9px] font-black text-[#725cff]">{resultsCount}</span>
        </div>

        <div className="border-b border-black/20 p-5">
          <label className="mb-3 block font-mono text-[8px] font-black uppercase tracking-[.2em] text-black/45">Search by name or category</label>
          <div className="flex items-center border border-black/20 bg-white/35">
            <Search className="ml-3 h-4 w-4 shrink-0 text-black/45" />
            <input
              type="text"
              placeholder="Search catalog"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-black outline-none placeholder:text-black/30"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="mr-2 flex h-8 w-8 items-center justify-center text-black/45 transition hover:text-black" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="border-b border-black/20 p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <span className="block font-mono text-[8px] font-black uppercase tracking-[.2em] text-black/45">Matching mode</span>
              <span className="mt-1 block text-xs font-bold">{isNeural ? "Smart relevance" : "Direct search"}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsNeural(!isNeural)}
              aria-pressed={isNeural}
              className={`relative h-7 w-12 rounded-full border border-black/20 transition ${isNeural ? "bg-[#725cff]" : "bg-black/5"}`}
            >
              <span className={`absolute top-1 h-[18px] w-[18px] rounded-full bg-[#f1eee6] shadow-sm transition-transform ${isNeural ? "translate-x-[25px]" : "translate-x-1"}`} />
            </button>
          </div>
          <p className="text-[11px] leading-5 text-black/45">Smart relevance changes how the search endpoint orders matches. It does not invent popularity or ratings.</p>
        </div>

        <div className="border-b border-black/20 p-5">
          <span className="mb-4 block font-mono text-[8px] font-black uppercase tracking-[.2em] text-black/45">Category</span>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-between gap-4 border px-3 py-3 text-left text-[10px] font-black uppercase tracking-[.13em] transition lg:border-x-0 lg:border-b-0 lg:border-t ${
                  activeCategory === cat
                    ? "border-[#725cff] bg-[#d9d0ff] text-black lg:border-black/15"
                    : "border-black/15 bg-transparent text-black/50 hover:bg-black/[.035] hover:text-black"
                }`}
              >
                <span className="truncate">{cat}</span>
                <span className="font-mono text-[8px] text-[#725cff]/70">{String(index + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <span className="mb-4 block font-mono text-[8px] font-black uppercase tracking-[.2em] text-black/45">Order</span>
          <div className="grid gap-2">
            {[
              { id: "featured", label: "Catalog order" },
              { id: "price-asc", label: "Price · low to high" },
              { id: "price-desc", label: "Price · high to low" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`flex items-center justify-between border px-3 py-3 text-left text-[9px] font-black uppercase tracking-[.13em] transition ${
                  sortBy === option.id ? "border-black bg-[#151515] text-[#f1eee6]" : "border-black/15 text-black/50 hover:border-black/35 hover:text-black"
                }`}
              >
                {option.label}
                {sortBy === option.id && <Sparkles className="h-3.5 w-3.5 text-[#d8b66d]" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
