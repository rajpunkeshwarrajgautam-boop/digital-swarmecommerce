"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Download, History, KeyRound, Package, ShoppingBag } from "lucide-react";
import { getUserAssets, getUserOrders } from "@/app/actions/user-assets";
import { Button } from "@/components/ui/Button";

type Asset = {
  id: string;
  created_at?: string;
  license_key: string;
  license_tier?: string;
  product_id?: string;
  products?: {
    name: string;
    image: string;
    version: string;
    download_url?: string;
  };
};

type Order = {
  id: string;
  status: string;
  cashfree_order_id?: string;
  created_at: string;
  total_amount: number;
};

export default function DashboardPage() {
  const { user } = useUser();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [assetResult, orderResult] = await Promise.all([getUserAssets(), getUserOrders()]);
        if (!active) return;
        if (assetResult.success && assetResult.assets) setAssets(assetResult.assets.slice(0, 4));
        if (orderResult.success && orderResult.orders) setOrders(orderResult.orders.slice(0, 4) as Order[]);
        if (!assetResult.success || !orderResult.success) {
          setError(assetResult.error || orderResult.error || "Some account data could not be loaded.");
        }
      } catch (loadError) {
        console.error("[dashboard] account load failed", loadError);
        if (active) setError("Account data could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-12">
      <header>
        <p className="font-mono text-[10px] font-black uppercase tracking-[.24em] text-primary">Customer account</p>
        <h1 className="mt-3 text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
          Review recorded orders, licence keys and private download links associated with your signed-in email address.
        </p>
      </header>

      {error ? <div className="border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-100">{error}</div> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <AccountMetric icon={Package} label="Licensed assets" value={loading ? "—" : String(assets.length)} />
        <AccountMetric icon={History} label="Recent orders loaded" value={loading ? "—" : String(orders.length)} />
        <AccountMetric icon={KeyRound} label="Account delivery" value="Private links" />
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase italic">Licensed assets</h2>
            <p className="mt-1 text-xs text-white/35">Links are generated for this account and expire automatically.</p>
          </div>
          <Link href="/dashboard/assets"><Button variant="outline">View all assets</Button></Link>
        </div>

        {loading ? (
          <p className="text-sm text-white/30">Loading account assets…</p>
        ) : assets.length === 0 ? (
          <div className="border border-white/8 bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-white/40">No licensed assets were found for this account.</p>
            <Link href="/products" className="mt-5 inline-flex"><Button>Browse products</Button></Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {assets.map((asset) => {
              const product = asset.products;
              return (
                <article key={asset.id} className="flex gap-5 border border-white/8 bg-white/[0.025] p-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-white/5">
                    <Image src={product?.image || "/icon.svg"} alt={product?.name || "Digital Swarm asset"} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-white/85">{product?.name || "Legacy Digital Swarm asset"}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-white/30">{asset.license_tier === "whitelabel" ? "Agency Whitelabel" : "Standard"} licence</p>
                    <div className="mt-4 flex flex-wrap gap-4">
                      {product?.download_url ? (
                        <a href={product.download_url} className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">
                          <Download className="h-4 w-4" /> Download bundle
                        </a>
                      ) : (
                        <a href="mailto:support@digitalswarm.in?subject=Restore%20Digital%20Swarm%20download" className="text-xs font-bold text-amber-200 hover:underline">Request restored link</a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-black uppercase italic">Recent orders</h2>
            <p className="mt-1 text-xs text-white/35">Recorded payment/order status from the commerce database.</p>
          </div>
          <Link href="/dashboard/orders"><Button variant="outline">View order history</Button></Link>
        </div>
        {!loading && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 border border-white/8 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{order.cashfree_order_id || order.id}</p>
                  <p className="mt-1 text-sm text-white/60">{new Date(order.created_at).toLocaleDateString()} · ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}</p>
                </div>
                <span className="w-fit border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/60">{order.status || "unknown"}</span>
              </div>
            ))}
          </div>
        ) : !loading ? <p className="text-sm text-white/30">No recorded orders found.</p> : null}
      </section>

      <Link href="/products" className="inline-flex"><Button><ShoppingBag className="mr-2 h-4 w-4" /> Browse catalog</Button></Link>
    </div>
  );
}

function AccountMetric({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
  return (
    <div className="border border-white/8 bg-white/[0.025] p-5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-4 text-2xl font-black text-white">{value}</div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-[.16em] text-white/30">{label}</div>
    </div>
  );
}
