"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Copy, Download, Key, Package, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface CustomerLicense {
  id: string;
  productName: string;
  date: string;
  licenseType: string;
  licenseKey: string;
  downloadUrl: string;
}

interface Order {
  id: string;
  cashfree_order_id?: string;
  created_at: string;
  status: string;
  total: number;
  order_items?: Array<{
    product_id: string;
    price: number;
    quantity: number;
  }>;
}

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [licenses, setLicenses] = useState<CustomerLicense[]>([]);
  const [loadingLicenses, setLoadingLicenses] = useState(true);
  const [activeTab, setActiveTab] = useState<"assets" | "orders">("assets");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchLicenses() {
      try {
        if (!isSignedIn) return;
        const res = await fetch("/api/user/licenses");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setLicenses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLicenses(false);
      }
    }

    async function fetchOrders() {
      try {
        if (!isSignedIn) return;
        const res = await fetch("/api/user/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchLicenses();
    fetchOrders();
  }, [isSignedIn]);

  useEffect(() => {
    if (copiedKey) {
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }, [copiedKey]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">My Assets</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure Digital Vault for {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <div className="bg-secondary/30 border border-border px-6 py-4 rounded-xl text-center min-w-[200px]">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">Total Assets</p>
            <p className="text-3xl font-black text-primary">{loadingLicenses ? "..." : licenses.length}</p>
          </div>
        </div>

        {/* Tabs for Assets / Orders */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button 
            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === "assets" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
            onClick={() => setActiveTab("assets")}
          >
            My Assets
          </button>
          <button 
            className={`pb-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
            onClick={() => setActiveTab("orders")}
          >
            Recent Orders
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "assets" && (
            loadingLicenses ? (
              <div className="text-center py-12 text-muted-foreground border border-border rounded-2xl bg-secondary/10">
                 Deciphering license vectors...
              </div>
            ) : licenses.length === 0 ? (
              <div className="text-center py-20 px-6 border border-dashed border-primary/20 rounded-3xl bg-primary/5 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Package className="w-10 h-10 text-primary opacity-50" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-2">Initialize Your Swarm</h3>
                  <p className="text-muted-foreground mb-8">
                    Your secure digital vault is currently empty. Start building your ecosystem with our elite AI agents and developer kits.
                  </p>
                  <Link href="/products">
                    <Button size="lg" className="w-full md:w-auto gap-2">
                       Explore The Hive <Package className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : licenses.map((purchase) => (
              <div key={purchase.id} className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
                
                {/* License Type Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-lg text-white ${
                  purchase.licenseType.includes("Whitelabel") ? "bg-purple-500" : "bg-zinc-800"
                }`}>
                  {purchase.licenseType}
                </div>

                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border">
                  <Package className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold">{purchase.productName}</h3>
                  <p className="text-sm text-muted-foreground font-mono">Purchased: {purchase.date}</p>
                  
                  {/* Secure JWT License Key */}
                  <div className="mt-4 bg-black border border-zinc-800 rounded-lg p-3 flex items-center justify-between gap-4 overflow-hidden group/key">
                    <div className="flex items-center gap-2 text-zinc-400 overflow-hidden">
                      <Key className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-mono truncate select-all">{purchase.licenseKey}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(purchase.licenseKey)}
                      className="shrink-0 p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white"
                    >
                      {copiedKey === purchase.licenseKey ? (
                        <span className="text-xs font-bold text-green-400">Copied!</span>
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1 italic">
                    <ShieldCheck className="w-3 h-3" /> Use this key to activate your agent in the terminal or config.env
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 shrink-0 mt-4 md:mt-0">
                  <Button 
                    onClick={() => purchase.downloadUrl !== "#" ? window.open(purchase.downloadUrl, "_blank") : alert("Processing payload... Download link will be active shortly.")}
                    className="w-full md:w-auto h-12 flex items-center justify-center gap-2 border-none bg-linear-to-r from-primary to-green-500 text-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Asset
                  </Button>
                  {purchase.licenseType.includes("Whitelabel") && (
                    <Button variant="outline" className="w-full md:w-auto text-purple-500 border-purple-500/30 hover:bg-purple-500/10">
                      Resell Guidelines <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

              </div>
            ))
          )}

          {activeTab === "orders" && (
            loadingOrders ? (
              <div className="text-center py-12 text-muted-foreground border border-border rounded-2xl bg-secondary/10">
                 Fetching order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-border rounded-2xl bg-secondary/10">
                No recent orders found.
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
                 {/* Order Status Badge */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-lg text-white ${
                  order.status === "paid" || order.status === "success" || order.status === "ACTIVE" ? "bg-emerald-500" : "bg-orange-500"
                }`}>
                  {order.status}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-mono">Order: {order.cashfree_order_id || order.id?.split('-')[0].toUpperCase()}</h3>
                    <p className="text-sm text-muted-foreground font-mono">Timestamp: {new Date(order.created_at).toLocaleString()}</p>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      {order.order_items.map((item: { product_id: string; quantity: number; price: number }, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs font-mono text-muted-foreground">
                          <span className="truncate max-w-[200px]">{item.product_id} × {item.quantity}</span>
                          <span className="text-primary/70">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 text-right mt-4 md:mt-0">
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Total</p>
                    <p className="text-2xl font-black text-primary">₹{Number(order.total).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Email Funnel Status */}
        <div className="mt-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">
          <div className="p-3 bg-blue-500/20 rounded-full shrink-0 h-fit">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-blue-100">Automated Delivery Active</h4>
            <p className="text-sm text-blue-200/70 mt-1 leading-relaxed">
              Your assets are securely linked to your Clerk identity. Our automated funnel has seamlessly delivered your purchase confirmations and will send priority updates and deployment tips via email over the next 5 days.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
