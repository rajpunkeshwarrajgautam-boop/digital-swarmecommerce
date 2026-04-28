import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { products } from '@/lib/data';
import { currentUser } from '@clerk/nextjs/server';

/**
 * 🛰️ VAULT HYDRATION PROTOCOL
 * ----------------------------
 * Fetches Digital Swarm Tokens for the authenticated user.
 * Joins DB token records with the static product registry.
 */
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Auth uplink required' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'Identity resolution failure' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database uplink offline' }, { status: 500 });
    }

    // 1. Fetch Tokens for this user
    const { data: tokens, error } = await supabaseAdmin
      .from('digital_tokens')
      .select('*')
      .eq('owner_id', user.id) // Or owner_email if you prefer
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[VAULT_HYDRATION_ERROR] DB query failed:', error.message);
      return NextResponse.json({ tokens: [] });
    }

    // 2. Hydrate with Product Data & Generate Secure Signed URLs
    const hydratedTokens = await Promise.all(tokens.map(async (token) => {
      const product = products.find(p => p.id === token.product_id);
      let secureUrl = product?.downloadUrl || null;
      
      // Upgrade static downloadUrl to dynamic cryptographic signed URL (1-hour TTL)
      if (product && product.downloadUrl && product.downloadUrl.includes('.')) {
        const filename = product.downloadUrl.split('/').pop();
        if (filename) {
          const { data: signedData } = await supabaseAdmin!.storage
            .from('digital_assets')
            .createSignedUrl(filename, 3600); // 1 hour access
            
          if (signedData?.signedUrl) {
            secureUrl = signedData.signedUrl;
          }
        }
      }

      return {
        ...token,
        product: product ? {
          ...product,
          downloadUrl: secureUrl // Inject secured URL
        } : {
          name: 'Unknown Artifact',
          category: 'Legacy Data',
          image: '/images/placeholders/token-fallback.png'
        }
      };
    }));

    return NextResponse.json({ 
      tokens: hydratedTokens,
      stats: {
        total: hydratedTokens.length,
        nodes: [...new Set(hydratedTokens.map(t => t.mint_node))].length,
        rank: getNetworkRank(hydratedTokens.length)
      }
    });

  } catch (err) {
    console.error('Vault hydration logic failure:', err);
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
