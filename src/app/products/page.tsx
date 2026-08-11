"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FilterSidebar } from "@/components/products/FilterSidebar";
import { useSwarmSWR } from "@/hooks/useSwarmSWR";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "All";
  const queryFromUrl = searchParams.get("query") || "";
  const { data: productsData, isLoading } = useSwarmSWR<Product[]>("/api/products");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [isNeural, setIsNeural] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setActiveCategory(categoryFromUrl);
    setSearchQuery(queryFromUrl);
  }, [categoryFromUrl, queryFromUrl]);

  const rawProducts = useMemo(() => productsData || [], [productsData]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(rawProducts.map((product) => product.category)))], [rawProducts]);
  const comparisonProducts = useMemo(() => filteredProducts.slice(0, 3), [filteredProducts]);
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
        const response = await fetch("/api/marketplace/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery, isNeural, catalog: rawProducts }),
        });
        if (!response.ok) throw new Error("Catalog search failed");
        const data = await response.json();
        let results: Product[] = data.results || [];
        if (activeCategory.toLowerCase() !== "all") {
          results = results.filter((product) => product.category.toLowerCase() === activeCategory.toLowerCase());
        }
        if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
        setFilteredProducts(results);
      } catch (error) {
        console.error("[CATALOG_SEARCH] Search failure:", error);
        let localResults = rawProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (activeCategory.toLowerCase() !== "all") {
          localResults = localResults.filter((product) => product.category.toLowerCase() === activeCategory.toLowerCase());
        }
        if (sortBy === "price-asc") localResults.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc") localResults.sort((a, b) => b.price - a.price);
        setFilteredProducts(localResults);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchSequence, 260);
    return () => clearTimeout(timer);
  }, [searchQuery, isNeural, activeCategory, sortBy, rawProducts]);

  return (
    <div className="min-h-screen bg-[#d9d0ff] text-[#151515]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="relative overflow-hidden border-b border-black/20 px-5 pb-16 pt-16 md:px-8 md:pb-20 md:pt-20 lg:px-12">
        <div className="editorial-noise absolute inset-0 opacity-15" />
        <div className="relative mx-auto max-w-[1600px]">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <p className="editorial-kicker">CATALOG / APPROVED FOR SALE</p>
              <h1 className="mt-7 max-w-6xl text-[clamp(4.5rem,10vw,10rem)] font-black uppercase leading-[.78] tracking-[-.08em]">
                Choose the
                <span className="block">system you need.</span>
              </h1>
            </div>
            <div className="border-t border-black/20 pt-6 lg:mb-2">
              <p className="max-w-lg text-base leading-7 text-black/55">
                Browse the current sellable Digital Swarm catalog. Each product page states the included files, requirements and license before checkout.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 font-mono text-[9px] font-black uppercase tracking-[.16em] text-black/45">
                <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#725cff]" /> Server-checked price</span>
                <span className="flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5 text-[#725cff]" /> Private paid access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f1eee6] px-5 py-14 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-black/20 pb-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#725cff]">LIVE CATALOG VIEW</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[-.045em] md:text-5xl">
                {activeCategory === "All" ? "All approved products" : activeCategory}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-black/45">
              <Search className="h-4 w-4" />
              {isLoading || isSearching ? "Updating results…" : `${filteredProducts.length} result${filteredProducts.length === 1 ? "" : "s"}`}
            </div>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
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

            <main className="min-w-0 flex-1">
              {isLoading || isSearching ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="overflow-hidden border border-black/15 bg-white/25">
                      <div className="aspect-[4/3] animate-pulse bg-black/5" />
                      <div className="space-y-4 p-6"><div className="h-3 w-1/3 bg-black/10" /><div className="h-7 w-4/5 bg-black/10" /><div className="h-4 w-full bg-black/5" /></div>
                    </div>
                  ))}
                </div>
              ) : (
                <ProductGrid products={filteredProducts} listName={isNeural ? "products_smart_relevance" : `products_${activeCategory.toLowerCase().replace(/\s+/g, "_")}`} />
              )}
            </main>
          </div>

          <section className="mt-16 grid border border-black/20 md:grid-cols-3">
            <Fact label="Sellable catalog" value={isLoading ? "—" : String(rawProducts.length)} note="Products returned by the approved public catalog endpoint." />
            <Fact label="Paid delivery" value="Private" note="Eligible verified orders receive time-limited access." />
            <Fact label="Popularity data" value="Not fabricated" note="No invented stock pressure, sales counts or rating scores." />
          </section>

          {comparisonProducts.length > 0 && (
            <section className="mt-16 border-t border-black/20 pt-10">
              <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <p className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#725cff]">QUICK COMPARE</p>
                  <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.04em]">First three current results.</h2>
                </div>
                <p className="max-w-sm text-xs leading-5 text-black/45">This comparison follows your current filter order; it is not a popularity ranking.</p>
              </div>
              <div className="overflow-x-auto border border-black/20">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-[#151515] text-[#f1eee6]">
                    <tr className="font-mono text-[9px] uppercase tracking-[.17em]">
                      <th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonProducts.map((product) => (
                      <tr key={product.id} className="border-t border-black/15 text-sm">
                        <td className="px-5 py-5 font-black uppercase tracking-[-.02em]">{product.name}</td>
                        <td className="px-5 py-5 text-black/55">{product.category}</td>
                        <td className="px-5 py-5 font-bold">₹{product.price.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-5"><Link href={`/product/${product.id}`} className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[.13em] text-[#725cff]">View <ArrowRight className="h-3.5 w-3.5" /></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="border-b border-black/20 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">{label}</span>
      <h3 className="mt-3 text-2xl font-black uppercase tracking-[-.04em]">{value}</h3>
      <p className="mt-2 text-xs leading-5 text-black/45">{note}</p>
    </article>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={null}><ProductsContent /></Suspense>;
}
