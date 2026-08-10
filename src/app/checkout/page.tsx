"use client";

import { useCartStore } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Mail, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useToastStore } from "@/components/ui/ForgeToast";
import { ForgeErrorBoundary } from "@/components/ui/ForgeErrorBoundary";
import { trackInitiateCheckout } from "@/components/analytics/FBPixel";
import { trackBeginCheckout } from "@/lib/web-analytics";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type CheckoutResponse = {
  success?: boolean;
  orderId?: string;
  paymentSessionId?: string;
  cfMode?: string;
  currency?: string;
  amount?: number;
  error?: string;
  code?: string;
  message?: string;
};

export default function CheckoutPage() {
  return (
    <ForgeErrorBoundary>
      <CheckoutContent />
    </ForgeErrorBoundary>
  );
}

function CheckoutContent() {
  const { items, getCartTotal } = useCartStore();
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const localTotal = getCartTotal();
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/products");
  }, [mounted, items.length, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateCustomer = () => {
    const next: Record<string, string> = {};
    if (!formData.firstName.trim()) next.firstName = "Enter your first name.";
    const email = formData.email.trim().toLowerCase();
    if (!email) next.email = "Enter the email where your private download should be delivered.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";

    const digits = formData.phone.replace(/\D/g, "");
    if (!digits) next.phone = "Enter a phone number for the payment gateway.";
    else if (digits.length < 10 || digits.length > 15) next.phone = "Enter a valid phone number.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCashfreePayment = async () => {
    if (!validateCustomer() || isProcessing) return;
    setIsProcessing(true);

    trackInitiateCheckout(localTotal);
    trackBeginCheckout(
      localTotal,
      items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    );

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
          customer: formData,
        }),
      });
      window.clearTimeout(timeoutId);

      const data = (await response.json()) as CheckoutResponse;
      if (!response.ok || data.error) {
        const code = data.code ? ` (${data.code})` : "";
        throw new Error(`${data.error || "Unable to create payment order"}${code}`);
      }
      if (!data.paymentSessionId || !data.orderId || data.currency !== "INR" || !Number.isFinite(data.amount)) {
        throw new Error("The payment gateway returned an incomplete order. Please retry.");
      }

      if (Number(data.amount) !== Number(localTotal)) {
        throw new Error("Catalog pricing changed before checkout. Return to the cart, refresh it, and try again.");
      }

      const mode = data.cfMode === "production" ? "production" : "sandbox";
      const cashfree = await loadCashfree({ mode });
      if (!cashfree) throw new Error("Cashfree checkout could not be loaded. Please retry.");

      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      window.clearTimeout(timeoutId);
      const message =
        error instanceof Error && error.name === "AbortError"
          ? "The payment gateway took too long to respond. Please retry."
          : error instanceof Error
            ? error.message
            : "Unable to initialize checkout.";
      addToast("ERROR", "CHECKOUT ERROR", message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <main className="min-h-screen bg-[#07070b] pb-28 pt-36 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[650px] bg-[radial-gradient(circle_at_50%_0%,rgba(216,179,106,.10),transparent_60%)]" />

      <div className="container relative z-10 mx-auto max-w-6xl px-6">
        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-white/45 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>

        <div className="mb-12 max-w-3xl">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <Lock className="h-4 w-4" />
            <span className="font-mono text-[10px] font-black uppercase tracking-[.3em]">Checkout</span>
          </div>
          <h1 className="font-outfit text-5xl font-black uppercase italic tracking-[-.055em] md:text-7xl">
            Confirm your order.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45">
            These are digital products, so no shipping address is required. Your email is used for licensed delivery after Cashfree confirms payment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-9"
          >
            <div className="mb-8 flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-outfit text-xl font-black uppercase">Customer details</h2>
                <p className="mt-1 text-xs text-white/35">Only information required for payment and digital delivery.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                  className="input"
                  placeholder="First name"
                />
              </Field>
              <Field label="Last name (optional)">
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  className="input"
                  placeholder="Last name"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery email" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    className="input"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Phone for payment gateway" error={errors.phone}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    inputMode="tel"
                    className="input"
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <TrustFact icon={CreditCard} title="Cashfree" text="Payment session" />
              <TrustFact icon={ShieldCheck} title="Server checked" text="Price & SKU" />
              <TrustFact icon={CheckCircle2} title="Private ZIP" text="After payment" />
            </div>

            <div className="mt-10 border-t border-white/8 pt-8">
              <ForgeButton
                className="w-full py-7 text-base"
                onClick={handleCashfreePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Opening Cashfree…" : `Pay ${inr.format(localTotal)}`}
              </ForgeButton>
              <p className="mt-4 text-center text-[11px] leading-5 text-white/30">
                By continuing, you agree to the <Link href="/terms" className="underline hover:text-white">Terms</Link> and acknowledge the <Link href="/refund" className="underline hover:text-white">Refund Policy</Link>. Final checkout currency is INR.
              </p>
            </div>
          </motion.section>

          <aside className="h-fit rounded-3xl border border-white/10 bg-[#0d0d12] p-6 lg:sticky lg:top-32">
            <div className="mb-6 flex items-center justify-between border-b border-white/8 pb-5">
              <h2 className="font-outfit text-lg font-black uppercase">Order summary</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/35">{itemCount} item{itemCount === 1 ? "" : "s"}</span>
            </div>

            <div className="max-h-[430px] space-y-5 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-bold leading-5 text-white/80">{item.name}</p>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/35">
                      <span>Qty {item.quantity}</span>
                      <span className="font-bold text-white/70">{inr.format(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-3 border-t border-white/8 pt-6">
              <div className="flex justify-between text-sm text-white/40">
                <span>Catalog subtotal</span>
                <span>{inr.format(localTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/40">
                <span>Shipping</span>
                <span>Not applicable</span>
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-white/8 pt-5">
                <span className="font-outfit text-sm font-black uppercase text-white/50">Amount shown</span>
                <span className="font-outfit text-3xl font-black text-primary">{inr.format(localTotal)}</span>
              </div>
            </div>

            <p className="mt-5 text-[11px] leading-5 text-white/28">
              The server recalculates every SKU and quantity from the approved catalog before it creates the Cashfree order. If the authoritative amount differs from this cart, checkout stops instead of charging a different amount.
            </p>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 14px;
          background: rgba(255,255,255,.025);
          padding: 14px 16px;
          color: white;
          outline: none;
          transition: border-color .2s ease, background .2s ease;
        }
        .input:focus {
          border-color: rgba(216,179,106,.65);
          background: rgba(216,179,106,.035);
        }
        .input::placeholder { color: rgba(255,255,255,.18); }
      `}</style>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

function TrustFact({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CreditCard;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <Icon className="mb-3 h-4 w-4 text-primary" />
      <div className="text-[10px] font-black uppercase tracking-wider text-white/70">{title}</div>
      <div className="mt-1 text-[10px] text-white/30">{text}</div>
    </div>
  );
}
