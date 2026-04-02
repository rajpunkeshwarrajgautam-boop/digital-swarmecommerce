"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// 🚨 ADMIN WHITELIST 🚨
const MASTER_ADMIN_EMAILS = [
  "admin@digitalswarm.in",
  "rajpunkeshwarrajgautam@gmail.com",
  "test@example.com"
];

async function verifyAdmin() {
  const user = await currentUser();
  const primaryEmail = user?.emailAddresses[0]?.emailAddress;
  
  if (!primaryEmail || !MASTER_ADMIN_EMAILS.includes(primaryEmail.toLowerCase())) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }
}

/**
 * PRODUCT MANAGEMENT PROTOCOLS
 */
export async function getAdminProducts() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin!
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function getAdminProduct(id: string) {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin!
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) throw error;
  return data;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  is_visible?: boolean;
  is_verified?: boolean;
  merchant_id?: string;
}

export async function createAdminProduct(data: ProductInput) {
  await verifyAdmin();
  const { error } = await supabaseAdmin!
    .from("products")
    .insert(data);
    
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateAdminProduct(id: string, data: Partial<ProductInput>) {
  await verifyAdmin();
  const { error } = await supabaseAdmin!
    .from("products")
    .update(data)
    .eq("id", id);
    
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAdminProduct(id: string) {
  await verifyAdmin();
  const { error } = await supabaseAdmin!
    .from("products")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

/**
 * LOGISTICS AUDIT PROTOCOLS
 */
export async function getAdminOrders() {
  await verifyAdmin();
  const { data, error } = await supabaseAdmin!
    .from("orders")
    .select(`
      *,
      order_items (
        price,
        quantity,
        products (name)
      )
    `)
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data;
}

export interface RecentCart {
  email: string | null;
  created_at: string;
  recovered: boolean;
}

export interface RecentAffiliate {
  id: string;
  user_id: string;
  total_earnings: number;
}

export interface RecentPending {
  id: string;
  name: string;
  merchant_id: string;
  created_at: string;
}

export interface AdminStats {
  grossVolume: number;
  mrr: number;
  leadsCount: number;
  affiliatesCount: number;
  recentCarts: RecentCart[];
  recentAffiliates: RecentAffiliate[];
  pendingSyncCount: number;
  recentPending: RecentPending[];
}

export async function getAdminStats(): Promise<AdminStats> {
  await verifyAdmin();
  
  const [
    { data: orders },
    { count: leads },
    { count: affiliates },
    { data: recentCarts },
    { data: recentAffiliates },
    { data: recentPending }
  ] = await Promise.all([
    supabaseAdmin!.from("orders").select("total, status").eq("status", "paid"),
    supabaseAdmin!.from("leads").select("*", { count: "exact", head: true }),
    supabaseAdmin!.from("affiliates").select("*", { count: "exact", head: true }),
    supabaseAdmin!.from("abandoned_carts").select("email, created_at, recovered").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin!.from("affiliates").select("id, user_id, total_earnings").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin!.from("products").select("id, name, merchant_id, created_at").eq("is_verified", false).order("created_at", { ascending: false }).limit(5)
  ]);
  
  const pendingSyncCount = (await supabaseAdmin!.from("products").select("*", { count: "exact", head: true }).eq("is_verified", false)).count || 0;

  const grossVolume = orders?.reduce((acc: number, curr: { total: number }) => acc + (curr.total || 0), 0) || 0;
  const mrr = grossVolume * 0.15; 

  return {
    grossVolume,
    mrr,
    leadsCount: leads || 0,
    affiliatesCount: affiliates || 0,
    recentCarts: (recentCarts as unknown as RecentCart[]) || [],
    recentAffiliates: (recentAffiliates as unknown as RecentAffiliate[]) || [],
    pendingSyncCount,
    recentPending: (recentPending as unknown as RecentPending[]) || []
  };
}
