"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, FileCheck2, Image as ImageIcon, PackageCheck } from "lucide-react";
import Link from "next/link";
import { createMerchantProduct } from "@/app/actions/merchant";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: String(formData.get("name") || ""),
      description: String(formData.get("description") || ""),
      price: Number(formData.get("price")),
      image: String(formData.get("image") || ""),
      category: String(formData.get("category") || ""),
    };

    try {
      await createMerchantProduct(data);
      router.push("/merchant");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save product draft.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/merchant" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to merchant workspace
        </Link>

        <div className="space-y-4">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Submit Product Draft</h1>
          <p className="text-gray-500 max-w-xl text-sm font-inter leading-relaxed">
            Save the commercial metadata for review. New merchant submissions are hidden, out of stock, and non-sellable until Digital Swarm verifies the deliverable, licensing, and fulfillment path.
          </p>
        </div>

        <GlassCard className="p-8 border border-white/10 bg-black/40">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="bg-red-500/10 border border-red-500/40 p-4 text-red-300 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="merchant-product-name" className="text-[10px] font-black uppercase tracking-[0.35em] text-primary block">Product name</label>
                <input id="merchant-product-name" name="name" required maxLength={160} placeholder="Product name" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-primary outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label htmlFor="merchant-product-category" className="text-[10px] font-black uppercase tracking-[0.35em] text-primary block">Category</label>
                <select id="merchant-product-category" name="category" required className="w-full bg-zinc-950 border border-white/10 p-4 text-white text-sm focus:border-primary outline-none transition-all">
                  <option value="AI Agents">AI Agents</option>
                  <option value="Finance & Investment">Finance & Investment</option>
                  <option value="Marketing AI">Marketing AI</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Bundles">Bundles</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="merchant-product-price" className="text-[10px] font-black uppercase tracking-[0.35em] text-primary block">Proposed price (INR)</label>
                <input id="merchant-product-price" name="price" type="number" min="1" max="1000000" step="1" required placeholder="3499" className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-primary outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label htmlFor="merchant-product-image" className="text-[10px] font-black uppercase tracking-[0.35em] text-primary block">Cover image URL</label>
                <input id="merchant-product-image" name="image" required maxLength={1000} placeholder="https://..." className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-primary outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="merchant-product-description" className="text-[10px] font-black uppercase tracking-[0.35em] text-primary block">Product description</label>
              <textarea id="merchant-product-description" name="description" required maxLength={5000} rows={6} placeholder="Describe exactly what the buyer receives, dependencies, license scope, and expected setup." className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-primary outline-none transition-all resize-y" />
            </div>

            <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <p className="text-xs text-gray-500 max-w-md">
                Saving this form does not publish a product. An approved downloadable asset and fulfillment mapping are required before sale.
              </p>
              <ForgeButton type="submit" disabled={loading} variant="primary" className="h-14 px-10 w-full md:w-auto text-sm font-black uppercase tracking-widest">
                {loading ? "Saving draft..." : "Save for review"}
              </ForgeButton>
            </div>
          </form>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Requirement icon={<FileCheck2 />} label="Accurate scope" desc="Describe only what the buyer really receives." />
          <Requirement icon={<PackageCheck />} label="Deliverable review" desc="A real downloadable asset must be verified before publication." />
          <Requirement icon={<ImageIcon />} label="Accurate media" desc="Cover art must not misrepresent the shipped product." />
        </div>
      </div>
    </main>
  );
}

function Requirement({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 border border-white/5 bg-white/[0.03]">
      <div className="text-primary mt-1">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">{label}</h4>
        <p className="text-[9px] text-gray-500 leading-relaxed font-inter">{desc}</p>
      </div>
    </div>
  );
}
