import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products } from '@/lib/data';

/**
 * 🌐 SOCIAL HYDRATION PROTOCOL
 * ----------------------------
 * Fetches public-safe token data for a specific user.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database uplink offline' }, { status: 500 });
    }

    // 1. Fetch Public Tokens for this user
    const { data: tokens, error } = await supabaseAdmin
      .from('digital_tokens')
      .select('id, product_id, created_at, metadata')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SOCIAL_HYDRATION_ERROR] DB query failed:', error.message);
      return NextResponse.json({ tokens: [] });
    }

    // 2. Hydrate with Sanity-Checked Product Data
    const publicTokens = tokens.map(token => {
      const product = products.find(p => p.id === token.product_id);
      return {
        id: token.id,
        created_at: token.created_at,
        product: product ? {
          name: product.name,
          category: product.category,
          image: product.image
        } : {
          name: 'Classified Artifact',
          category: 'Unknown',
          image: '/images/placeholders/token-fallback.png'
        }
      };
    });

    return NextResponse.json({ 
      userId,
      tokens: publicTokens,
      stats: {
        total: publicTokens.length,
        rank: getNetworkRank(publicTokens.length)
      }
    });

  } catch (err) {
    console.error('Social hydration logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Fault' }, { status: 500 });
  }
}

function getNetworkRank(count: number): string {
  if (count === 0) return 'INITIATE';
  if (count < 3) return 'STRIKER';
  if (count < 7) return 'INFILTRATOR';
  if (count < 15) return 'ARCHITECT';
  return 'SWARM_PRIME';
}
