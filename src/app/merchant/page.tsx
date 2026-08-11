"use client";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { Package, Plus, CheckCircle2, Clock3, Wallet, FileSearch, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";

interface MerchantProduct {
  id: string;
  name: string;
  description?: string;
  category: string;
  image: string;
  price: number;
  in_stock: boolean;
  is_visible: boolean;
  is_verified: boolean;
  created_at: string;
}

interface MerchantStats {
  listings: number;
  verifiedListings: number;
  publishedListings: number;
  recordedCommission: number;
  pendingCommission: number;
  settledCommission: number;
  paidConversions: number;
  paidConversions7d: number;
}

export default function MerchantDashboard() {
  const { data: products, isLoading: productsLoading, error: productError } = useSwarmSWR<MerchantProduct[]>("/api/merchant/products");
  const { data: stats, isLoading: statsLoading, error: statsError } = useSwarmSWR<MerchantStats>("/api/merchant/stats");
  const loading = productsLoading || statsLoading;

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest mb-4">
              Merchant workspace
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Your Products</h1>
            <p className="text-gray-500 mt-4 max-w-xl text-sm leading-relaxed">
              Create product drafts, see their review/publication status, and inspect commission records. A draft is not sold until its deliverable and fulfillment path are approved.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/merchant/apply"><ForgeButton variant="ghost" className="h-14 px-6 border border-white/10"><FileSearch className="w-4 h-4 mr-2" /> Application</ForgeButton></Link>
            <Link href="/merchant/add"><ForgeButton variant="primary" className="h-14 px-8"><Plus className="w-4 h-4 mr-2" /> New draft</ForgeButton></Link>
          </div>
        </div>

        {(productError || statsError) && (
          <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            Some merchant data could not be loaded. Refresh or contact support@digitalswarm.in if this persists.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Product drafts" value={loading ? "—" : String(stats?.listings ?? 0)} sub="Owned database records" icon={<Package className="w-5 h-5" />} />
          <StatsCard label="Published" value={loading ? "—" : String(stats?.publishedListings ?? 0)} sub={`${stats?.verifiedListings ?? 0} verified`} icon={<CheckCircle2 className="w-5 h-5" />} />
          <StatsCard label="Paid conversions" value={loading ? "—" : String(stats?.paidConversions ?? 0)} sub={`${stats?.paidConversions7d ?? 0} recorded in last 7 days`} icon={<ExternalLink className="w-5 h-5" />} />
          <StatsCard label="Recorded commission" value={loading ? "—" : `₹${Number(stats?.recordedCommission ?? 0).toLocaleString('en-IN')}`} sub={`₹${Number(stats?.pendingCommission ?? 0).toLocaleString('en-IN')} pending`} icon={<Wallet className="w-5 h-5" />} />
        </div>

        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-black uppercase tracking-widest text-sm text-white/40">Product review queue</h2>
            <Link href="/merchant/payouts" className="text-xs text-primary hover:underline">Commission ledger</Link>
          </div>

          {productsLoading ? (
            <GlassCard className="p-12 text-center text-sm text-white/30">Loading your product records…</GlassCard>
          ) : !products?.length ? (
            <GlassCard className="p-10 text-center space-y-5 border-dashed border-white/20">
              <Package className="w-10 h-10 text-white/20 mx-auto" />
              <div>
                <h3 className="text-xl font-black text-white mb-2">No product drafts yet</h3>
                <p className="text-sm text-white/40 max-w-lg mx-auto">Create a draft after submitting your merchant application. It stays private until reviewed.</p>
              </div>
              <Link href="/merchant/add"><ForgeButton variant="primary">Create product draft</ForgeButton></Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => {
                const published = product.is_verified && product.is_visible && product.in_stock;
                return (
                  <GlassCard key={product.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="relative w-20 h-20 bg-white/5 border border-white/10 rounded-xl overflow-hidden shrink-0">
                        <Image src={product.image} fill className="object-cover" alt={product.name} sizes="80px" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-white truncate">{product.name}</h3>
                        <p className="text-xs text-white/35 mt-1">{product.category} · ₹{Number(product.price).toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-white/20 mt-2">Draft ID: {product.id}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <StatusChip active={product.is_verified} activeText="Verified" inactiveText="Review pending" />
                      <StatusChip active={published} activeText="Published" inactiveText="Not public" />
                      {!product.is_verified && <span className="inline-flex items-center gap-1 text-[10px] text-amber-300/70"><Clock3 className="w-3 h-3" /> Manual review required</span>}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </section>

        <div className="p-6 border border-white/10 bg-white/[0.03] text-sm text-white/45 leading-relaxed">
          Merchant submissions are not part of the public storefront registry automatically. Digital Swarm must verify the actual asset, buyer-facing description, license and fulfillment path before publication.
        </div>
      </div>
    </main>
  );
}

function StatsCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 border border-white/10 p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4 text-primary">{icon}<h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</h3></div>
      <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
      <div className="text-[9px] text-gray-600 mt-2 uppercase tracking-widest">{sub}</div>
    </div>
  );
}

function StatusChip({ active, activeText, inactiveText }: { active: boolean; activeText: string; inactiveText: string }) {
  return <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${active ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5 text-white/35'}`}>{active ? activeText : inactiveText}</span>;
}
