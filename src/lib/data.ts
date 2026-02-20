import { Product } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Gemini Code Architect",
    description: "An advanced agentic framework for Next.js 14. Build self-healing, high-performance web applications with built-in Google Gemini 3 orchestration.",
    price: 499,
    category: "AI Frameworks",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 5.0,
    features: [
      'Gemini 3 Ready',
      'Self-Healing Logic',
      'Next.js 14 Optimization',
      'Agentic UI Components',
      'Lifetime Cloud Sync'
    ],
    specs: {
      "Kernel": "v5.2-alpha",
      "Memory": "Context-aware",
      "Model": "Gemini 1.5 Pro",
      "License": "Commercial",
      "Docs": "Interactive MDX"
    }
  },
  {
    id: "2",
    name: "Antigravity UI Kit",
    description: "The official design system used in Google Antigravity. Features quantum halo effects, turbulence materialization, and hyper-kinetic typography.",
    price: 199,
    category: "Design Systems",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.9,
    features: [
      'Quantum Halo Effects',
      'Turbulence Materialization',
      'Tailwind 4 Ready',
      '100+ Premium Icons',
      'Framer Motion Presets'
    ],
    specs: {
      "Format": "React / Figma",
      "Components": "250+",
      "Theme": "Multi-chrome",
      "Updates": "Weekly",
      "Support": "Discord Access"
    }
  },
  {
    id: "3",
    name: "Swarm Logic Engine",
    description: "Distributed intelligence for e-commerce. Coordinate multiple AI agents to handle stock, customer support, and dynamic pricing in real-time.",
    price: 899,
    category: "Backend Services",
    image: "https://images.unsplash.com/photo-1639322537231-2f206e06af84?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.8,
    features: [
      'Distributed Tasking',
      'Real-time Balancing',
      'Conflict Resolution',
      'Multi-agent Sync',
      'Enterprise SLA'
    ],
    specs: {
      "Throughput": "1M req/sec",
      "Latency": "< 10ms",
      "Architecture": "Serverless Swarm",
      "Security": "Post-Quantum",
      "Uptime": "99.99%"
    }
  },
  {
    id: "4",
    name: "Neural Design Bundle",
    description: "A generative asset library containing 5000+ AI-generated textures, 3D models, and HDRIs optimized for premium web experiences.",
    price: 299,
    category: "Assets",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.7,
    features: [
      '5000+ Assets',
      '4K Resolution',
      'Seamless Textures',
      'PBR Optimized',
      'Commercial License'
    ],
    specs: {
      "Size": "45 GB",
      "Formats": "PNG, OBJ, GLB",
      "Generator": "Stable Diffusion 3",
      "Curation": "Manual Audit",
      "Delivery": "Instant CDN"
    }
  },
  {
    id: "5",
    name: "Agentic SEO Optimizer",
    description: "Automated SEO scaling. An agent that crawls your site, generates semantic metadata, and builds internal linking structures autonomously.",
    price: 149,
    category: "Marketing AI",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.6,
    features: [
      'Self-crawling Agent',
      'Semantic Headings',
      'Dynamic OpenGraph',
      'Alt-text Generation',
      'Schema.org Sync'
    ],
    specs: {
      "Platform": "Global",
      "Analysis": "Rank-based",
      "Integrations": "Search Console",
      "Frequency": "Daily",
      "Reports": "Automated"
    }
  },
  {
    id: "6",
    name: "Deep Space Icon Pack",
    description: "300+ custom crafted icons following the deep-space minimalist aesthetic. Perfect for high-end SaaS and developer tools.",
    price: 49,
    category: "Icons",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop&q=60",
    inStock: true,
    rating: 4.9,
    features: [
      '300+ Vector Icons',
      'Animated Variants',
      'React Components',
      'SVG / Figma Files',
      'Lifetime Updates'
    ],
    specs: {
      "Style": "Line / Solid",
      "Grid": "24px",
      "Weight": "Adjustable",
      "Code": "Tailwind Extended",
      "Package": "NPM Install"
    }
  }
];
