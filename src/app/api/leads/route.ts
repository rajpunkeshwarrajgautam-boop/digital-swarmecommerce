import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY?.trim() ?? "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://digitalswarm.in';

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const cleanEmail = (email as string).toLowerCase().trim();

    // 1. Insert lead into leads table
    const { error: leadError } = await supabaseAdmin.from('leads').insert({ 
      email: cleanEmail,
      source: (source as string) || 'exit_intent'
    });
    
    // Ignore unique constraint errors (duplicate lead)
    if (leadError && leadError.code !== '23505') {
       console.error('[Leads Insert Error]', leadError);
       return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
    }

    // 2. Enrol in email drip sequence (step 0, first drip fires in 2 days)
    const { error: dripError } = await supabaseAdmin
      .from('email_sequences')
      .upsert(
        {
          email: cleanEmail,
          step: 0,
          next_send_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
        },
        { onConflict: 'email', ignoreDuplicates: true }
      );

    if (dripError) {
      console.error('[Drip Enrol Error]', dripError); // Non-fatal
    }

    // 3. Fire immediate PDF delivery email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Digital Swarm <intelligence@digitalswarm.in>',
          to: cleanEmail,
          subject: 'CLASSIFIED: Your Digital Swarm Omega Protocol',
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#0a0a0b;font-family:'Courier New',monospace;">
              <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                <div style="background:#111;border:1px solid #1a1a1a;border-radius:16px;padding:40px;">
                  <h1 style="color:#ccff00;font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">
                    OMEGA PROTOCOL DECRYPTED
                  </h1>
                  <p style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:32px;">
                    ACCESS GRANTED — LEVEL 5 CLEARANCE
                  </p>
                  <p style="color:#ccc;font-size:15px;line-height:1.8;margin-bottom:24px;">
                    You successfully bypassed the network layer. As requested, here is your tactical guide to scaling Autonomous AI Agents for eCommerce.
                  </p>
                  <div style="background:#0a0a0a;border-left:4px solid #ccff00;padding:20px 24px;margin:24px 0;border-radius:0 8px 8px 0;">
                    <a href="${SITE_URL}/omega_protocol.pdf" style="color:#ccff00;text-decoration:none;font-weight:900;font-size:16px;letter-spacing:0.05em;">
                      &#x25B6; DOWNLOAD OMEGA_PROTOCOL.PDF
                    </a>
                  </div>
                  <p style="color:#666;font-size:13px;line-height:1.7;">
                    The paradigm is shifting. Over the next 7 days, we will be sending you intelligence briefings that turn AI theory into real income.
                  </p>
                  <p style="color:#666;font-size:13px;margin-top:24px;">— The Swarm Intelligence</p>
                </div>
              </div>
            </body>
            </html>
          `
        });
        console.log(`[Resend] PDF delivery sent to ${cleanEmail}`);
      } catch (emailError) {
        console.error('[Resend Email Failed]', emailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email securely recorded. Payload unlocked.' 
    });
  } catch (err: unknown) {
    console.error('[Leads API Error]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
