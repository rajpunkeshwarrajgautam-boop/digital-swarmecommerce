"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { Product } from "@/lib/types";
import { AIAnalyst } from "@/components/forge/AIAnalyst";
import { QuantumProductView } from "@/components/products/QuantumProductView";
import { ReviewSystem } from "@/components/products/ReviewSystem";
import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { trackViewContent } from "@/components/analytics/FBPixel";
import { trackViewItem } from "@/lib/web-analytics";

function plainTextFromMd(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, isLoading: loading, error: swrError } = useSwarmSWR<Product>(slug ? `/api/products/${slug}` : null);
  const error = swrError?.message || "";
  const pixelFired = useRef(false);
  const [reviewStats, setReviewStats] = useState<{ count: number; avg: number } | null>(null);

  useEffect(() => {
    pixelFired.current = false;
  }, [slug]);

  useEffect(() => {
    if (product && !pixelFired.current) {
      trackViewContent(product.name, product.price, "INR", product.id);
      trackViewItem({ id: product.id, name: product.name, price: product.price, category: product.category });
      pixelFired.current = true;
    }
  }, [product, slug]);

  useEffect(() => {
    if (!product?.id) {
      setReviewStats(null);
      return;
    }

    let cancelled = false;
    setReviewStats(null);
    (async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${product.id}`);
        const data = await response.json();
        if (cancelled) return;
        if (!Array.isArray(data) || data.length === 0) {
          setReviewStats({ count: 0, avg: 0 });
          return;
        }
        const sum = data.reduce((acc: number, review: { rating?: number }) => acc + (Number(review.rating) || 0), 0);
        setReviewStats({ count: data.length, avg: sum / data.length });
      } catch {
        if (!cancelled) setReviewStats({ count: 0, avg: 0 });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  const productJsonLd = useMemo(() => {
    if (!product) return null;
    const base: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.image,
      description: plainTextFromMd(product.description),
      sku: product.id,
      brand: { "@type": "Brand", name: "Digital Swarm" },
      offers: {
        "@type": "Offer",
        url: `https://digitalswarm.in/product/${product.id}`,
        priceCurrency: "INR",
        price: product.price,
        availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    };

    if (reviewStats && reviewStats.count > 0) {
      base.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Math.min(5, Math.max(1, Math.round(reviewStats.avg * 10) / 10)),
        reviewCount: reviewStats.count,
      };
    }
    return base;
  }, [product, reviewStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1eee6] px-5 py-20 text-[#151515] md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] animate-pulse gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-square border border-black/15 bg-[#d9d0ff]/45" />
          <div className="space-y-6 py-4">
            <div className="h-3 w-1/4 bg-black/10" />
            <div className="h-24 w-full bg-black/10" />
            <div className="h-12 w-1/3 bg-black/10" />
            <div className="h-40 w-full bg-black/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f1eee6] px-5 text-center text-[#151515]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/20"><AlertCircle className="h-7 w-7 text-[#725cff]" /></div>
        <p className="editorial-kicker mt-7">CATALOG / UNAVAILABLE</p>
        <h1 className="mt-5 text-5xl font-black uppercase tracking-[-.06em] md:text-7xl">Product not found.</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-black/50">{error || "The requested item is currently unavailable."}</p>
        <Link href="/products" className="editorial-button editorial-button-dark mt-8"><ArrowLeft className="h-4 w-4" /> Back to catalog</Link>
      </div>
    );
  }

  const downloadPath = product.downloadUrl ?? "";
  const deliveryLabel = downloadPath.endsWith(".zip")
    ? "Private ZIP bundle"
    : downloadPath.endsWith(".html")
      ? "Interactive HTML asset"
      : downloadPath.endsWith(".pdf")
        ? "PDF guide / document"
        : "Digital asset package";
  const cleanDescription = plainTextFromMd(product.description);
  const hasDeploymentGuide = product.description.includes("🚀 DEPLOYMENT GUIDE:");
  const [descriptionIntro, deploymentGuide] = hasDeploymentGuide
    ? product.description.split("🚀 DEPLOYMENT GUIDE:", 2)
    : [product.description, ""];

  return (
    <div className="min-h-screen bg-[#f1eee6] text-[#151515]">
      {productJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />}

      <section className="relative overflow-hidden border-b border-black/20 px-5 pb-16 pt-10 md:px-8 md:pb-20 lg:px-12">
        <div className="editorial-paper absolute inset-0 -z-20" />
        <div className="absolute -right-20 top-10 -z-10 h-80 w-80 rounded-full bg-[#725cff]/10 blur-[100px]" />
        <div className="mx-auto max-w-[1600px]">
          <Link href="/products" className="inline-flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[.18em] text-black/45 transition hover:text-black">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
          </Link>

          <div className="mt-9 grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
            <div>
              <div className="border border-black/20 bg-[#d9d0ff] p-2 md:p-4">
                <QuantumProductView image={product.image} name={product.name} />
              </div>
              <p className="mt-4 max-w-xl text-[11px] leading-5 text-black/45">
                Catalog artwork represents this SKU. The exact files, requirements and license are described on this page; third-party interfaces are not implied by the cover image.
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-black/20 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em]">{product.category}</span>
                <span className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.18em] ${product.inStock ? "border-[#725cff]/40 bg-[#d9d0ff]" : "border-black/15 bg-black/5 text-black/35"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-[#725cff]" : "bg-black/25"}`} />
                  {product.inStock ? "Available" : "Unavailable"}
                </span>
              </div>

              <p className="editorial-kicker mt-8">DIGITAL SWARM / PRODUCT</p>
              <h1 className="mt-5 text-[clamp(4rem,7vw,8rem)] font-black uppercase leading-[.82] tracking-[-.075em]">{product.name}</h1>

              <div className="mt-8 grid gap-5 border-y border-black/20 py-6 sm:grid-cols-[.75fr_1.25fr]">
                <div>
                  <span className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">Catalog price</span>
                  <div className="mt-2 text-4xl font-black tracking-[-.055em] md:text-5xl">₹{product.price.toLocaleString("en-IN")}</div>
                </div>
                <ReviewSummary reviewStats={reviewStats} />
              </div>

              <p className="mt-7 max-w-2xl text-base leading-7 text-black/58 md:text-lg">{cleanDescription.slice(0, 420)}{cleanDescription.length > 420 ? "…" : ""}</p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <FactChip icon={LockKeyhole} label="Delivery" value={deliveryLabel} />
                <FactChip icon={ShieldCheck} label="Checkout" value="Server-validated INR" />
              </div>

              {product.demoUrl && (
                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="editorial-button mt-6 w-fit">
                  <Eye className="h-4 w-4" /> View public demo
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#d9d0ff] px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="editorial-kicker">WHAT IS INCLUDED</p>
            <h2 className="mt-6 text-[clamp(3.8rem,7vw,7.6rem)] font-black uppercase leading-[.82] tracking-[-.07em]">Inspect before you buy.</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-black/52 md:text-base">Product details stay visible before checkout so the purchase decision is based on the actual listing rather than artificial scarcity or popularity signals.</p>
          </div>

          <div>
            {product.features && product.features.length > 0 ? (
              <div className="border-t border-black/20">
                {product.features.map((feature, index) => (
                  <div key={feature} className="grid grid-cols-[52px_1fr_auto] items-center gap-4 border-b border-black/20 py-5">
                    <span className="font-mono text-[9px] font-black text-[#725cff]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-base font-black uppercase tracking-[-.025em] md:text-xl">{feature}</span>
                    <Check className="h-4 w-4 text-black/35" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-black/20 p-6 text-sm text-black/50">No separate feature list is published for this SKU; use the product description and structured specs below.</div>
            )}

            <div className="mt-10 border border-black/20 bg-[#f1eee6]/55">
              <div className="flex items-center justify-between border-b border-black/20 px-5 py-4">
                <span className="font-mono text-[9px] font-black uppercase tracking-[.18em]">Catalog specs</span>
                <span className="font-mono text-[8px] font-bold uppercase tracking-[.14em] text-black/40">Published for this SKU</span>
              </div>
              <div className="grid sm:grid-cols-2">
                {Object.keys(product.specs || {}).length === 0 ? (
                  <p className="p-5 text-sm text-black/50 sm:col-span-2">No structured specs are listed for this product.</p>
                ) : (
                  Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} className="border-b border-black/15 p-5 odd:sm:border-r">
                      <span className="block font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">{key.replace(/_/g, " ")}</span>
                      <span className="mt-2 block text-sm font-bold break-words">{value}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#f1eee6] px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="editorial-kicker">PRODUCT DETAILS</p>
            <h2 className="mt-6 text-[clamp(3.4rem,6vw,7rem)] font-black uppercase leading-[.84] tracking-[-.065em]">Read the operating notes.</h2>
          </div>
          <div>
            <p className="text-base leading-8 text-black/58 md:text-lg whitespace-pre-line">{plainTextFromMd(descriptionIntro)}</p>
            {deploymentGuide && (
              <div className="mt-8 border border-black/20 bg-[#151515] text-[#f1eee6]">
                <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4">
                  <BookOpen className="h-4 w-4 text-[#d8b66d]" />
                  <span className="font-mono text-[9px] font-black uppercase tracking-[.18em]">Deployment guide</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap p-6 font-mono text-[11px] leading-6 text-white/65">{deploymentGuide.trim()}</pre>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#151515] px-5 py-16 text-[#f1eee6] md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="editorial-kicker text-[#b6a7ff]">LICENSE + PURCHASE</p>
            <h2 className="mt-6 text-[clamp(3.8rem,7vw,7.6rem)] font-black uppercase leading-[.82] tracking-[-.07em]">Choose the rights you need.</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/50 md:text-base">The selected license determines the cart SKU and server-authoritative checkout amount.</p>
          </div>
          <div className="bg-[#f1eee6] p-5 md:p-8">
            <AddToCartButton product={product} />
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => { window.location.href = `/checkout?product=${product.id}`; }}
              className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 border border-[#725cff] bg-[#725cff] px-6 text-[10px] font-black uppercase tracking-[.17em] text-white transition hover:bg-[#151515] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Buy standard license now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1600px] border border-white/15 md:grid-cols-3">
          <TrustFact icon={LockKeyhole} title="Private delivery" body="Paid access is issued after the order is verified." />
          <TrustFact icon={ShieldCheck} title="Cashfree checkout" body="The server recalculates approved catalog pricing before order creation." />
          <TrustFact icon={RotateCcw} title="Published policies" body="Review refund, licensing and privacy terms before purchasing." />
        </div>
        <div className="mx-auto mt-5 flex max-w-[1600px] flex-wrap gap-3">
          <Link href="/refund" className="editorial-button border-white/20 text-white">Refund policy</Link>
          <Link href="/licenses" className="editorial-button border-white/20 text-white">License terms</Link>
          <Link href="/privacy" className="editorial-button border-white/20 text-white">Privacy</Link>
        </div>
      </section>

      <section className="bg-[#151515] px-5 pb-16 text-[#f1eee6] md:px-8 md:pb-24 lg:px-12">
        <div className="mx-auto max-w-[1600px] border-t border-white/10 pt-16">
          <p className="editorial-kicker text-[#d8b66d]">PRODUCT ASSISTANT</p>
          <div className="mt-7"><AIAnalyst productName={product.name} category={product.category} /></div>
        </div>
      </section>

      <section className="bg-[#f1eee6] px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="border-b border-black/20 pb-8">
            <p className="editorial-kicker">CUSTOMER FEEDBACK</p>
            <h2 className="mt-4 text-4xl font-black uppercase tracking-[-.055em] md:text-6xl">Published reviews only.</h2>
          </div>
          <div className="mt-10 rounded-none bg-[#151515] p-4 text-[#f1eee6] md:p-8"><ReviewSystem productId={product.id} /></div>

          <div className="mt-20 border-t border-black/20 pt-12">
            <p className="editorial-kicker">CONTINUE BROWSING</p>
            <div className="mt-8"><RelatedProducts category={product.category} currentProductId={product.id} /></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewSummary({ reviewStats }: { reviewStats: { count: number; avg: number } | null }) {
  if (reviewStats === null) {
    return <div className="flex items-center text-[10px] font-mono uppercase tracking-[.14em] text-black/35">Loading published reviews…</div>;
  }
  if (reviewStats.count === 0) {
    return (
      <div>
        <span className="block font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">Customer reviews</span>
        <p className="mt-2 text-xs leading-5 text-black/48">No published customer reviews yet.</p>
      </div>
    );
  }
  return (
    <div>
      <span className="block font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">Customer reviews</span>
      <div className="mt-2 flex items-end gap-3">
        <span className="text-3xl font-black tracking-[-.04em]">{reviewStats.avg.toFixed(1)} / 5</span>
        <span className="pb-1 text-xs text-black/45">{reviewStats.count} published</span>
      </div>
    </div>
  );
}

function FactChip({ icon: Icon, label, value }: { icon: typeof LockKeyhole; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 border border-black/20 bg-white/30 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#151515] text-[#f1eee6]"><Icon className="h-4 w-4" /></div>
      <div><span className="block font-mono text-[8px] font-black uppercase tracking-[.16em] text-black/38">{label}</span><span className="mt-1 block text-sm font-bold">{value}</span></div>
    </div>
  );
}

function TrustFact({ icon: Icon, title, body }: { icon: typeof LockKeyhole; title: string; body: string }) {
  return (
    <article className="border-b border-white/15 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <Icon className="h-5 w-5 text-[#d8b66d]" />
      <h3 className="mt-5 text-xl font-black uppercase tracking-[-.035em]">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-white/45">{body}</p>
    </article>
  );
}
