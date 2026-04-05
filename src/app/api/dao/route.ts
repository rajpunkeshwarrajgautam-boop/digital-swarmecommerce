import { NextResponse } from 'next/server';
import { GovernanceService, Proposal } from '@/lib/governance';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * 🏛️ GOVERNANCE NEXUS OVERVIEW
 * ----------------------------
 * Fetches treasury and proposal status for the community.
 */
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database uplink offline' }, { status: 500 });
    }

    // 1. Fetch Treasury Metrics
    const treasuryBalance = await GovernanceService.getTreasuryBalance();

    // 2. Fetch Active Proposals
    const { data: proposals, error } = await supabaseAdmin
      .from('dao_proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ 
      treasuryBalance,
      proposals: proposals || []
    });

  } catch (err) {
    console.error('[DAO_API_OVERVIEW_FAULT] Internal logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Sync Fault' }, { status: 500 });
  }
}
