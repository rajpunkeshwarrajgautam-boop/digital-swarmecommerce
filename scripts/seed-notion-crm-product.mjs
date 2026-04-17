/**
 * One-off: ensure public.products has the storefront SKU for notion-crm-protocol.
 * Run: node scripts/seed-notion-crm-product.mjs
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const sb = createClient(url, key);

// Keep columns minimal so a stricter / older PostgREST schema cache still accepts the row.
const row = {
  name: 'The Ultimate Freelancer CRM',
  description:
    'Your complete freelance operating system. This production-ready Notion template automates client invoicing, tracks every project milestone, and centralizes all client communication in one ruthlessly efficient dashboard. Includes 15 pre-built database views, automated status updates, and a revenue tracking system — ready to use in under 2 minutes.',
  price: 1499,
  category: 'Notion Systems',
  image:
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800',
  in_stock: true,
  rating: 5.0,
  download_url: '/downloads/notion-crm-protocol.html',
};

const name = row.name;
const { data: existing } = await sb.from('products').select('id').eq('name', name).maybeSingle();

let data;
let error;
if (existing?.id) {
  ({ data, error } = await sb
    .from('products')
    .update({
      description: row.description,
      price: row.price,
      category: row.category,
      image: row.image,
      in_stock: row.in_stock,
      rating: row.rating,
      download_url: row.download_url,
    })
    .eq('id', existing.id)
    .select('id,name,price,category,download_url')
    .single());
} else {
  ({ data, error } = await sb.from('products').insert(row).select('id,name,price,category,download_url').single());
}

if (error) {
  console.error('WRITE_ERROR', error.message, error.code, error.details);
  process.exit(1);
}

console.log('WRITE_OK', JSON.stringify(data));
