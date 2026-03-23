import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Requires RESEND_API_KEY environment variable
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use service role for Cron execution

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  // Authorization layer (Prevent public triggering)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return NextResponse.json({ error: 'Unauthorized CRON execution' }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'Resend infrastructure offline. Missing API Key.' }, { status: 500 });
  }

  try {
    // 1. Fetch carts where status is 'pending' and created > 1 hour ago
    // In production, we assume Vercel Cron hits this exact file every 1 hour.
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: pendingCarts, error: fetchError } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', oneHourAgo)
      .limit(50); // Process in batches to avoid serverless timeout

    if (fetchError) throw fetchError;
    if (!pendingCarts || pendingCarts.length === 0) {
      return NextResponse.json({ message: 'Zero abandoned vectors detected.' });
    }

    let recoveredCount = 0;

    // 2. Transmit the highly-engineered Resend Sequence
    for (const cart of pendingCarts) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${RESEND_API_KEY}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Digital Swarm Auto-Agent <command@digitalswarm.in>',
          to: cart.email,
          subject: '[ALERT] Missing Protocol Modules Discovered',
          html: \`
            <div style="font-family: monospace; background: #000; color: #CCFF00; padding: 40px; text-align: center;">
              <h1 style="text-transform: uppercase;">System Alert</h1>
              <p style="color: #fff;">Our telemetry systems indicate your AI Agents are currently stranded in the checkout matrix.</p>
              <br/>
              <p style="color: #888;">Hardware Manifest: \${cart.cart_data.length} modules awaiting initialization.</p>
              <br/>
              <div style="padding: 20px; border: 2px dashed #CCFF00; display: inline-block;">
                <p style="color: #fff; margin:0;">To complete your deployment, I have generated a temporary clearance code giving you <strong>15% OFF</strong>.</p>
                <h2 style="margin: 10px 0;">USE CODE: SWARM15</h2>
              </div>
              <br/><br/>
              <a href="https://digitalswarm.in/checkout" style="background: #CCFF00; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Initialize Deployment -></a>
            </div>
          \`
        })
      });

      if (emailRes.ok) {
        // 3. Mark as Contacted
        await supabase
          .from('abandoned_carts')
          .update({ status: 'emailed' })
          .eq('id', cart.id);
        
        recoveredCount++;
      }
    }

    return NextResponse.json({ success: true, processed: recoveredCount });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
