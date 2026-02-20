"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Check, Copy, ExternalLink, Database, AlertCircle, RefreshCw } from "lucide-react";

export default function SetupPage() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  const checkConnection = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/setup/check');
      const data = await res.json();
      
      if (res.ok) {
        setStatus('connected');
        setMessage(`Connected! Found ${data.count} products.`);
      } else {
        setStatus('error');
        setMessage(data.message);
        setDetails(data.details);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to connect');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-start">
            <div>
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Database Setup</h1>
            <p className="text-muted-foreground">Follow these steps to initialize your Supabase database.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={checkConnection} disabled={status === 'loading'}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
                    Check Status
                </Button>
            </div>
        </div>

        {/* Status Card */}
        <div className={`p-6 rounded-lg border ${
            status === 'connected' ? 'border-green-500/50 bg-green-500/10' : 
            status === 'error' ? 'border-red-500/50 bg-red-500/10' : 
            'border-border bg-card'
        }`}>
            <div className="flex items-center gap-3">
                {status === 'loading' && <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />}
                {status === 'connected' && <Check className="h-6 w-6 text-green-500" />}
                {status === 'error' && <AlertCircle className="h-6 w-6 text-red-500" />}
                <div>
                    <h3 className="font-semibold text-lg">
                        {status === 'loading' ? 'Checking Connection...' : 
                         status === 'connected' ? 'Database Connected' : 'Connection/Schema Error'}
                    </h3>
                    <p className="text-sm opacity-80">{message}</p>
                </div>
            </div>
            {status === 'error' && details && (
                <div className="mt-4 p-4 bg-black/30 rounded text-xs font-mono overflow-auto max-h-32">
                    {JSON.stringify(details, null, 2)}
                </div>
            )}
        </div>

        <div className="grid gap-8">
            <StepCard 
                number={1} 
                title="Go to Supabase SQL Editor" 
                description="Open your project's SQL editor to run the initialization scripts."
            >
                <div className="flex gap-4">
                     <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full sm:w-auto">
                            Open SQL Editor <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                     </a>
                </div>
            </StepCard>

            <StepCard 
                number={2} 
                title="Create Tables (Schema)" 
                description="Copy this SQL and run it in the SQL Editor to create the necessary tables and policies."
            >
                <CodeBlock code={schemaSql} />
            </StepCard>

            <StepCard 
                number={3} 
                title="Seed Data" 
                description="Run this SQL to populate your database with initial products."
            >
               <CodeBlock code={seedSql} />
            </StepCard>
        </div>
      </motion.div>
    </div>
  );
}

function StepCard({ number, title, description, children }: { number: number, title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="border border-border/50 rounded-xl p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {number}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-1">{title}</h2>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="pl-12">
                {children}
            </div>
        </div>
    )
}

function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <div className="absolute right-2 top-2 z-10">
                <Button size="sm" variant="secondary" onClick={copyToClipboard}>
                    {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copied ? 'Copied' : 'Copy SQL'}
                </Button>
            </div>
            <pre className="p-4 rounded-lg bg-zinc-950 text-zinc-300 overflow-x-auto text-sm font-mono max-h-96 border border-white/10">
                {code}
            </pre>
        </div>
    );
}

const schemaSql = `-- Reset Database (Caution: Deletes all data)
drop table if exists public.order_items;
drop table if exists public.orders;
drop table if exists public.products;

-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category text not null,
  image text not null,
  in_stock boolean default true,
  rating numeric(3, 1) default 0,
  features text[],
  specs jsonb,
  created_at timestamptz default now()
);

-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Clerk User ID
  total numeric(10, 2) default 0,
  status text default 'pending', -- pending, paid, shipped, delivered
  created_at timestamptz default now()
);

-- Create order items table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null default 1,
  price numeric(10, 2) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Create policies (modify as needed)
-- Everyone can read products
create policy "Public products are viewable by everyone" 
on public.products for select using (true);

-- Only authenticated users can create orders
create policy "Users can creates their own orders" 
on public.orders for insert with check (auth.uid() = user_id);

-- Users can view their own orders
create policy "Users can view own orders" 
on public.orders for select using (auth.uid() = user_id);`;

const seedSql = `-- Insert initial products
insert into public.products (name, description, price, category, image, in_stock, rating, features, specs)
values
  (
    'Quantum Keyboard', 
    'Experience the future of typing with the Quantum Keyboard. Featuring ultra-low latency quantum switches and holographic keycaps that adapt to your workflow, this keyboard redefines input devices. Whether you are coding, gaming, or designing, the tactile feedback and customizable holographic displays ensure maximum efficiency and immersion.', 
    199.99, 
    'Peripherals', 
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.8,
    ARRAY['Quantum-entangled switches for zero latency', 'Adaptive holographic key legends', 'Haptic feedback engine', 'carbon-fiber chassis', 'Neural-link compatible'],
    '{"Switch Type": "Quantum Mechanical", "Latency": "0.01ms", "Material": "Carbon Fiber / Holographic Glass", "Connectivity": "Wireless / Neural-Link", "Battery Life": "400 Hours"}'::jsonb
  ),
  (
    'Neural Headset X1', 
    'Immerse yourself in pure audio bliss while controlling your digital environment with your mind. The Neural Headset X1 combines high-fidelity spatial audio with non-invasive brain-computer interface sensors, allowing you to execute commands and navigate interfaces simply by thinking.', 
    349.50, 
    'Audio', 
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.9,
    ARRAY['Non-invasive EEG sensors', 'Active Noise Cancellation (ANC) Pro', '360° Spatial Audio', 'Thought-to-Text dictation', 'Comfort-fit memory foam'],
    '{"Driver Size": "50mm Graphene", "Interface": "BCI Class 2", "Frequency Response": "5Hz - 40kHz", "ANC": "Hybrid -45dB", "Weight": "280g"}'::jsonb
  ),
  (
    'Hover Desk Lamp', 
    'Elevate your workspace with the Hover Desk Lamp. Utilizing advanced magnetic resonance technology, the light source floats freely above the base, providing adjustable, omnidirectional illumination. Its sleek, minimalist design fits perfectly into any modern or futuristic setup.', 
    89.00, 
    'Home', 
    'https://images.unsplash.com/photo-1507473888900-52ea75561068?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.5,
    ARRAY['Frictionless magnetic levitation', 'Wireless power transfer', 'Adjustable color temperature (2700K - 6500K)', 'Smart home integration', 'Touch-free gesture control'],
    '{"Levitation Height": "40mm", "Lumens": "800lm", "Power": "15W Wireless", "Lifespan": "50,000 Hours", "Dimensions": "150mm x 150mm x 300mm"}'::jsonb
  ),
  (
    'Cyber Deck Pro', 
    'The ultimate portable terminal for the modern netrunner. The Cyber Deck Pro is built rugged for field operations, featuring a mechanical ortholinear keyboard, a sunlight-readable e-ink display mode, and expansion ports for all your custom hardware modules.', 
    1250.00, 
    'Computers', 
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=60', 
    false, 
    5.0,
    ARRAY['Ruggedized localized chassis', 'Dual-mode display (OLED / E-Ink)', 'Ortholinear mechanical keys', 'Hardware kill-switches for radio/mic/cam', 'Modular expansion bay'],
    '{"Processor": "Neural-Core i9", "RAM": "64GB LPDDR5X", "Storage": "4TB NVMe Gen5", "Display": "14-inch 4K OLED / E-Ink", "Battery": "100Wh Hot-swappable"}'::jsonb
  ),
  (
    'Neon Backpack', 
    'Stand out and stay safe with the Neon Backpack. Features a programmable LED matrix panel that can display animations, notifications, or custom text controlled via your smartphone. Made from water-resistant smart fabric that self-heals minor cuts and scrapes.', 
    120.00, 
    'Accessories', 
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.7,
    ARRAY['Programmable 64x64 LED Matrix', 'Self-healing nano-fabric', 'Solar charging surface', 'Anti-theft biometric lock', 'Waterproof IP67 rating'],
    '{"Capacity": "25L", "Matrix Resolution": "64x64 RGB", "Material": "Graphene-infused Nylon", "Charging": "Solar / USB-C", "Weight": "1.2kg"}'::jsonb
  ),
  (
    'Smart Hydration V2', 
    'Never dehydrate again. The Smart Hydration V2 bottle tracks your water intake in real-time and syncs with your health apps. It features a built-in UV-C purification system that cleans the water and the bottle every 2 hours, ensuring pure taste every sip.', 
    55.00, 
    'Lifestyle', 
    'https://images.unsplash.com/photo-1602143407151-11115cd4d693?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.2,
    ARRAY['UV-C self-cleaning technology', 'Hydration tracking & reminders', 'Temperature retention (24h cold / 12h hot)', 'MagSafe lid compatible', 'BPA-free medical grade steel'],
    '{"Volume": "750ml", "Battery": "30 Days", "Connectivity": "Bluetooth 5.2", "Material": "Double-wall Stainless Steel", "UV Cycle": "Automatic / Manual"}'::jsonb
  );`;
