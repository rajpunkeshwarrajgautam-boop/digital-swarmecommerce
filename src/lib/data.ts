import { Product } from "./types";

export const products: Product[] = [
  {
    id: "nextjs-saas-kit",
    name: "Next.js SaaS Starter Kit",
    description: "The ultimate foundation for your next SaaS. Includes Stripe integration, Clerk authentication, Prisma ORM, and a beautiful dashboard with dark mode support.",
    price: 2999,
    category: "Boilerplates",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 5.0,
    features: ['Next.js 15 App Router', 'Clerk Auth UI', 'Stripe Payments', 'Prisma + PostgreSQL', 'Tailwind CSS Pro'],
    specs: { Framework: 'Next.js 15', Auth: 'Clerk', DB: 'PostgreSQL', License: 'Unlimited', Support: 'Lifetime' },
    downloadUrl: "/downloads/nextjs-saas-starter.zip",
    installGuide: "### Setup Protocol\n1. `npm install` to load the chassis.\n2. Configure `.env` with Clerk & Stripe keys. \n3. `npm run dev` to launch."
  },
  {
    id: "ai-agent-boilerplate",
    name: "AI Agent Boilerplate",
    description: "Build autonomous agents in minutes. Pre-configured with LangChain, Gemini API, and a React interface. Perfect for custom LLM wrappers and agentic workflows.",
    price: 3499,
    category: "AI Agents",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 5.0,
    features: ['LangChain Integration', 'Gemini & OpenAI Ready', 'Streamlit & React UI', 'Vector DB Support', 'Source Code Included'],
    specs: { Stack: 'Node.js / Python', AI: 'Multi-Model', Core: 'LangGraph', License: 'MRR', Support: 'Discord' },
    downloadUrl: "/downloads/ai-agent-boilerplate.zip",
    installGuide: "### Agent Deployment\n1. `npm install` the neural core.\n2. Set your `AI_API_KEY` in env.\n3. Run `npm start` to initialize the swarm."
  },
  {
    id: "react-ui-kit-pro",
    name: "React UI Kit Pro",
    description: "A premium library of 100+ copy-paste components. Built with Radix UI and Framer Motion. High-performance, accessible, and stunning visuals.",
    price: 1999,
    category: "UI Kits",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 5.0,
    features: ['100+ Accessible Components', 'Framer Motion Animations', 'Tailwind CSS Config', 'Figma Design Files', 'Storybook Docs'],
    specs: { Library: 'React / Radix', Style: 'Tailwind CSS', Icons: 'Lucide', License: 'Personal/Commercial', Support: 'Lifetime' },
    downloadUrl: "/downloads/react-ui-pro.zip",
    installGuide: "### Component Injection\n1. Copy the `ui` folder to your project.\n2. Merge the `tailwind.config.js` with your own.\n3. Import and use anywhere."
  },
  {
    id: "typescript-dashboard-template",
    name: "TypeScript Dashboard Template",
    description: "Enterprise-grade admin panel. Strictly typed, highly modular, and pre-integrated with data visualization libraries like Recharts.",
    price: 2499,
    category: "Dashboards",
    image: "https://images.unsplash.com/photo-1551288049-bbbda5366991?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 4.8,
    features: ['Strictly Typed TS', 'Recharts Integration', 'Complex Table Sorting', 'Role-Based Access', 'Zandbox UI'],
    specs: { Type: 'TypeScript', Charts: 'Recharts', Layout: 'Grid/Flex', License: 'MRR', Support: '24/7' },
    downloadUrl: "/downloads/ts-dashboard.zip",
    installGuide: "### Logic Deployment\n1. `npm install` dependencies.\n2. Connect your API endpoint in `config.ts`.\n3. Launch with `npm run build`."
  },
  {
    id: "mobile-app-starter",
    name: "Mobile App Starter (React Native)",
    description: "Cross-platform excellence. Launch your iOS and Android apps simultaneously with this Expo-powered React Native boilerplate.",
    price: 2299,
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 4.9,
    features: ['Expo SDK 50+', 'NativeWind (Tailwind)', 'Supabase Auth Ready', 'Push Notifications', 'App Store Configs'],
    specs: { Platform: 'iOS / Android', Framework: 'React Native', Engine: 'Expo', License: 'Full IP', Support: 'Documentation' },
    downloadUrl: "/downloads/react-native-starter.zip",
    installGuide: "### Mobile Uplink\n1. `npx expo install`.\n2. Connect to Expo Go on your device.\n3. Build your APK/IPA via EAS."
  },
  {
    id: "chrome-extension-template",
    name: "Chrome Extension Template",
    description: "Turn your ideas into browser tools. MV3 compliant template with React content scripts, background workers, and options page.",
    price: 1499,
    category: "Extensions",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    inStock: true,
    rating: 5.0,
    features: ['MV3 Manifest Compliant', 'React Popup & Options', 'Background Messaging', 'Storage Sync Helpers', 'One-Click Publish'],
    specs: { Format: 'Manifest V3', UI: 'React', Build: 'Vite', License: 'Unlimited', Support: 'Community' },
    downloadUrl: "/downloads/chrome-extension-kit.zip",
    installGuide: "### Browser Injection\n1. `npm install && npm run build`.\n2. Go to `chrome://extensions`.\n3. Load unpacked `dist` folder."
  }
];
