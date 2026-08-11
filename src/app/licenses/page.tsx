"use client";

import { motion } from "framer-motion";
import { Building2, CheckCircle2, FileText, Shield, XCircle } from "lucide-react";
import Link from "next/link";

const standardCanDo = [
  "Use the purchased asset in your own personal or commercial projects.",
  "Use and customise the asset while delivering work for clients.",
  "Modify source code, prompts, playbooks and included files for the permitted project.",
  "Bundle modified output inside a larger application or service where the raw Digital Swarm archive is not the product being resold.",
  "Re-use the licensed asset across projects operated by the purchaser.",
];

const commonRestrictions = [
  "Do not resell or redistribute the raw delivery archive as a standalone product.",
  "Do not publish the raw licensed files in a public repository or public download location.",
  "Do not claim ownership of Digital Swarm's original source material or branding.",
  "Do not transfer the licence key or raw archive to another party as a substitute for their own licence.",
  "Do not use a product outside any additional restriction stated clearly on its product page.",
];

const agencyRights = [
  "Rebrand the implemented client-facing work under your agency or client brand.",
  "Remove Digital Swarm branding from the client-facing implementation when practical.",
  "Use the licensed asset as a production input across agency client engagements.",
  "Keep the underlying Digital Swarm archive, source package and licence key private to the purchasing agency.",
];

export default function LicensePage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <header className="border-b border-border pb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Licence &amp; Usage Rights</h1>
          <p className="text-muted-foreground">
            The licence options sold on Digital Swarm, in plain English. Last updated: August 2026.
          </p>
        </header>

        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Standard Commercial Licence</h2>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            A Standard purchase grants the purchaser a non-exclusive, non-transferable licence to use and modify the delivered product for personal or commercial work, subject to the restrictions below. It does not transfer ownership of the original Digital Swarm intellectual property.
          </p>
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <ul className="space-y-3">
              {standardCanDo.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Agency Whitelabel Licence</h2>
          </div>
          <p className="leading-relaxed text-muted-foreground">
            When a product page offers the separate <strong className="text-foreground">Agency Whitelabel</strong> option, that paid tier adds client-facing rebranding rights. The checkout prices this tier separately at five times the Standard catalogue price, and the issued licence is recorded as an Agency Whitelabel licence.
          </p>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <ul className="space-y-3">
              {agencyRights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Agency Whitelabel is not a master-resell-rights licence. It does not permit selling the raw archive, source package, licence key or a substantially unchanged copy as a downloadable product or marketplace template.
          </p>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <XCircle className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Restrictions That Apply to Both</h2>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
            <ul className="space-y-3">
              {commonRestrictions.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold">Product-specific scope</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            The product page describes what files and functionality are included. A licence grants usage rights to the delivered material; it does not add services, integrations, support levels or functionality that are not listed with that product.
          </p>
        </section>

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <h3 className="mb-2 text-xl font-bold">Need a Different Licence?</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Contact Digital Swarm before purchasing if your use case requires redistribution, sublicensing or terms outside the licences above.
          </p>
          <Link href="/contact" className="inline-flex rounded-full border border-black bg-primary px-6 py-3 font-bold text-black transition-opacity hover:opacity-90">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
