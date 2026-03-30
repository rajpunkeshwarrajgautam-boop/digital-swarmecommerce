import { Product } from "./types";

export const products: Product[] = [
  {
    id: "notion-crm-protocol",
    name: "The Ultimate Freelancer CRM",
    description: "Your new operating system. A beautifully customized Notion template designed to automate invoicing, track projects, and centralize client communication in one brutally efficient dashboard.",
    price: 499,
    originalPrice: 1299,
    category: "Notion Systems",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 5.0,
    features: ['1-Click Duplicate', 'Automated Invoicing', 'Client Client Portals', 'Task Prioritization Matrix', 'Zero Coding Required'],
    specs: { Platform: 'Notion', Level: 'Beginner', Setup: '2 Mins', License: 'Personal', Support: 'Discord' },
    downloadUrl: "/downloads/notion-crm-protocol.html",
    installGuide: "### Deployment\n1. Download the protocol.\n2. Click the secure link inside to open Notion.\n3. Click 'Duplicate' in the top right to install."
  },
  {
    id: "ai-social-automation",
    name: "AI Social Poster Blueprint",
    description: "A plug-and-play Make.com automation blueprint. Watches your content feeds, uses OpenAI to write viral hooks, and posts directly to X and LinkedIn automatically.",
    price: 899,
    originalPrice: 1499,
    category: "No-Code Automations",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 4.9,
    features: ['Make.com Blueprint (.json)', 'OpenAI Integration', 'Auto-posts to X & LinkedIn', 'RSS Feed Watcher', 'Zero Coding Required'],
    specs: { Platform: 'Make.com', API: 'OpenAI', Output: 'Social Media', License: 'Business', Support: 'Documentation' },
    downloadUrl: "/downloads/ai-social-protocol.html",
    installGuide: "### Automation Config\n1. Import the .json blueprint into Make.com.\n2. Connect your Twitter and OpenAI accounts.\n3. Turn the scenario ON."
  },
  {
    id: "cyberpunk-ui-kit",
    name: "Cyberpunk UI Kit Pro",
    description: "100+ high-end, brutalist cyberpunk components ready to be dragged and dropped into your next Figma design. Build stunning futuristic interfaces in minutes.",
    price: 699,
    originalPrice: 999,
    category: "Design Assets",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 5.0,
    features: ['100+ Figma Components', 'Global Color Variables', 'Auto-Layout Ready', 'Cyberpunk Neon Theme', 'Zero Coding Required'],
    specs: { Format: '.fig', Software: 'Figma', Typography: 'Google Fonts', License: 'Commercial', Support: 'Lifetime' },
    downloadUrl: "/downloads/cyberpunk-ui-protocol.html",
    installGuide: "### Visual Injection\n1. Download the .fig file.\n2. Drag it into your Figma workspace.\n3. Copy components into your project."
  },
  {
    id: "ai-executive-playbook",
    name: "The AI Executive Playbook",
    description: "A 50-page tactical PDF manifesto detailing exactly how to use ChatGPT and Claude to replace a marketing department, scale lead generation, and automate research.",
    price: 299,
    originalPrice: 599,
    category: "Playbooks",
    image: "https://images.unsplash.com/photo-1551288049-bbbda5366991?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 4.8,
    features: ['50-Page PDF Manifesto', '150+ Copy-Paste Prompts', 'Outreach Frameworks', 'Case Studies Included', 'Zero Coding Required'],
    specs: { Format: 'PDF', Length: '50 Pages', Tools: 'ChatGPT/Claude', License: 'Personal', Support: 'Community' },
    downloadUrl: "/downloads/ai-executive-playbook.html",
    installGuide: "### Tactical Download\n1. Download the PDF to your desktop.\n2. Bookmark the Prompt Database link on Page 12.\n3. Execute Chapter 3 immediately."
  }
];
