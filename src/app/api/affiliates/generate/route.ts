import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function POST() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, message: 'Database service unavailable' }, { status: 500 });
    }

    // Check if affiliate record already exists
    const { data: existing } = await supabaseAdmin
      .from('affiliates')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, affiliate: existing });
    }

    // Generate a clean crypto referral code based on their name or generic hash
    const nameSlug = user.firstName ? user.firstName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'partner';
    const randomHash = Math.random().toString(36).substring(2, 7);
    const referralCode = `${nameSlug}_${randomHash}`;

    // Create new affiliate record
    const { data: newAffiliate, error } = await supabaseAdmin
      .from('affiliates')
      .insert({
        user_id: user.id,
        referral_code: referralCode,
        total_earnings: 0.00,
        total_clicks: 0
      })
      .select('*')
      .single();

    if (error) {
      console.error('Failed creating affiliate record:', error);
      return NextResponse.json({ success: false, message: 'Database constraint failure.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, affiliate: newAffiliate });

  } catch (err) {
    console.error('[affiliate generate] Unexpected error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
