"use client";

import { motion } from "framer-motion";
import { Code, Cpu, Globe, Rocket } from "lucide-react";

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
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight glowing-text">
            The Hub of <span className="text-primary">Digital Excellence</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Digital Swarm is a curated digital asset boutique. 
            Designed as a high-performance repository for premium source code, 
            expert knowledge bundles, and digital growth tools, 
            we empower developers and creators to move at the speed of thought.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Rocket className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Hyper-Growth Logistics</h3>
            <p className="text-muted-foreground">
              We provide the elite building blocks of the web. 
              Our curated bundles are designed to eliminate the mundane, 
              allowing you to focus strictly on innovation and execution.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Code className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Elite Tier Quality</h3>
            <p className="text-muted-foreground">
              Every asset in our swarm is hand-picked and stress-tested. 
              From high-conversion scripts to massive automation bundles, 
              we ensure clean architecture and instant implementation.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Globe className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Global Network</h3>
            <p className="text-muted-foreground">
              Serving a global collective of over 10,000 elite developers. 
              We are democratizing access to professional-grade software 
              resources at scale.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Cpu className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Next-Gen Ready</h3>
            <p className="text-muted-foreground">
              Stay ahead of the saturation. Our library is constantly 
              evolving with emerging tech stacks, AI integrations, 
              and scalable digital infrastructures.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-linear-to-br from-secondary/50 to-background border border-border rounded-3xl p-10 md:p-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">The Swarm Intelligence</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Founded in 2025, Digital Swarm was born from the realization that 
                modern development is moving too fast for traditional workflows. 
                Individual brilliance is powerful, but a swarm of intelligence is unstoppable.
              </p>
              <p>
                We curate the tools that bridge the gap between human creativity 
                and digital materialization. By providing a decentralized ecosystem 
                of premium assets, we enable a faster, more efficient internet.
              </p>
              <p>
                Whether you are a solo founder scaling an MVP or an agency 
                optimizing for hyper-growth—Digital Swarm is your technical partner 
                in the digital frontier.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
