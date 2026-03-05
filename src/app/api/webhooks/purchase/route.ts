import { NextResponse } from "next/server";

/**
 * MOCK POST-PURCHASE WEBHOOK PROCESSOR
 * When a payment succeeds (Stripe/Plural/Cashfree), it hits this webhook.
 * This script allocates the product to the user's dashboard and initiates the Resend.com 5-day email sequence.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Verify Payment Authenticity (Mocked)
    if (!payload.orderId || !payload.customerEmail) {
      return NextResponse.json({ error: "Missing payload data" }, { status: 400 });
    }

    // 2. Generate secure JWT License Key
    const jwtHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64url');
    const jwtPayload = Buffer.from(JSON.stringify({ 
      orderId: payload.orderId, 
      email: payload.customerEmail, 
      exp: Math.floor(Date.now() / 1000) + (100 * 365 * 24 * 60 * 60) // 100 years
    })).toString('base64url');
    const mockSignature = "secure_automated_signature";
    const licenseKey = `${jwtHeader}.${jwtPayload}.${mockSignature}`;

    // 3. Save to Supabase (Mock representation)
    // await supabase.from('customer_licenses').insert({
    //   user_email: payload.customerEmail,
    //   order_id: payload.orderId,
    //   license_key: licenseKey,
    //   license_tier: payload.isWhitelabel ? 'whitelabel' : 'standard'
    // });

    // 4. Trigger Email Sequence using Resend (Mocked)
    // await resend.emails.send({
    //   from: 'Alex @ Digital Swarm <alex@digitalswarm.in>',
    //   to: payload.customerEmail,
    //   subject: 'Your Access Granted + Important Setup Instructions',
    //   html: `<p>Here is your license key: ${licenseKey}</p>`
    // });
    
    console.log(`[WEBHOOK SUCCESS] License generated and Email Sequence initiated for ${payload.customerEmail}`);

    return NextResponse.json({ 
      success: true, 
      message: "Order processed, license generated, email sequence active.",
      licenseKey
    });

  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
