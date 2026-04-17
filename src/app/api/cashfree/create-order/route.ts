import { randomBytes, randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';
import { fetchWithRetry } from '@/lib/http';
import { products as fallbackProducts } from '@/lib/data';

type CheckoutItem = { id?: string; productId?: string; price: number; quantity?: number };

function isProductUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

/** Cart uses slug ids (e.g. notion-crm-protocol); order_items.product_id FK targets products.id (uuid). */
async function resolveOrderItemProductId(
  admin: NonNullable<typeof supabaseAdmin>,
  rawId: string | undefined,
): Promise<string | null> {
  if (!rawId) return null;
  if (isProductUuid(rawId)) return rawId;
  const staticProduct = fallbackProducts.find((p) => p.id === rawId);
  if (!staticProduct) return null;

  const { data: byName } = await admin
    .from('products')
    .select('id')
    .eq('name', staticProduct.name)
    .maybeSingle();
  if (byName?.id) return byName.id;

  // Production rows often differ by title; slug still appears in download_url / static path.
  const { data: byDownload } = await admin
    .from('products')
    .select('id')
    .ilike('download_url', `%${rawId}%`)
    .maybeSingle();
  if (byDownload?.id) return byDownload.id;

  const { data: byInstall } = await admin
    .from('products')
    .select('id')
    .ilike('install_guide', `%${rawId}%`)
    .maybeSingle();
  if (byInstall?.id) return byInstall.id;

  const { data: byDesc } = await admin
    .from('products')
    .select('id')
    .ilike('description', `%${rawId}%`)
    .maybeSingle();
  if (byDesc?.id) return byDesc.id;

  // Same list price can exist on multiple SKUs; category disambiguates (e.g. Notion vs Source Code @ ₹1499).
  let { data: byPriceCat } = await admin
    .from('products')
    .select('id')
    .eq('price', staticProduct.price)
    .eq('category', staticProduct.category)
    .maybeSingle();
  if (byPriceCat?.id) return byPriceCat.id;

  const catPrefix = staticProduct.category.split(/\s+/)[0];
  if (catPrefix.length >= 3) {
    ({ data: byPriceCat } = await admin
      .from('products')
      .select('id')
      .eq('price', staticProduct.price)
      .ilike('category', `${catPrefix}%`)
      .maybeSingle());
    if (byPriceCat?.id) return byPriceCat.id;
  }

  const meaningful = staticProduct.name
    .replace(/^(The|A|An)\s+/i, '')
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/gi, ''))
    .filter((w) => w.length >= 5)
    .slice(0, 2);
  if (meaningful.length >= 2) {
    const { data: byNameTokens } = await admin
      .from('products')
      .select('id')
      .ilike('name', `%${meaningful[0]}%`)
      .ilike('name', `%${meaningful[1]}%`)
      .maybeSingle();
    if (byNameTokens?.id) return byNameTokens.id;
  } else if (meaningful.length === 1) {
    const { data: byNameToken } = await admin
      .from('products')
      .select('id')
      .ilike('name', `%${meaningful[0]}%`)
      .maybeSingle();
    if (byNameToken?.id) return byNameToken.id;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer, currency = 'INR' } = body;

    const EXCHANGE_RATES: Record<string, number> = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0094,
    };

    const rate = EXCHANGE_RATES[currency as string] || 1;
    const convertedTotal = (parseFloat(total) * rate).toFixed(2);

    const CLIENT_ID = env.CASHFREE_APP_ID!;
    const CLIENT_SECRET = env.CASHFREE_SECRET_KEY!;
    
    // Hard-detect environment based on the Secret Key signature
    const isProdKey = CLIENT_SECRET.startsWith('cfsk_ma_prod_');
    const BASE_URL = isProdKey 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    const SITE_URL = env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, '');

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const totalNum = Number.parseFloat(String(total));
    if (!Number.isFinite(totalNum) || totalNum < 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    const normalizedPhone = String(customer.phone || '').replace(/[^0-9]/g, '');
    const safePhone = normalizedPhone || '9999999999';

    // 1. Generate clean Order ID (suffix avoids rare UNIQUE(cashfree_order_id) collisions)
    const orderId = `DS_${Date.now()}_${randomBytes(3).toString('hex')}`;

    // 1.5. Resolve Affiliate Cookie → get ref_code for commission attribution
    const cookieStore = await cookies();
    const affiliateRef = cookieStore.get('affiliate_id')?.value || null;

    // Validate the ref_code exists in our affiliates table (prevents spoofing)
    let validatedAffiliateRef: string | null = null;
    if (affiliateRef && supabaseAdmin) {
      const { data: affiliateMatch } = await supabaseAdmin
        .from('affiliates')
        .select('ref_code')
        .eq('ref_code', affiliateRef)
        .eq('status', 'active')
        .single();

      if (affiliateMatch?.ref_code) {
        validatedAffiliateRef = affiliateMatch.ref_code;
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    // 2. Create Order in Supabase — insert ONLY base columns (schema.sql). Optional fields
    // (total_amount, affiliate_ref) are applied via UPDATE so a missing migration cannot
    // block payment; extended insert was still failing on some production DBs.
    const customerName = `${customer.firstName} ${customer.lastName}`.trim();
    const orderUuid = randomUUID();
    const minimalOrderRow = {
      id: orderUuid,
      total: totalNum,
      status: 'pending' as const,
      user_id: customer.email,
      cashfree_order_id: orderId,
      customer_email: customer.email,
      customer_name: customerName,
      customer_phone: safePhone,
    };

    // Use raw PostgREST with `Prefer: return=minimal` so the INSERT has no RETURNING clause.
    // The Supabase JS client defaults to `return=representation`, which makes PostgREST project
    // every column into the response; any column present in Postgres but missing from the
    // API schema cache surfaces as PGRST204 (production issue after ALTER TABLE).
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    const restRes = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(minimalOrderRow),
    });

    if (!restRes.ok) {
      let orderError: { code?: string; message?: string; hint?: string | null } = {};
      try {
        orderError = (await restRes.json()) as { code?: string; message?: string; hint?: string | null };
      } catch {
        orderError = { message: await restRes.text() };
      }
      console.error('[DB Error] orders insert (REST)', restRes.status, orderError);
      return NextResponse.json(
        {
          error: 'Database record failed',
          code: orderError.code,
          message: orderError.message,
          hint: orderError.hint,
        },
        { status: 500 },
      );
    }

    const order = { id: orderUuid };

    const optional: Record<string, number | string> = { total_amount: totalNum };
    if (validatedAffiliateRef) optional.affiliate_ref = validatedAffiliateRef;

    const { error: optionalErr } = await supabaseAdmin
      .from('orders')
      .update(optional)
      .eq('id', orderUuid);

    if (optionalErr) {
      console.warn('[create-order] Optional orders columns not updated (migration may be pending):', optionalErr.message);
    }

    // 3. Create Order Items (blocking, so we can rollback cleanly on failure)
    const orderItems: Array<{
      order_id: string;
      product_id: string;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items as CheckoutItem[]) {
      const rawPid = item.productId || item.id;
      const productId = await resolveOrderItemProductId(supabaseAdmin, rawPid ? String(rawPid) : undefined);
      if (!productId) {
        await supabaseAdmin.from('orders').delete().eq('id', orderUuid);
        return NextResponse.json(
          { error: `Unknown or unpublished product: ${String(rawPid ?? '')}` },
          { status: 400 },
        );
      }
      orderItems.push({
        order_id: order.id,
        product_id: productId,
        quantity: item.quantity || 1,
        price: item.price,
      });
    }

    const { error: orderItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      // Prevent orphan pending orders with no item rows.
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      console.error('[OrderItems Error]', orderItemsError.message);
      return NextResponse.json(
        {
          error: 'Order item persistence failed',
          code: orderItemsError.code,
          message: orderItemsError.message,
        },
        { status: 500 },
      );
    }

    // 3.5 Log Affiliate impression in create-order (webhook handles commission on payment success)
    if (validatedAffiliateRef) {
      console.log(`[Affiliate] Order ${orderId} attributed to ref: ${validatedAffiliateRef}`);
    }

    // 4. Create Cashfree Order
    const cfPayload = {
      order_id: orderId,
      order_amount: convertedTotal,
      order_currency: currency,
      customer_details: {
        customer_id: customer.email.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 45),
        customer_email: customer.email,
        customer_phone: safePhone.slice(-10),
        customer_name: `${customer.firstName} ${customer.lastName}`.trim().slice(0, 100),
      },
      order_meta: {
        return_url: `${SITE_URL}/success?order_id={order_id}`,
      },
    };

    const cfRes = await fetchWithRetry(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': CLIENT_ID,
        'x-client-secret': CLIENT_SECRET,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(cfPayload),
      timeoutMs: 10000,
      retries: 2,
      retryDelayMs: 700,
    });

    interface CashfreeOrderResponse {
      order_id: string;
      payment_session_id: string;
      cf_order_id: string;
      order_status: string;
      message?: string;
      code?: string;
      type?: string;
    }

    const cfData = await cfRes.json() as CashfreeOrderResponse;

    if (!cfRes.ok) {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      console.error('[Cashfree Error Response]', {
        status: cfRes.status,
        data: cfData,
        keysUsed: `${CLIENT_ID.substring(0, 5)}... / ${CLIENT_SECRET.substring(0, 12)}...`
      });
      return NextResponse.json({ 
        error: cfData.message || 'Payment Gateway Authentication Failed',
        code: cfData.code,
        type: cfData.type
      }, { status: 500 });
    }

    // Order created successfully
    console.log('[Cashfree Order Created]', {
      orderId: cfData.order_id,
      hasSessionId: !!cfData.payment_session_id,
      mode: isProdKey ? "production" : "sandbox"
    });

    return NextResponse.json({
      success: true,
      orderId: cfData.order_id,
      paymentSessionId: cfData.payment_session_id,
      cfMode: isProdKey ? "production" : "sandbox"
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Checkout API Error]', error);
    const isTimeout = error.name === 'AbortError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'Payment gateway timed out. Please try again.'
          : error.message,
      },
      { status: 500 }
    );
  }
}
