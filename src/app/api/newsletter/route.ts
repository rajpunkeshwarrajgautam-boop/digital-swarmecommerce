import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/newsletter
 * Persists a real Resend contact and sends a confirmation email.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    if (!resendApiKey) {
      return NextResponse.json({ error: "Newsletter service is not configured." }, { status: 503 });
    }

    const resend = new Resend(resendApiKey);
    const { error: contactError } = await resend.contacts.create({
      email: normalizedEmail,
      unsubscribed: false,
    });

    if (contactError) {
      const message = String(contactError.message || '').toLowerCase();
      // Existing contacts should remain a successful, idempotent subscription experience.
      if (!message.includes('already') && !message.includes('exist')) {
        console.error('[newsletter] Contact creation failed', contactError);
        return NextResponse.json({ error: "Unable to save subscription." }, { status: 502 });
      }
    }

    const { error: emailError } = await resend.emails.send({
      from: "Digital Swarm <no-reply@digitalswarm.in>",
      to: normalizedEmail,
      subject: "Welcome to Digital Swarm",
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <body style="background:#0a0a0f;color:#fff;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
            <div style="max-width:600px;margin:0 auto;">
              <p style="color:#d8b36a;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:3px;">Digital Swarm</p>
              <h1 style="font-size:30px;margin:12px 0 16px;">Subscription confirmed</h1>
              <p style="color:rgba(255,255,255,.7);font-size:14px;line-height:1.8;">
                You are subscribed to Digital Swarm product releases, practical implementation notes, and store updates.
              </p>
              <a href="https://digitalswarm.in/products" style="display:inline-block;background:#d8b36a;color:#09090d;padding:14px 24px;font-weight:800;font-size:12px;text-decoration:none;margin-top:20px;border-radius:10px;">Browse the catalog</a>
              <p style="color:rgba(255,255,255,.35);font-size:11px;line-height:1.7;margin-top:32px;">
                Future marketing broadcasts are managed through Resend contact preferences and include their supported unsubscribe controls.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('[newsletter] Confirmation email failed', emailError);
      return NextResponse.json({
        success: true,
        message: "Subscribed. Confirmation email could not be sent right now.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to Digital Swarm.",
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
