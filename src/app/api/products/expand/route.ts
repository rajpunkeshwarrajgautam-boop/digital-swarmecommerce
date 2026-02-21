import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

const expansionProducts = [
  {
    name: 'Sentinel Research Infiltrator (AI Agent)',
    description: 'An autonomous deep-research intelligence agent. Infiltrates surface and deep web layers to synthesize professional intelligence reports on any target.',
    price: 1000.00,
    category: 'AI Agents',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Autonomous Deep Web Scrape', 'Dual-Agent Synthesis Architecture', 'Cyberpunk Streamlit UI', 'OpenAI Agents SDK Powered', 'Full Source Code Included'],
    specs: { Format: 'Python / Source', Components: '2 Agents + UI', API: 'OpenAI, Firecrawl', License: 'Resell Rights (MRR)', Support: 'Documentation Provided' }
  }
];

export async function POST() {
  try {
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || !adminEmail || userEmail !== adminEmail) {
      return NextResponse.json({ message: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(expansionProducts)
      .select();

    if (error) {
      return NextResponse.json({ message: 'Expansion failed: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added ${data?.length ?? 0} new "Sentinel" assets to Digital Swarm.`,
      products: data
    });

  } catch (err) {
    console.error('[expand] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
