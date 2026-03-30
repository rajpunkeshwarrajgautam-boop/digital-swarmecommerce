import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

/**
 * POST /api/products/seed
 * 
 * Admin-only. Seeds the full Digital Swarm product catalog into Supabase.
 * Only runs if the DB is empty. Use /api/products/sync for updates.
 */

const seedProducts = [
  {
    name: "The Ultimate Freelancer CRM",
    description: "Your new operating system. A beautifully customized Notion template designed to automate invoicing, track projects, and centralize client communication in one brutally efficient dashboard.\n\n### Deployment\n1. Download the protocol.\n2. Click the secure link inside to open Notion.\n3. Click 'Duplicate' in the top right to install.",
    price: 499,
    category: "Notion Systems",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
    in_stock: true,
    rating: 5.0,
    features: ['1-Click Duplicate', 'Automated Invoicing', 'Client Client Portals', 'Task Prioritization Matrix', 'Zero Coding Required'],
    specs: { Platform: 'Notion', Level: 'Beginner', Setup: '2 Mins', License: 'Personal', Support: 'Discord' },
    download_url: "/downloads/notion-crm-protocol.html",
  },
  {
    name: "AI Social Poster Blueprint",
    description: "A plug-and-play Make.com automation blueprint. Watches your content feeds, uses OpenAI to write viral hooks, and posts directly to X and LinkedIn automatically.\n\n### Automation Config\n1. Import the .json blueprint into Make.com.\n2. Connect your Twitter and OpenAI accounts.\n3. Turn the scenario ON.",
    price: 899,
    category: "No-Code Automations",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    in_stock: true,
    rating: 4.9,
    features: ['Make.com Blueprint (.json)', 'OpenAI Integration', 'Auto-posts to X & LinkedIn', 'RSS Feed Watcher', 'Zero Coding Required'],
    specs: { Platform: 'Make.com', API: 'OpenAI', Output: 'Social Media', License: 'Business', Support: 'Documentation' },
    download_url: "/downloads/ai-social-protocol.html",
  },
  {
    name: "Cyberpunk UI Kit Pro",
    description: "100+ high-end, brutalist cyberpunk components ready to be dragged and dropped into your next Figma design. Build stunning futuristic interfaces in minutes.\n\n### Visual Injection\n1. Download the .fig file.\n2. Drag it into your Figma workspace.\n3. Copy components into your project.",
    price: 699,
    category: "Design Assets",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    in_stock: true,
    rating: 5.0,
    features: ['100+ Figma Components', 'Global Color Variables', 'Auto-Layout Ready', 'Cyberpunk Neon Theme', 'Zero Coding Required'],
    specs: { Format: '.fig', Software: 'Figma', Typography: 'Google Fonts', License: 'Commercial', Support: 'Lifetime' },
    download_url: "/downloads/cyberpunk-ui-protocol.html",
  },
  {
    name: "The AI Executive Playbook",
    description: "A 50-page tactical PDF manifesto detailing exactly how to use ChatGPT and Claude to replace a marketing department, scale lead generation, and automate research.\n\n### Tactical Download\n1. Download the PDF to your desktop.\n2. Bookmark the Prompt Database link on Page 12.\n3. Execute Chapter 3 immediately.",
    price: 299,
    category: "Playbooks",
    image: "https://images.unsplash.com/photo-1551288049-bbbda5366991?auto=format&fit=crop&q=80&w=800",
    in_stock: true,
    rating: 4.8,
    features: ['50-Page PDF Manifesto', '150+ Copy-Paste Prompts', 'Outreach Frameworks', 'Case Studies Included', 'Zero Coding Required'],
    specs: { Format: 'PDF', Length: '50 Pages', Tools: 'ChatGPT/Claude', License: 'Personal', Support: 'Community' },
    download_url: "/downloads/ai-executive-playbook.html",
  }
];

export async function POST() {
  try {
    // ── Auth guard ──────────────────────────────────────────────────────────
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || !adminEmail || userEmail !== adminEmail) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required.' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: 'Database service unavailable. Invalid or missing Service Role key.' },
        { status: 500 }
      );
    }

    // ── Check if already seeded ─────────────────────────────────────────────
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { message: 'DB check failed: ' + checkError.message },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({
        message: 'Database already has products. Use POST /api/products/sync to update existing records.',
        alreadySeeded: true,
        tip: 'To force a re-seed, delete all products from Supabase first.',
      });
    }

    // ── Insert full catalog ─────────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(seedProducts)
      .select('id, name');

    if (error) {
      return NextResponse.json(
        { message: 'Seed failed: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length ?? 0} of ${seedProducts.length} products into Supabase.`,
      products: data,
    });

  } catch (err) {
    console.error('[seed] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
