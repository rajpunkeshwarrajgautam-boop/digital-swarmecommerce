import { NextResponse } from 'next/server';
import { GovernanceService } from '@/lib/governance';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * 🏛️ PROPOSAL BROADCAST UPLINK
 * ----------------------------
 * Only agents with "CORE" rank or higher can initiate a broadcast.
 */
export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Auth context required' }, { status: 401 });
    }

    // 1. Verify Swarm Rank (Asset Count Check)
    const { count } = await supabaseAdmin!
      .from('digital_tokens')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);

    const assetCount = count || 0;
    if (assetCount < 3) { // Requires "CORE" rank (3+ tokens)
      return NextResponse.json({ 
        error: 'Insufficient Rank: Only CORE Agents (3+ Assets) can broadcast proposals.' 
      }, { status: 403 });
    }

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Incomplete proposal metadata' }, { status: 400 });
    }

    // 2. Initiate Governance Record
    const result = await GovernanceService.createProposal(user.id, title, description);

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        id: result.id,
        message: 'Governance proposal successfully synchronized to the nexus.' 
      });
    } else {
      return NextResponse.json({ error: 'Internal Governance Sync Fault' }, { status: 500 });
    }

  } catch (err) {
    console.error('[DAO_API_FAULT] Internal logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Sync Fault' }, { status: 500 });
  }
}
