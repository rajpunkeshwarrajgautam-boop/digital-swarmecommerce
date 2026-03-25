"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, FileText, Shield } from "lucide-react";
import Link from "next/link";

const canDo = [
  "Use the product in unlimited personal projects",
  "Use the product in unlimited commercial client projects",
  "Modify and customise the source code for your needs",
  "Bundle the product as part of a larger paid application (where the raw files are not the primary product being sold)",
  "Use for SaaS, web apps, mobile apps, and internal tools",
  "Re-use across multiple of your own projects",
];

const cannotDo = [
  "Resell the raw, unmodified files as a standalone product",
  "Distribute on public repositories (GitHub, etc.) without modification",
  "Claim ownership of the original intellectual property",
  "Sublicense or transfer the licence to another party",
  "Use products marked 'Personal Only' in commercial work (check product listing)",
];

export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center border-b border-border pb-8">
          <h1 className="text-4xl font-bold mb-4">Licence &amp; Usage Rights</h1>
          <p className="text-muted-foreground">
            Clear, plain-English licensing for all Digital Swarm products. Last updated: March 2026.
          </p>
        </div>

        {/* Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Standard Commercial Licence</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            When you purchase a product from Digital Swarm, you receive a{" "}
            <strong className="text-foreground">non-exclusive, non-transferable Standard Commercial Licence</strong>.
            This licence is granted to you — the individual purchaser — and covers both personal and
            most commercial uses.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mt-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> If a product listing says &ldquo;Personal Licence Only,&rdquo;
              that product may only be used in non-commercial personal projects. All other products default to
              the Standard Commercial Licence below.
            </p>
          </div>
        </section>

        {/* What you CAN do */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">What You <span className="text-green-500">Can</span> Do</h2>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
            <ul className="space-y-3">
              {canDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What you CANNOT do */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">What You <span className="text-red-500">Cannot</span> Do</h2>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <ul className="space-y-3">
              {cannotDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Master Resell Rights */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Master Resell Rights (MRR)</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Some products are explicitly marked with <strong className="text-foreground">Master Resell Rights</strong>.
            With an MRR product, you may resell the product as-is (without modification) and keep 100% of the
            revenue. You may also pass resell rights to your end customer. This will be clearly noted on the
            individual product page when applicable.
          </p>
        </section>

        {/* Questions */}
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Questions About Licensing?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            If your use case isn&apos;t covered above, get in touch — we&apos;re happy to clarify.
          </p>
          <Link href="/contact">
            <button className="bg-primary text-black font-bold px-6 py-3 rounded-full border border-black hover:opacity-90 transition-opacity">
              Contact Us
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
