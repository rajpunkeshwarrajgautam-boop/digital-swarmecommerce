import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 100,
});

/**
 * 🛰️ MERCHANT UPLINK
 * -------------------
 * Processes a proposal for a new merchant node.
 * Records the data in the 'merchant_applications' table.
 */
export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    
    // 1. Rate Limit: 3 applications per hour per IP
    try {
      await limiter.check(3, ip);
    } catch {
      return NextResponse.json({ error: 'System busy. Node uplink already active for this IP.' }, { status: 429 });
    }

    const { nodeName, specialization, portfolioUrl, description, contactEmail } = await request.json();

    if (
      !nodeName?.trim() ||
      !specialization?.trim() ||
      !portfolioUrl?.trim() ||
      !contactEmail?.trim() ||
      !description?.trim()
    ) {
      return NextResponse.json({ error: 'Incomplete node credentials.' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database uplink offline.' }, { status: 500 });
    }

    // 2. Record Application
    const { error } = await supabaseAdmin
      .from('merchant_applications')
      .insert({
        node_name: nodeName,
        specialization,
        portfolio_url: portfolioUrl,
        description,
        contact_email: contactEmail,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    // Note: If the table doesn't exist, this will error. 
    // In a production environment, this migration would be part of Phase 8.4 setup.
    if (error) {
      console.error('[ONBOARDING_ERROR] Database failure:', error.message);
      return NextResponse.json(
        {
          error:
            'We could not save your application. Confirm the merchant_applications table exists, or email ops@digitalswarm.in.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Node proposal broadcasted to the Swarm Council.' 
    });

  } catch (err) {
    console.error('Merchant apply logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Fault' }, { status: 500 });
  }
}
