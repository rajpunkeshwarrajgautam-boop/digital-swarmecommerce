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
            Architecting the <span className="text-primary">Digital Future</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Google Antigravity is the world&apos;s first agentic development ecosystem. 
            Designed as a high-performance repository for AI-assisted source code, 
            expert knowledge, and autonomous agents, we empower developers to build 
            faster and scale with the power of Gemini.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Rocket className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Accelerate Innovation</h3>
            <p className="text-muted-foreground">
              We provide the building blocks so you don&apos;t have to start from scratch. 
              Our curated bundles and thoroughly tested source codes are designed to 
              cut development time by 70%.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Code className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Verified Quality</h3>
            <p className="text-muted-foreground">
              Every digital asset in our catalog undergoes rigorous testing. 
              From PHP scripts to Python automation bundles, we ensure 
              clean code, modern standards, and comprehensive documentation.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Globe className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Global Impact</h3>
            <p className="text-muted-foreground">
              Serving a community of over 10,000 developers across 50 countries. 
              We are democratizing access to premium software development resources 
              at accessible price points.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors">
            <Cpu className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Future Ready</h3>
            <p className="text-muted-foreground">
              Stay ahead of the curve with our constantly updating library. 
              We focus on emerging technologies, AI integrations, and 
              scalable architectures that define the next web.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-linear-to-br from-secondary/50 to-background border border-border rounded-3xl p-10 md:p-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Our Origin</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Launched in late 2025, Google Antigravity emerged as a response to the 
                shift from manual coding to agent-first development. We realized that 
                building the future requires more than just code—it requires intelligent 
                orchestration.
              </p>
              <p>
                By providing an ecosystem where human intention meets AI execution, 
                we eliminate the friction between thought and materialization. 
                Experience the next generation of software construction.
              </p>
              <p>
                Whether you are a solo founder building your MVP, an agency scaling 
                operations, or a student mastering the craft—we are your innovative partner.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
