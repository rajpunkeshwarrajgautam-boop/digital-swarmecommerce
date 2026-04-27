"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, Package, Sparkles, Code, Database, Globe } from "lucide-react";
import Link from "next/link";
import { createMerchantProduct } from "@/app/actions/merchant";
import { motion } from "framer-motion";

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
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      image: formData.get("image") as string,
      category: formData.get("category") as string,
    };

    try {
      await createMerchantProduct(data);
      router.push("/merchant");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to register protocol");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <Link href="/merchant" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#CCFF00] transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back_to_Control_Center
          </Link>

          <div className="space-y-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Protocol Genesis</h1>
            <p className="text-gray-500 max-w-md text-sm font-inter">
              Register a new architectural protocol. Submissions enter the verification queue before global distribution.
            </p>
          </div>

          <GlassCard className="p-8 border-4 border-white/10 rounded-none bg-black/40">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 text-red-500 text-[10px] font-mono font-black uppercase tracking-widest italic">
                  [GENESIS_ERROR]: {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Protocol Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00] italic block">Protocol_Name</label>
                  <input 
                    name="name"
                    required
                    placeholder="E.G. SWARM_CORE_ALPHA"
                    className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all placeholder:text-white/10"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00] italic block">Sector_Category</label>
                  <select 
                    name="category"
                    required
                    className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all appearance-none"
                  >
                    <option value="AI Agents" className="bg-black">AI Agents</option>
                    <option value="Finance & Investment" className="bg-black">Finance & Investment</option>
                    <option value="Marketing AI" className="bg-black">Marketing AI</option>
                    <option value="Web Development" className="bg-black">Web Development</option>
                    <option value="Bundles" className="bg-black">Bundles</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00] italic block">Distribution_Price (INR)</label>
                  <input 
                    name="price"
                    type="number"
                    required
                    placeholder="3499"
                    className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all placeholder:text-white/10"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00] italic block">Visual_Asset_URL</label>
                  <input 
                    name="image"
                    required
                    placeholder="https://example.com/asset.jpg"
                    className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-mono text-sm focus:border-[#CCFF00] outline-none transition-all placeholder:text-white/10"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CCFF00] italic block">Functional_Description</label>
                <textarea 
                  name="description"
                  required
                  rows={4}
                  placeholder="Define the core utility and architecture of this protocol..."
                  className="w-full bg-white/5 border-2 border-white/10 p-4 text-white font-inter text-sm focus:border-[#CCFF00] outline-none transition-all placeholder:text-white/10 resize-none"
                />
              </div>

              <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span className="text-[8px] font-mono uppercase tracking-widest">Global_Sync_Enabled</span>
                </div>
                
                <ForgeButton 
                  type="submit" 
                  disabled={loading}
                  variant="primary" 
                  className="h-16 px-12 w-full md:w-auto text-sm font-black italic uppercase tracking-widest"
                >
                  {loading ? "Initializing_Stream..." : "Initiate_Genesis"}
                </ForgeButton>
              </div>
            </form>
          </GlassCard>

          {/* Technical Requirements Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Requirement icon={<Code />} label="Code Integrity" desc="Protocol must pass static analysis" />
            <Requirement icon={<Database />} label="Data Sync" desc="Metadata must follow Swarm schema" />
            <Requirement icon={<Sparkles />} label="Visual Quality" desc="Assets must meet Planet ONO standards" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Requirement({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 border border-white/5 bg-white/5">
      <div className="text-[#CCFF00] mt-1">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">{label}</h4>
        <p className="text-[9px] text-gray-500 leading-tight font-inter">{desc}</p>
      </div>
    </div>
  );
}
