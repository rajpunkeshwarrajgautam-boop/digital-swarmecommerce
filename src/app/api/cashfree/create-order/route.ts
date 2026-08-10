import { randomBytes, randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';
import { fetchWithRetry } from '@/lib/http';
import { products as catalogProducts } from '@/lib/data';
import { isSellableProductId } from '@/lib/catalog-integrity';

type CheckoutItem = {
  id?: string;
  productId?: string;
  quantity?: number;
};

const WHITELABEL_SUFFIX = '-whitelabel';
const MAX_CART_ITEMS = 20;
const MAX_QUANTITY = 10;

function parseCartIdentity(rawId: string) {
  const isWhitelabel = rawId.toLowerCase().endsWith(WHITELABEL_SUFFIX);
  const slug = isWhitelabel ? rawId.slice(0, -WHITELABEL_SUFFIX.length) : rawId;
  return { slug, isWhitelabel };
}

function normalizeQuantity(value: unknown): number | null {
  const quantity = Number(value ?? 1);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null;
  return quantity;
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
    }

    const body = await request.json();
    const items = Array.isArray(body?.items) ? (body.items as CheckoutItem[]) : [];
    const customer = body?.customer;

    if (!items.length || items.length > MAX_CART_ITEMS || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const email = String(customer.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid customer email' }, { status: 400 });
    }

    const normalizedPhone = String(customer.phone || '').replace(/[^0-9]/g, '');
    const safePhone = normalizedPhone || '9999999999';
    const customerName = `${String(customer.firstName || '').trim()} ${String(customer.lastName || '').trim()}`.trim();

    const authoritativeItems: Array<{
      order_id: string;
      product_id: string;
      quantity: number;
      price: number;
    }> = [];

    const orderUuid = randomUUID();
    let authoritativeTotal = 0;

    for (const item of items) {
      const rawId = String(item.productId || item.id || '').trim();
      if (!rawId) {
        return NextResponse.json({ error: 'Cart contains an invalid product' }, { status: 400 });
      }

      const quantity = normalizeQuantity(item.quantity);
      if (!quantity) {
        return NextResponse.json({ error: 'Invalid product quantity' }, { status: 400 });
      }

      const { slug, isWhitelabel } = parseCartIdentity(rawId);
      const catalogProduct = catalogProducts.find(
        (product) => product.id === slug && product.inStock && isSellableProductId(product.id),
      );
      if (!catalogProduct) {
        return NextResponse.json({ error: `Unknown or unavailable product: ${slug}` }, { status: 400 });
      }

      const { data: dbProduct, error: productError } = await supabaseAdmin
        .from('products')
        .select('id, in_stock')
        .eq('name', catalogProduct.name)
        .maybeSingle();

      if (productError || !dbProduct?.id || dbProduct.in_stock === false) {
        console.error('[checkout] Catalog/DB product mismatch', { slug, message: productError?.message });
        return NextResponse.json({ error: `Product is not available for checkout: ${catalogProduct.name}` }, { status: 409 });
      }

      const unitPrice = Number((catalogProduct.price * (isWhitelabel ? 5 : 1)).toFixed(2));
      authoritativeTotal += unitPrice * quantity;
      authoritativeItems.push({
        order_id: orderUuid,
        product_id: dbProduct.id,
        quantity,
        price: unitPrice,
      });
    }

    authoritativeTotal = Number(authoritativeTotal.toFixed(2));
    if (!Number.isFinite(authoritativeTotal) || authoritativeTotal <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    const clientId = env.CASHFREE_APP_ID;
    const clientSecret = env.CASHFREE_SECRET_KEY;
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Payment gateway unavailable' }, { status: 503 });
    }

    const isProdKey = clientSecret.startsWith('cfsk_ma_prod_');
    const baseUrl = isProdKey ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';
    const siteUrl = (env.NEXT_PUBLIC_SITE_URL || 'https://digitalswarm.in').replace(/\/$/, '');
    const cashfreeOrderId = `DS_${Date.now()}_${randomBytes(3).toString('hex')}`;

    const cookieStore = await cookies();
    const affiliateCookie = cookieStore.get('affiliate_id')?.value?.trim() || '';
    let validatedAffiliateRef: string | null = null;

    if (affiliateCookie) {
      const { data: affiliate } = await supabaseAdmin
        .from('affiliates')
        .select('referral_code')
        .eq('referral_code', affiliateCookie)
        .eq('status', 'active')
        .maybeSingle();
      validatedAffiliateRef = affiliate?.referral_code || null;
    }

    const orderRow = {
      id: orderUuid,
      total: authoritativeTotal,
      total_amount: authoritativeTotal,
      status: 'pending' as const,
      user_id: email,
      cashfree_order_id: cashfreeOrderId,
      customer_email: email,
      customer_name: customerName,
      customer_phone: safePhone,
      affiliate_ref: validatedAffiliateRef,
    };

    const { error: orderError } = await supabaseAdmin.from('orders').insert(orderRow);
    if (orderError) {
      console.error('[checkout] Order persistence failed', orderError);
      return NextResponse.json({ error: 'Order persistence failed' }, { status: 500 });
    }

    const { error: itemError } = await supabaseAdmin.from('order_items').insert(authoritativeItems);
    if (itemError) {
      await supabaseAdmin.from('orders').delete().eq('id', orderUuid);
      console.error('[checkout] Order item persistence failed', itemError);
      return NextResponse.json({ error: 'Order item persistence failed' }, { status: 500 });
    }

    const cfPayload = {
      order_id: cashfreeOrderId,
      order_amount: authoritativeTotal,
      order_currency: 'INR',
      customer_details: {
        customer_id: email.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 45),
        customer_email: email,
        customer_phone: safePhone.slice(-10),
        customer_name: customerName.slice(0, 100),
      },
      order_meta: {
        return_url: `${siteUrl}/success?order_id={order_id}`,
      },
    };

    const cfRes = await fetchWithRetry(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(cfPayload),
      timeoutMs: 10000,
      retries: 2,
      retryDelayMs: 700,
    });

    const cfData = (await cfRes.json()) as {
      order_id?: string;
      payment_session_id?: string;
      message?: string;
      code?: string;
      type?: string;
    };

    if (!cfRes.ok || !cfData.payment_session_id) {
      await supabaseAdmin.from('orders').update({ status: 'failed' }).eq('id', orderUuid);
      console.error('[checkout] Cashfree order creation failed', { status: cfRes.status, code: cfData.code, type: cfData.type });
      return NextResponse.json(
        { error: cfData.message || 'Payment gateway could not create the order', code: cfData.code },
        { status: cfRes.ok ? 502 : cfRes.status },
      );
    }

    return NextResponse.json({
      success: true,
      orderId: cfData.order_id || cashfreeOrderId,
      paymentSessionId: cfData.payment_session_id,
      cfMode: isProdKey ? 'production' : 'sandbox',
      currency: 'INR',
      amount: authoritativeTotal,
    });
  } catch (error) {
    console.error('[checkout] Unexpected failure', error);
    return NextResponse.json({ error: 'Unable to initialize checkout' }, { status: 500 });
  }
}
