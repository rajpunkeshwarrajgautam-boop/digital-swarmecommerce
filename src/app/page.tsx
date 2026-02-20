"use client";

import { Zap, Shield, Truck } from "lucide-react";

import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ParallaxHero } from "@/components/home/ParallaxHero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Deep Space Scrolling */}
      <section className="relative h-[120vh] flex items-center justify-center overflow-hidden bg-background perspective-1000">
        <ParallaxHero />
      </section>

      {/* Featured Section */}
      <FeaturedSection />


      {/* Features Grid */}
      <section className="py-24 bg-secondary/30 border-t border-border/50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Deployment Velocity"
              description="Deploy assets in milliseconds across the entire swarm network."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-accent" />}
              title="Shield Hardening"
              description="Quantum-resistant encryption for every node and transaction."
            />
            <FeatureCard 
              icon={<Truck className="h-8 w-8 text-primary" />}
              title="Hive Mind Sync"
              description="Your environment autonomously scales and repairs itself."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody className="bg-card relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-8 border hover:border-primary/50 transition-colors">
        <CardItem translateZ="50" className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary">
          {icon}
        </CardItem>
        <CardItem
          as="h3"
          translateZ="60"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="40"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {description}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
