import { redirect } from "next/navigation";

/**
 * Legacy checkout-success URL. The old screen generated a fake confirmation
 * number and showed an inert download/GitHub-invite panel without verifying a
 * payment. Route it to the Cashfree-verifying success screen instead.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawOrderId = Array.isArray(params.order_id) ? params.order_id[0] : params.order_id;
  const orderId = rawOrderId?.trim();
  redirect(orderId ? `/success?order_id=${encodeURIComponent(orderId)}` : "/success");
}
