import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { products } from '@/lib/data';
import { isSellableProductId, sanitizeCatalogText } from '@/lib/catalog-integrity';
import { recordCommission } from '@/lib/commissions';
import { sealTransaction } from '@/lib/ledger';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resendApiKey = process.env.RESEND_API_KEY?.trim() || '';
const resend = resendApiKey ? new Resend(resendApiKey) : null;

function safeSecretEqual(candidate: string, expected: string): boolean {
  if (!candidate || candidate.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
  } catch {
    return false;
  }
}

function authorizeInternalFulfillment(request: Request): boolean {
  const expected = process.env.INTERNAL_FULFILLMENT_SECRET?.trim();
  if (!expected || expected.length < 32) return false;
  return safeSecretEqual(request.headers.get('x-internal-fulfillment-secret')?.trim() || '', expected);
}

function createLicenseKey(orderId: string, email: string, productId: string): string {
  const secret = process.env.LICENSE_SIGNING_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error('LICENSE_SIGNING_SECRET is not configured');

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ orderId, email, productId, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[char] || char);
}

export async function POST(request: Request) {
  if (!authorizeInternalFulfillment(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const orderId = typeof payload?.orderId === 'string' ? payload.orderId.trim() : '';
    const requestedProductId = typeof payload?.productId === 'string' ? payload.productId.trim() : '';

    if (!orderId || !requestedProductId || orderId.length > 180 || requestedProductId.length > 180) {
      return NextResponse.json({ error: 'Invalid fulfillment payload' }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id,customer_email,status,total,total_amount,affiliate_ref')
      .eq('cashfree_order_id', orderId)
      .maybeSingle();

    if (orderError || !order || order.status !== 'paid' || !order.customer_email) {
      return NextResponse.json({ error: 'Paid order not found' }, { status: 409 });
    }

    const customerEmail = String(order.customer_email).trim().toLowerCase();

    const { data: item, error: itemError } = await supabase
      .from('order_items')
      .select('product_id,price,quantity')
      .eq('order_id', order.id)
      .eq('product_id', requestedProductId)
      .maybeSingle();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Product is not part of this paid order' }, { status: 409 });
    }

    const { data: dbProduct, error: productError } = await supabase
      .from('products')
      .select('id,name')
      .eq('id', requestedProductId)
      .maybeSingle();

    if (productError || !dbProduct?.name) {
      return NextResponse.json({ error: 'Catalog product not found' }, { status: 409 });
    }

    const product = products.find((entry) => entry.name === dbProduct.name);
    if (!product || !product.inStock || !product.downloadUrl || !isSellableProductId(product.id)) {
      return NextResponse.json({ error: 'Product is not approved for fulfillment' }, { status: 409 });
    }

    const filename = decodeURIComponent(product.downloadUrl.split('/').pop() || '');
    if (!filename || !filename.includes('.')) {
      return NextResponse.json({ error: 'Product delivery asset is not configured' }, { status: 503 });
    }

    const { data: signedData, error: signError } = await supabase.storage
      .from('digital_assets')
      .createSignedUrl(filename, 60 * 60 * 24 * 3, { download: filename });

    if (signError || !signedData?.signedUrl) {
      console.error('[fulfillment] Missing private delivery asset', { filename, message: signError?.message });
      return NextResponse.json({ error: 'Product delivery asset is unavailable' }, { status: 503 });
    }

    const licenseTier = Number(item.price) >= product.price * 5 ? 'whitelabel' : 'standard';

    const { data: existingLicense, error: existingLicenseError } = await supabase
      .from('customer_licenses')
      .select('id,license_key')
      .eq('order_id', orderId)
      .eq('product_id', requestedProductId)
      .maybeSingle();
    if (existingLicenseError) {
      return NextResponse.json({ error: 'License lookup failed' }, { status: 503 });
    }

    let licenseKey = existingLicense?.license_key || '';
    let licenseCreated = false;
    if (!licenseKey) {
      licenseKey = createLicenseKey(orderId, customerEmail, requestedProductId);
      const { error: licenseError } = await supabase.from('customer_licenses').insert({
        user_email: customerEmail,
        order_id: orderId,
        license_key: licenseKey,
        license_tier: licenseTier,
        product_id: requestedProductId,
      });

      if (licenseError) {
        console.error('[fulfillment] License persistence failed', licenseError);
        return NextResponse.json({ error: 'Fulfillment persistence failed' }, { status: 500 });
      }
      licenseCreated = true;
    }

    const { data: existingCommission } = await supabase
      .from('commissions')
      .select('id')
      .eq('order_id', orderId)
      .maybeSingle();

    if (!existingCommission) {
      try {
        const orderTotal = Number(order.total_amount ?? order.total ?? 0);
        const { splits } = await recordCommission(orderId, {
          totalAmount: orderTotal,
          merchantId: product.merchantId || 'SYSTEM',
          affiliateId: order.affiliate_ref || null,
        });
        await sealTransaction({ transactionId: orderId, payload: { orderId, splits, timestamp: new Date().toISOString() } });
      } catch (commissionError) {
        console.error('[fulfillment] Financial sync failed', commissionError);
      }
    }

    if (!resend) {
      console.error('[fulfillment] RESEND_API_KEY missing; delivery email not sent');
      return NextResponse.json({ error: 'License created but delivery email service is unavailable' }, { status: 503 });
    }

    try {
      const safeProduct = escapeHtml(product.name);
      const safeGuide = escapeHtml(sanitizeCatalogText(product.installGuide || 'Open the supplied asset and follow its included instructions.'));
      const { error: emailError } = await resend.emails.send({
        from: 'Digital Swarm <no-reply@digitalswarm.in>',
        to: customerEmail,
        subject: `Your Digital Swarm access: ${safeProduct}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#07070b;color:#f6f1e8;padding:40px">
            <div style="max-width:640px;margin:auto;border:1px solid #302b22;border-radius:20px;padding:32px;background:#0c0c12">
              <p style="letter-spacing:3px;font-size:11px;color:#d9bd7c">DIGITAL SWARM / PAYMENT VERIFIED</p>
              <h1 style="font-size:30px;margin:18px 0">${safeProduct}</h1>
              <p style="color:#b7b3aa;line-height:1.7">Your private download link is valid for 72 hours. If it expires, contact support@digitalswarm.in with your order ID.</p>
              <div style="margin:24px 0;padding:16px;border-radius:12px;background:#050509;color:#d9bd7c;font-family:monospace;font-size:11px;word-break:break-all">${licenseKey}</div>
              <pre style="white-space:pre-wrap;color:#aaa6a0;font-size:12px;line-height:1.6">${safeGuide}</pre>
              <a href="${signedData.signedUrl}" style="display:block;margin-top:24px;padding:16px;border-radius:12px;background:#d9bd7c;color:#09090d;text-decoration:none;text-align:center;font-weight:800">OPEN PRIVATE DOWNLOAD</a>
            </div>
          </div>`,
      });
      if (emailError) throw emailError;
    } catch (resendError) {
      console.error('[fulfillment] Delivery email failed', resendError);
      return NextResponse.json({ error: 'License is ready but delivery email failed; retry fulfillment' }, { status: 503 });
    }

    return NextResponse.json({ success: true, message: licenseCreated ? 'Fulfillment completed' : 'Fulfillment re-sent' });
  } catch (error) {
    console.error('[fulfillment] Unexpected failure', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
