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
    <div className="container mx-auto px-4 py-24 min-h-[80vh] relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-16 border-b-8 border-black pb-8">
          <div>
            <h1 className="text-5xl md:text-7xl text-white font-black italic tracking-tighter uppercase mb-6 drop-shadow-[4px_4px_0_#CCFF00]">My_Assets</h1>
            <p className="font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2 bg-white text-black border-2 border-black inline-flex px-4 py-2 shadow-[4px_4px_0_#000]">
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
              <span className="truncate">Digital Vault // {user?.primaryEmailAddress?.emailAddress}</span>
            </p>
          </div>
          <div className="bg-[#ffc737] border-4 border-black px-8 py-6 rounded-none text-center min-w-[200px] shadow-[8px_8px_0_#000] rotate-[2deg]">
            <p className="text-xs uppercase tracking-widest text-black/60 font-black mb-1 italic">Total_Allocation</p>
            <p className="text-5xl font-black tracking-tighter text-black">{loadingLicenses ? "..." : licenses.length}</p>
          </div>
        </div>

        {/* Tabs for Assets / Orders */}
        <div className="flex gap-4 border-b-4 border-black mb-12">
          <button 
            className={`px-6 py-4 text-sm font-black uppercase italic tracking-widest border-4 border-b-0 transition-transform translate-y-[4px] ${activeTab === "assets" ? "border-black bg-white text-black shadow-none" : "border-transparent text-white/50 hover:text-white"}`}
            onClick={() => setActiveTab("assets")}
          >
            Terminal_Access
          </button>
          <button 
            className={`px-6 py-4 text-sm font-black uppercase italic tracking-widest border-4 border-b-0 transition-transform translate-y-[4px] ${activeTab === "orders" ? "border-black bg-white text-black shadow-none" : "border-transparent text-white/50 hover:text-white"}`}
            onClick={() => setActiveTab("orders")}
          >
            Order_Logs
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "assets" && (
            loadingLicenses ? (
              <div className="text-center py-24 text-black font-black uppercase tracking-widest italic border-4 border-black bg-[#CCFF00] shadow-[8px_8px_0_#000]">
                 Deciphering_License_Vectors...
              </div>
            ) : licenses.length === 0 ? (
              <div className="text-center py-24 px-6 border-4 border-black bg-white flex flex-col items-center gap-8 shadow-[12px_12px_0_#000]">
                <div className="w-24 h-24 bg-black flex items-center justify-center border-4 border-black text-[#CCFF00] shadow-[4px_4px_0_#CCFF00]">
                  <Package className="w-12 h-12" />
                </div>
                <div className="max-w-md mx-auto text-black">
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Initialize_Swarm</h3>
                  <p className="text-sm font-black italic text-black/60 uppercase tracking-widest mb-10 leading-relaxed">
                    Your secure digital vault is currently empty. Start building your ecosystem with our elite AI agents and developer kits.
                  </p>
                  <Link href="/products">
                    <button className="h-16 px-8 border-4 border-black bg-[#CCFF00] hover:bg-black text-black hover:text-[#CCFF00] font-black uppercase tracking-widest italic text-lg shadow-[6px_6px_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-4 mx-auto">
                       Explore_The_Hive <ArrowRight className="w-6 h-6" />
                    </button>
                  </Link>
                </div>
              </div>
            ) : licenses.map((purchase) => (
              <div key={purchase.id} className="bg-white border-4 border-black p-6 md:p-8 flex flex-col md:flex-row gap-8 md:items-center shadow-[12px_12px_0_#000] relative group">
                
                {/* License Type Badge */}
                <div className={`absolute top-0 right-8 -translate-y-1/2 px-4 py-2 border-2 border-black text-[10px] font-black italic uppercase tracking-widest text-white shadow-[4px_4px_0_#000] ${
                  purchase.licenseType.includes("Whitelabel") ? "bg-[#a855f7]" : "bg-black"
                }`}>
                  {purchase.licenseType}_TIER
                </div>

                <div className="w-24 h-24 bg-black flex items-center justify-center shrink-0 border-4 border-black text-[#ffc737] shadow-[4px_4px_0_#ffc737]">
                  <Package className="w-10 h-10 group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black">{purchase.productName}</h3>
                  <p className="text-xs uppercase tracking-widest text-black/50 font-black italic">Timestamp: {purchase.date}</p>
                  
                  {/* Secure JWT License Key */}
                  <div className="mt-6 bg-[#CCFF00] border-4 border-black p-4 flex items-center justify-between gap-4 shadow-[4px_4px_0_#000] group/key">
                    <div className="flex items-center gap-4 text-black overflow-hidden w-full">
                      <Key className="w-6 h-6 shrink-0" />
                      <span className="text-sm font-black italic tracking-tighter truncate select-all">{purchase.licenseKey}</span>
                    </div>
                    <button 
                      onClick={() => handleCopy(purchase.licenseKey)}
                      className="shrink-0 p-3 hover:bg-black hover:text-[#CCFF00] transition-colors text-black border-2 border-black bg-white"
                    >
                      {copiedKey === purchase.licenseKey ? (
                        <span className="text-[10px] font-black uppercase tracking-widest">OK!</span>
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-black/40 mt-3 flex items-center gap-2 italic">
                    <ShieldCheck className="w-4 h-4" /> Auth_Key_Requirement // Env_Config
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 shrink-0 mt-6 md:mt-0">
                  <button 
                    onClick={() => purchase.downloadUrl !== "#" ? window.open(purchase.downloadUrl, "_blank") : alert("Processing payload... Download link will be active shortly.")}
                    className="h-16 px-6 flex items-center justify-center gap-3 border-4 border-black bg-black text-white hover:bg-white hover:text-black font-black uppercase tracking-widest shadow-[6px_6px_0_#CCFF00] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm italic w-full"
                  >
                    <Download className="w-5 h-5" /> Download_Asset
                  </button>
                  {purchase.licenseType.includes("Whitelabel") && (
                    <button className="h-16 px-6 flex items-center justify-center gap-2 text-black bg-[#a855f7] hover:bg-black hover:text-[#a855f7] font-black uppercase tracking-widest border-4 border-black w-full italic shadow-[4px_4px_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-xs">
                      Resell_Rules <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))
          )}

          {activeTab === "orders" && (
            loadingOrders ? (
              <div className="text-center py-24 text-black font-black uppercase tracking-widest italic border-4 border-black bg-[#ffc737] shadow-[8px_8px_0_#000]">
                 Fetching_Log_Data...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-24 text-black/60 font-black uppercase tracking-widest italic border-4 border-dashed border-black bg-white">
                Null_Stream // No Orders found.
              </div>
            ) : orders.map((order) => (
              <div key={order.id} className="bg-white border-4 border-black p-8 flex flex-col md:flex-row gap-6 md:items-center shadow-[8px_8px_0_#000] relative object-cover">
                 {/* Order Status Tape */}
                <div className={`absolute top-4 right-[-24px] px-8 py-2 border-y-4 border-black text-xs font-black italic uppercase tracking-widest w-48 text-center rotate-[15deg] ${
                  order.status === "paid" || order.status === "success" || order.status === "ACTIVE" ? "bg-[#CCFF00] text-black" : "bg-red-500 text-white"
                }`}>
                  {order.status}
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-black">Log: {order.cashfree_order_id || order.id?.split('-')[0].toUpperCase()}</h3>
                    <p className="text-xs uppercase tracking-widest text-black/50 font-black italic mt-1">Timestamp: {new Date(order.created_at).toLocaleString()}</p>
                  </div>

                  {order.order_items && order.order_items.length > 0 && (
                    <div className="space-y-3 border-t-4 border-black pt-4 pr-16">
                      {order.order_items.map((item: { product_id: string; quantity: number; price: number }, idx: number) => (
                        <div key={idx} className="flex justify-between items-end text-xs font-black uppercase italic tracking-widest text-black">
                          <span className="truncate max-w-[200px]">ID:{item.product_id?.split('-')[0]} <span className="bg-black text-[#ffc737] px-1 ml-2">×{item.quantity}</span></span>
                          <span className="text-black text-lg">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0 md:text-right mt-6 md:mt-0 border-t-4 md:border-t-0 md:border-l-4 border-black pt-6 md:pt-0 md:pl-8">
                    <p className="text-xs text-black/40 font-black uppercase tracking-widest italic mb-2 md:mb-0">Final_Yield</p>
                    <p className="text-4xl font-black text-red-500 italic drop-shadow-[2px_2px_0_#000] tracking-tighter">₹{Number(order.total).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Email Funnel Status */}
        <div className="mt-16 bg-white border-4 border-black shadow-[12px_12px_0_#000] p-8 flex gap-6 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc737] rounded-bl-[100px] -z-10 border-b-4 border-l-4 border-black"></div>
          <div className="p-4 border-4 border-black bg-[#CCFF00] shadow-[4px_4px_0_#000] shrink-0 h-fit mt-1">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <div>
            <h4 className="font-black italic uppercase tracking-tighter text-3xl text-black">Automated_Delivery_Active</h4>
            <p className="text-sm font-black italic uppercase tracking-widest text-black/70 mt-4 leading-relaxed max-w-2xl bg-[#ffc737] border-2 border-black inline-block p-4 shadow-[4px_4px_0_#000]">
              Your assets are securely linked to your identity. The automated funnel has dispatched confirmation protocols and will send priority updates via email relay over the next 5 days.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
