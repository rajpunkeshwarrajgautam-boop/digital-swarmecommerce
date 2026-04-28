"use client";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { Package, TrendingUp, CheckCircle2, Plus, BarChart3, ShieldCheck, Globe, Database } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { AgentTaskTracker } from "@/components/merchant/AgentTaskTracker";
import { getMerchantPayouts } from "@/app/actions/payouts";

interface MerchantProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  sales?: number;
  merchant_id: string;
  is_verified: boolean;
}

interface MerchantStats {
  revenue: number;
  salesCount: number;
  syncVelocity: number;
  trustScore: number;
  activeProtocols: number;
}

export default function MerchantDashboard() {
  const { user, isLoaded } = useUser();
  const { data: products, isLoading: productsLoading } = useSwarmSWR<MerchantProduct[]>("/api/products");
  const { data: stats, isLoading: statsLoading } = useSwarmSWR<MerchantStats>("/api/merchant/stats");

  const merchantProducts =
    user?.id && products ? products.filter((p) => p.merchant_id === user.id) : [];

  const isLoading = !isLoaded || productsLoading || statsLoading;

  if (isLoading && !products) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Package className="w-12 h-12 text-[#CCFF00] animate-pulse" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/40 italic">
            Initializing_Merchant_Node...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center gap-8 max-w-lg mx-auto">
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter">Merchant Control</h1>
          <p className="text-gray-400 font-inter text-sm leading-relaxed">
            Sign in to see products where your Clerk user ID matches{" "}
            <span className="text-[#CCFF00] font-mono text-xs">merchant_id</span> in the database. New listings ship
            fastest from the dashboard.
          </p>
          <Link href="/sign-in?redirect_url=/merchant">
            <ForgeButton variant="primary" className="h-14 px-10">
              Sign in to continue
            </ForgeButton>
          </Link>
        </main>
        <Footer />
      </>
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
                <div className="px-2 py-0.5 bg-accent/20 border border-accent/40 rounded text-[10px] font-mono font-black text-accent uppercase tracking-widest truncate max-w-[200px]">
                  {user.username || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "Merchant"}
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded text-[10px] font-mono font-black text-[#CCFF00] uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Verified_Partner
                </div>
              </div>
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Merchant Control</h1>
              <p className="text-gray-500 mt-4 max-w-md text-sm font-inter">
                Manage your architectural distributions and monitor the sync velocity of your distributed protocols.
              </p>
            </div>
            <Link href="/merchant/add">
              <ForgeButton variant="primary" className="h-14 px-8">
                <Plus className="w-4 h-4 mr-2" /> Add_New_Product
              </ForgeButton>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              icon={<TrendingUp className="text-[#CCFF00]" />} 
              label="Sync Velocity" 
              value={stats ? `${stats.syncVelocity}%` : "0%"} 
              sub="LIFT_REALTIME" 
            />
            <StatsCard 
              icon={<Package className="text-cyan-400" />} 
              label="Active Protocols" 
              value={stats ? stats.activeProtocols.toString() : merchantProducts.length.toString()} 
              sub="NODE_ALPHA" 
            />
            <StatsCard 
              icon={<BarChart3 className="text-purple-400" />} 
              label="Total Revenue" 
              value={stats ? `₹${stats.revenue}` : "₹0"} 
              sub="DYNAMIC_AGGREGATION" 
            />
            <StatsCard 
              icon={<CheckCircle2 className="text-blue-400" />} 
              label="Trust Integrity" 
              value={stats ? `${stats.trustScore}%` : "0%"} 
              sub="REPUTATION_SCORE" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content: Products */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic">{"/// YOUR_DISTRIBUTED_STRIKES ///"}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {merchantProducts.length === 0 && (
                  <GlassCard className="p-10 text-center space-y-4 border-dashed border-white/20">
                    <p className="text-white/60 font-inter text-sm">
                      No live listings for your account yet. Publish a product with your merchant ID, or apply to join
                      the partner program.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Link href="/merchant/add">
                        <ForgeButton variant="primary" className="h-12 px-6">
                          <Plus className="w-4 h-4 mr-2" /> Add product
                        </ForgeButton>
                      </Link>
                      <Link href="/merchant/apply">
                        <ForgeButton variant="ghost" className="h-12 px-6 border border-white/10">
                          Partner application
                        </ForgeButton>
                      </Link>
                    </div>
                  </GlassCard>
                )}
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
                          <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${product.is_verified ? 'text-[#CCFF00]' : 'text-gray-500'}`}>
                            {product.is_verified ? (
                              <><CheckCircle2 className="w-3 h-3" /> Status: Live</>
                            ) : (
                              <><Package className="w-3 h-3" /> Status: Pending Verification</>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 px-6 border-l border-white/5 md:h-12 w-full md:w-auto">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Share (70%)</span>
                        <span className="font-mono text-sm text-[#CCFF00]">₹{(product.price * 0.7).toFixed(0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Sales</span>
                        <span className="font-mono text-sm text-white">{product.sales || 0}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Health</span>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-1 h-3 ${product.is_verified ? 'bg-[#CCFF00]' : 'bg-white/10'}`} />)}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Agent Task Section */}
              <div className="mt-16">
                <AgentTaskTracker />
              </div>
            </div>

            {/* Sidebar: Reputation & Tiers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic">{"/// NODE_REPUTATION ///"}</h3>
              </div>
              
              <GlassCard className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Current_Tier</span>
                    <span className="text-[10px] font-mono font-black text-[#CCFF00] uppercase tracking-widest bg-[#CCFF00]/10 px-2 py-0.5 rounded">CORE_LEVEL</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '70%' }}
                      className="h-full bg-[#CCFF00] shadow-[0_0_10px_#CCFF00]"
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 italic font-inter text-pretty">Sync 10 more protocols to reach PRIME_LEVEL.</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <TierRow label="Initiate" rate="40% Fee" status="COMPLETED" active={false} />
                  <TierRow label="Core" rate="30% Fee" status="ACTIVE" active={true} />
                  <TierRow label="Prime" rate="20% Fee" status="LOCKED" active={false} />
                </div>

                <ForgeButton variant="ghost" className="w-full text-[10px] h-10 border-white/5 hover:bg-white/5">
                  View_Fee_Schedule
                </ForgeButton>
              </GlassCard>

              {/* The Vault Quick Link */}
              <GlassCard className="p-6 space-y-4 border-accent/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-black uppercase tracking-widest text-xs text-white">The_Vault</h3>
                  <Database className="w-4 h-4 text-accent" />
                </div>
                <p className="text-[10px] text-gray-500 font-inter">Access your cryptographically sealed commission ledger and request settlements.</p>
                <Link href="/merchant/ledger" className="block">
                  <ForgeButton variant="ghost" className="w-full text-[10px] h-10 border-accent/20 hover:bg-accent/5 text-accent">
                    Open_Ledger_Vault
                  </ForgeButton>
                </Link>
              </GlassCard>

              {/* Network Pulse Widget */}
              <GlassCard className="p-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Network_Uplink</span>
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-tighter">Latency: 24ms | Status: Nominal</span>
                </div>
                <Globe className="w-4 h-4 text-white/10 ml-auto" />
              </GlassCard>
            </div>
          </div>

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

function TierRow({ label, rate, status, active }: { label: string, rate: string, status: string, active: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border ${active ? 'bg-[#CCFF00]/5 border-[#CCFF00]/20' : 'bg-transparent border-white/5'}`}>
      <div className="flex flex-col">
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-white/40'}`}>{label}</span>
        <span className="text-[8px] font-mono text-gray-500 uppercase">{rate}</span>
      </div>
      <span className={`text-[8px] font-mono font-black italic uppercase ${active ? 'text-[#CCFF00]' : 'text-white/20'}`}>{status}</span>
    </div>
  );
}
