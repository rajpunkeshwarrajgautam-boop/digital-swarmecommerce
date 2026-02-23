
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const updates = [
  {
    name: '1000 Manually Tested Web Applications',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&auto=format&fit=crop&q=80',
    price: 200
  },
  {
    name: 'Ultimate Web Development Bundle',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    price: 200
  },
  {
    name: 'Ultimate Mega Bundle',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80',
    price: 200
  },
  {
    name: 'Web Applications Collection',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    price: 200
  }
];

async function updateProducts() {
  console.log("🛰️ SYNCHRONIZING DIGITAL ASSETS WITH STORE DATABASE...");
  for (const item of updates) {
    const { error } = await supabase
      .from('products')
      .update({ image: item.image, price: item.price })
      .eq('name', item.name);
    
    if (error) console.error(`Error updating ${item.name}:`, error.message);
    else console.log(`✅ ${item.name} synced and updated.`);
  }
}

updateProducts();
