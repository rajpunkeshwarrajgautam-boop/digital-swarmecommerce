"use client";

import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

const columns = [
  {
    label: "Shop",
    links: [
      ["Catalog", "/products"],
      ["Pricing", "/pricing"],
      ["Free assets", "/freebies"],
      ["Search", "/search"],
    ],
  },
  {
    label: "Support",
    links: [
      ["Help center", "/help"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
      ["Refund policy", "/refund"],
    ],
  },
  {
    label: "Company",
    links: [
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Affiliate", "/affiliate"],
      ["Merchant", "/merchant/apply"],
    ],
  },
  {
    label: "Legal",
    links: [
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
      ["Cookies", "/cookie"],
    ],
  },
] as const;

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  if (isAuthPage) return null;

  return (
    <footer className="border-t border-black/15 bg-[#f1eee6] px-5 py-10 text-[#151515] md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 border-b border-black/20 pb-12 lg:grid-cols-[1.35fr_1.65fr]">
          <div>
            <p className="editorial-kicker">DIGITAL SWARM</p>
            <h2 className="mt-5 max-w-2xl text-[clamp(3.4rem,6vw,7rem)] font-black uppercase leading-[.82] tracking-[-.07em]">
              Digital assets
              <span className="block text-[#725cff]">for people who ship.</span>
            </h2>
            <a href="mailto:support@digitalswarm.in" className="editorial-button editorial-button-dark mt-8">
              <Mail className="h-4 w-4" /> support@digitalswarm.in
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {columns.map((column) => (
              <div key={column.label}>
                <h3 className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-[#725cff]">{column.label}</h3>
                <div className="mt-5 flex flex-col gap-3">
                  {column.links.map(([label, href]) => (
                    <Link key={href} href={href} className="group flex items-center gap-1 text-sm font-bold text-black/55 transition hover:text-black">
                      {label} <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-[9px] font-black uppercase tracking-[.18em] text-black/45 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} DIGITAL SWARM</p>
          <p>INR catalog · Cashfree checkout · private paid delivery</p>
        </div>
      </div>
    </footer>
  );
}
