import { NextResponse } from 'next/server';
import { SwarmAnalyticsService } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pulse = await SwarmAnalyticsService.getSwarmPulse();
    const rankings = await SwarmAnalyticsService.getTopPerformers();

    return NextResponse.json({
      pulse,
      rankings,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[API_FAULT] Pulse fetch failure:', err);
    return NextResponse.json({ error: 'Sync failure' }, { status: 500 });
  }
}
