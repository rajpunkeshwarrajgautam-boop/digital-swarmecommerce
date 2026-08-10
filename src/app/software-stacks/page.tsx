"use client";

import { motion } from "framer-motion";
import { Code2, PackageCheck, FileCode2, ShieldCheck } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { products } from "@/lib/data";
import { isSellableProductId, sanitizePublicProduct } from "@/lib/catalog-integrity";

const STACK_CATEGORIES = new Set(["Boilerplates", "Source Code", "Web Development", "SaaS"]);

export default function SoftwareStacksPage() {
  const stackProducts = products
    .filter((product) => product.inStock && isSellableProductId(product.id) && STACK_CATEGORIES.has(product.category))
    .map(sanitizePublicProduct);

  return (
    <main className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-primary/10 text-primary border border-primary/20"><Code2 className="w-8 h-8" /></div><span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Software assets</span></div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] max-w-4xl">Software <span className="text-primary">Stacks & Kits</span></h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">Browse approved code-oriented and SaaS-related digital products. Frameworks and integrations vary by SKU, so the individual product page—not this category page—is the source of truth for what is included.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <StackFeature icon={PackageCheck} title="Verified deliverable" desc="The fulfillment asset must exist in private storage before the SKU remains sellable." />
            <StackFeature icon={FileCode2} title="Per-product stack" desc="Technology claims come from the specific product listing rather than a blanket site-wide stack promise." />
            <StackFeature icon={ShieldCheck} title="Server-validated checkout" desc="Checkout recalculates SKU price and availability before creating the payment order." />
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-8"><h2 className="text-3xl font-black tracking-tighter">Available software products</h2><span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{stackProducts.length} listings</span></div>
          {stackProducts.length ? <ProductGrid products={stackProducts} /> : <div className="p-12 border border-white/10 text-white/40">No verified software-stack products are currently available.</div>}
        </section>
      </div>
    </main>
  );
}

function StackFeature({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return <div className="p-6 bg-white border border-secondary/5 hover:border-primary/20 transition-all flex flex-col gap-3"><Icon className="w-6 h-6 text-primary" /><h3 className="font-black uppercase text-sm tracking-tight">{title}</h3><p className="text-xs text-muted-foreground font-bold leading-relaxed">{desc}</p></div>;
}
