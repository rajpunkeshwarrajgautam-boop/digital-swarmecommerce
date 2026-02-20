"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to empty or handled by UI
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catalog</h1>
          <p className="text-muted-foreground">Explore our collection of future-tech.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <select 
            className="px-4 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24">Loading products...</div>
      ) : (
        <>
          <ProductGrid products={filteredProducts} />
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-24 text-muted-foreground">
              No products found matching your criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
}
