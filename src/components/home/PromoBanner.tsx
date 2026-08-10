import Link from 'next/link';

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden border-b border-primary/20 bg-primary/[0.08] px-4 py-2 text-[#f6f1e8]">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-primary">
          DIGITAL SWARM / VERIFIED CATALOG
        </span>
        <span className="text-[11px] font-semibold text-white/65 md:text-xs">
          Exact deliverables are listed per product. Paid files are delivered through private download links.
        </span>
        <Link
          href="/products"
          className="text-[10px] font-black uppercase tracking-[0.16em] text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          Browse products
        </Link>
        <Link
          href="/freebies"
          className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55 hover:text-white"
        >
          Try free assets
        </Link>
      </div>
    </div>
  );
}
