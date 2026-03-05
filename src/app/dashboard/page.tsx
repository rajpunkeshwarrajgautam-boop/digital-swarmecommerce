"use client";

import { useUser, RedirectToSignIn } from "@clerk/nextjs";
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

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [licenses, setLicenses] = useState<CustomerLicense[]>([]);
  const [loadingLicenses, setLoadingLicenses] = useState(true);

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
    fetchLicenses();
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

        <div className="space-y-6">
          {loadingLicenses ? (
            <div className="text-center py-12 text-muted-foreground border border-border rounded-2xl bg-secondary/10">
               Deciphering license vectors...
            </div>
          ) : licenses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-border rounded-2xl bg-secondary/10">
              No assets found in your secure vault.
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
              </div>
              
              <div className="flex flex-col gap-3 shrink-0 mt-4 md:mt-0">
                <Button className="w-full md:w-auto h-12 flex items-center justify-center gap-2 border-none bg-linear-to-r from-primary to-green-500 text-black shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                  <Download className="w-4 h-4" /> Download Asset
                </Button>
                {purchase.licenseType.includes("Whitelabel") && (
                  <Button variant="outline" className="w-full md:w-auto text-purple-500 border-purple-500/30 hover:bg-purple-500/10">
                    Resell Guidelines <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

            </div>
          ))}
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
