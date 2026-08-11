"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, Mail, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { trackPurchase } from "@/components/analytics/FBPixel";
import { trackPurchaseEvent } from "@/lib/web-analytics";

interface VerificationResult {
  success?: boolean;
  isPaid?: boolean;
  status?: string;
  orderId?: string;
  amount?: number;
  itemCount?: number;
  licensedItems?: number;
  fulfillment?: "complete" | "processing";
  error?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id")?.trim() || "";
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const purchaseTracked = useRef(false);

  useEffect(() => {
    async function verify() {
      if (!orderId) {
        setResult({ error: "Missing order ID." });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = (await res.json()) as VerificationResult;
        setResult(data);

        if (res.ok && data.isPaid && !purchaseTracked.current) {
          purchaseTracked.current = true;
          const amount = Number(data.amount || 0);
          trackPurchase(amount, data.orderId || orderId);
          trackPurchaseEvent(amount, data.orderId || orderId, []);
          try {
            localStorage.removeItem("last_purchase");
            localStorage.removeItem("last_purchase_value");
          } catch {}
        }
      } catch {
        setResult({ error: "We could not reach the payment verification service." });
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-xl w-full text-center border border-white/10 bg-white/[0.03] rounded-3xl p-12">
        <div className="w-14 h-14 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-2">Verifying payment</h1>
        <p className="text-white/40 text-sm">Digital Swarm is checking the order directly with Cashfree.</p>
      </div>
    );
  }

  if (!result?.isPaid) {
    return (
      <div className="max-w-xl w-full text-center border border-red-500/20 bg-red-500/[0.05] rounded-3xl p-12">
        <AlertTriangle className="w-14 h-14 text-red-400 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white mb-3">Payment not confirmed</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          {result?.error || `Cashfree currently reports ${result?.status || "an unconfirmed status"}. No paid download is exposed until the payment is verified.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="px-6 py-3 rounded-full border border-white/10 text-white hover:border-primary/40">Return to products</Link>
          <a href="mailto:support@digitalswarm.in" className="px-6 py-3 rounded-full bg-primary text-black font-bold">Contact support</a>
        </div>
      </div>
    );
  }

  const complete = result.fulfillment === "complete" && Number(result.licensedItems || 0) >= Number(result.itemCount || 0);

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="border border-primary/25 bg-primary/[0.06] rounded-3xl p-8 sm:p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
        <p className="text-[10px] uppercase tracking-[0.35em] text-primary font-black mb-3">Cashfree verified</p>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-5">Payment confirmed</h1>
        <p className="text-white/50 leading-relaxed max-w-xl mx-auto">
          Your order is paid. Paid assets are delivered through private, expiring storage links rather than public website URLs.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <InfoCard label="Order" value={result.orderId || orderId} />
        <InfoCard label="Amount" value={`₹${Number(result.amount || 0).toLocaleString("en-IN")}`} />
        <InfoCard label="Items" value={String(result.itemCount || 0)} />
      </div>

      <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-8 flex flex-col sm:flex-row gap-5 items-start">
        {complete ? <Mail className="w-8 h-8 text-primary shrink-0" /> : <Clock3 className="w-8 h-8 text-amber-300 shrink-0" />}
        <div>
          <h2 className="text-xl font-black text-white mb-2">{complete ? "Private delivery prepared" : "Delivery is processing"}</h2>
          <p className="text-sm text-white/45 leading-relaxed">
            {complete
              ? "A license record has been created for each paid item. The fulfillment service sends private download links to the checkout email when email delivery is configured."
              : "Your payment is confirmed, but one or more fulfillment steps are still completing. Do not pay again. If the email does not arrive, contact support with the order ID above."}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/dashboard" className="px-7 py-4 rounded-full bg-primary text-black font-black text-center">Open customer dashboard</Link>
        <a href="mailto:support@digitalswarm.in" className="px-7 py-4 rounded-full border border-white/10 text-white text-center hover:border-primary/40">Delivery support</a>
        <Link href="/products" className="px-7 py-4 rounded-full border border-white/10 text-white text-center hover:border-primary/40">Continue shopping</Link>
      </div>

      <div className="flex items-start gap-3 text-xs text-white/30 max-w-2xl mx-auto">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p>Digital Swarm does not expose paid asset URLs from local storage, query parameters, or public download folders on this page.</p>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-5 min-w-0">
      <div className="text-[9px] uppercase tracking-[0.25em] text-white/25 mb-2">{label}</div>
      <div className="text-sm font-bold text-white break-all">{value}</div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-32">
      <Suspense fallback={<div className="text-white/40">Loading order…</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
