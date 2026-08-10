"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { Terminal, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Newsletter } from "@/components/home/Newsletter";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";
  const queryFromUrl = searchParams.get("query") || "";

  const { data: productsData, isLoading } = useSwarmSWR<Product[]>('/api/products');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setActiveCategory(categoryFromUrl);
    setSearchQuery(queryFromUrl);
  }, [categoryFromUrl, queryFromUrl]);
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
    () => filteredProducts.slice(0, 3),
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

  useEffect(() => {
    if (!searchQuery && !isNeural && activeCategory.toLowerCase() === "all" && sortBy === "featured") {
      setFilteredProducts(rawProducts);
      setIsSearching(false);
      return;
    }

    const searchSequence = async () => {
      setIsSearching(true);
      try {
        const res = await fetch('/api/marketplace/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, isNeural, catalog: rawProducts })
        });

        if (!res.ok) throw new Error('Catalog search failed');

        const data = await res.json();
        let results = data.results || [];

        if (activeCategory.toLowerCase() !== "all") {
          results = results.filter((p: Product) => p.category.toLowerCase() === activeCategory.toLowerCase());
        }

        if (sortBy === "price-asc") results.sort((a: Product, b: Product) => a.price - b.price);
        else if (sortBy === "price-desc") results.sort((a: Product, b: Product) => b.price - a.price);

        setFilteredProducts(results);
      } catch (err) {
        console.error('[CATALOG_SEARCH] Search failure:', err);
        const localResults = rawProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(localResults);
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
      <div className="absolute inset-x-0 top-0 h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 max-w-[1600px] relative z-10">
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
            <div className="h-px flex-1 bg-white/5" />
            <div className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">Verified storefront catalog</span>
            </div>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="space-y-8 max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-7xl md:text-9xl font-outfit font-black italic uppercase tracking-tighter leading-[0.8] text-white"
            >
              Product <br />
              <span className="text-white/10 italic">Catalog</span>
            </motion.h1>
            <p className="text-sm text-white/45 max-w-2xl leading-relaxed">
              Browse only products currently approved for sale. Each listed SKU maps to a private delivery asset and checkout pricing is recalculated on the server before the payment order is created.
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 relative">
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

          <main className="flex-1 min-w-0">
            {isLoading || isSearching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-white/2 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                listName={isNeural ? "products_registry_smart" : `products_registry_${activeCategory.toLowerCase().replace(/\s+/g, "_")}`}
              />
            )}
          </main>
        </div>

        <section className="mt-24 grid gap-4 md:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <div className="text-3xl font-black text-white">{isLoading ? "—" : rawProducts.length}</div>
            <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/35">Currently approved SKUs</div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div className="mt-3 text-sm font-bold text-white">Private paid delivery</div>
            <div className="mt-1 text-xs text-white/40">Access is issued after verified payment rather than through public product files.</div>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <div className="text-sm font-bold text-white">No simulated popularity</div>
            <div className="mt-1 text-xs text-white/40">Catalog ranking does not depend on invented sales, stock, scarcity, or customer-rating numbers.</div>
          </div>
        </section>

        {comparisonProducts.length > 0 && (
          <section className="mt-20 border border-white/10 bg-white/2 p-8">
            <h2 className="text-xl font-outfit font-black uppercase italic tracking-tight mb-2">Quick comparison</h2>
            <p className="mb-6 text-xs text-white/40">The first three products in your current filtered result set; this is not a popularity ranking.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border-b border-white/10">
                    <th className="py-3">Product</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonProducts.map((product) => (
                    <tr key={product.id} className="border-b border-white/5 text-sm">
                      <td className="py-4 font-bold">{product.name}</td>
                      <td className="py-4 text-white/60">{product.category}</td>
                      <td className="py-4">₹{product.price.toLocaleString("en-IN")}</td>
                      <td className="py-4">
                        <Link href={`/product/${product.id}`} className="text-primary hover:underline">
                          View product
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
      <Newsletter />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
