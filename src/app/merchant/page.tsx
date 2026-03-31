"use client";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { Package, TrendingUp, CheckCircle2, Plus, BarChart3, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface MerchantProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  sales: number;
  merchantId: string;
}

export default function MerchantDashboard() {
  const { data: products, isLoading } = useSwarmSWR<MerchantProduct[]>('/api/products');
  
  const merchantProducts = products?.filter(p => p.merchantId === "SYSTEM") || [];

  if (isLoading && !products) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Package className="w-12 h-12 text-[#CCFF00] animate-pulse" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/40 italic">Initializing_Merchant_Node...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="px-2 py-0.5 bg-accent/20 border border-accent/40 rounded text-[10px] font-mono font-black text-accent uppercase tracking-widest">Node_Alpha_7</div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded text-[10px] font-mono font-black text-[#CCFF00] uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Verified_Partner
                </div>
              </div>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Merchant Control</h1>
              <p className="text-gray-500 mt-4 max-w-md text-sm font-inter">
                Manage your architectural distributions and monitor the sync velocity of your distributed protocols.
              </p>
            </div>
            <ForgeButton variant="primary" className="h-14 px-8">
              <Plus className="w-4 h-4 mr-2" /> Propose_New_Protocol
            </ForgeButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={<TrendingUp className="text-[#CCFF00]" />} label="Sync Velocity" value="84%" sub="LIFT_+12%" />
            <StatsCard icon={<Package className="text-cyan-400" />} label="Active Protocols" value={merchantProducts.length.toString()} sub="NODE_ALPHA" />
            <StatsCard icon={<BarChart3 className="text-purple-400" />} label="Gross Distribution" value="₹24.8K" sub="REVENUE_REALIZED" />
            <StatsCard icon={<CheckCircle2 className="text-blue-400" />} label="Trust Integrity" value="99.2" sub="REPUTATION_SCORE" />
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic">/// YOUR_DISTRIBUTED_STRIKES ///</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {merchantProducts.map((product) => (
                <GlassCard key={product.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#CCFF00]/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 relative overflow-hidden rounded-lg">
                      <Image 
                        src={product.image} 
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all" 
                        alt={product.name} 
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-black italic uppercase text-white leading-tight">{product.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{product.category}</span>
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#CCFF00] uppercase tracking-widest">
                          <CheckCircle2 className="w-3 h-3" /> Status: Live
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 px-6 border-l border-white/5 md:h-12 w-full md:w-auto">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Revenue</span>
                      <span className="font-mono text-sm text-white">₹{product.price}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Syncs</span>
                      <span className="font-mono text-sm text-white">{product.sales || 0}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Health</span>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-[#CCFF00]" />)}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

function StatsCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <div className="bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-4 text-gray-400">
        {icon}
        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em]">{label}</h3>
      </div>
      <div className="space-y-1">
        <span className="text-4xl font-black text-white italic tracking-tighter">{value}</span>
        <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">{sub}</div>
      </div>
    </div>
  );
}
