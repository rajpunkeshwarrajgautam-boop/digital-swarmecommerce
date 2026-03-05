"use client";

import { motion } from "framer-motion";
import { Download, Lightbulb, Users, Clock } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: <Download className="w-8 h-8 text-primary" />,
    title: "Quality Over Quantity",
    description:
      "Every product in our store is hand-selected and tested before listing. We'd rather have 50 excellent products than 500 mediocre ones.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Your Time Is Valuable",
    description:
      "Every product ships with a setup guide so you can go from download to running code in under 5 minutes — not 5 hours.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Built by Developers, for Developers",
    description:
      "We're builders ourselves. We know what clean architecture looks like, and we won't list anything we wouldn't use in our own production apps.",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Constantly Updated",
    description:
      "We update products when major frameworks release new versions. Buy once, benefit forever — you'll always get the latest version.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-16"
      >
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Premium Digital Products for{" "}
            <span className="text-primary">Indie Developers</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Digital Swarm is a curated store of source code, UI kits, and digital templates
            for developers and creators who want to build faster without cutting corners.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-card border border-border rounded-3xl p-10 md:p-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Why We Built This</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Every developer has experienced it: you start a new project and spend the first
                two weeks setting up auth, payments, a design system, database migrations — the
                same boilerplate you&apos;ve written a dozen times before.
              </p>
              <p>
                We built Digital Swarm because we got tired of it. We started packaging the
                reusable building blocks we kept reaching for — clean, well-documented, and
                production-ready — and making them available to other developers.
              </p>
              <p>
                Whether you&apos;re an indie founder trying to launch an MVP this week, or a
                freelancer who needs a go-to UI kit for every new client project — Digital Swarm
                has the tools to help you ship something you&apos;re proud of, faster.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/products">
            <button className="bg-primary text-black font-black px-10 py-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200 text-lg">
              Browse All Products
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
