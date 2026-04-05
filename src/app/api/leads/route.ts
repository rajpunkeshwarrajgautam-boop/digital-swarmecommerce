import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const { error } = await supabaseAdmin.from('leads').insert({ 
      email: email.toLowerCase().trim(),
      source: source || 'unknown_utility'
    });
    
    // Ignore unique constraint errors (if they generate a prompt 2x)
    if (error && error.code !== '23505') {
       console.error('[Leads Insert Error]', error);
       return NextResponse.json({ error: 'Failed to record lead' }, { status: 500 });
    }

    // Fire the Automated PDF Delivery Email via Resend
    if (resend) {
      try {
        await resend.emails.send({
          from: 'Digital Swarm <onboarding@resend.dev>',
          to: email.toLowerCase().trim(),
          subject: 'CLASSIFIED: Your Digital Swarm Omega Protocol',
          html: `
            <div style="font-family: monospace; background-color: #0A0A0B; color: #FFFFFF; padding: 40px; border: 1px solid #1A1A1A;">
               <h1 style="color: #CCFF00; font-size: 24px;">OMEGA PROTOCOL DECRYPTED</h1>
               <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6;">You successfully bypassed the network layer. As requested, here is your tactical guide to scaling Autonomous Agents.</p>
               <br/>
               <div style="background-color: #111; padding: 20px; border-left: 4px solid #CCFF00; margin: 20px 0;">
                 <a href="https://digitalswarm.in" style="color: #CCFF00; text-decoration: none; font-weight: bold; font-size: 16px;">
                   [CLICK HERE TO DOWNLOAD OMEGA_PROTOCOL.PDF]
                 </a>
               </div>
               <br/>
               <p style="color: #A1A1AA; font-size: 14px;">The paradigm is shifting soon. Stay ready.</p>
               <p style="color: #A1A1AA; font-size: 14px;">— The Swarm Intelligence</p>
            </div>
          `
        });
        console.log(`[Resend] Successfully fired Welcome Email to ${email}`);
      } catch (emailError) {
        console.error('[Resend Welcome Email Failed]', emailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email securely recorded. Payload unlocked.' 
    });
  } catch (err: any) {
    console.error('[Leads API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
