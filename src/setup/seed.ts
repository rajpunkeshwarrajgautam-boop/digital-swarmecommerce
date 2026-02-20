
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("❌ Missing Supabase keys.");
    process.exit(1);
}

const supabase = createClient(url, key);

const products = [
  {
    name: '1000 Manually Tested Web Applications',
    description: 'A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses. Perfect for developers looking for inspiration and robust codebases.',
    price: 200.00,
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase Examples', 'Instant Digital Download'],
    specs: {"Format": "PDF / Source Code", "Size": "1.2 GB", "License": "Personal & Commercial Use", "Compatibility": "Universal", "Updates": "Lifetime Access"}
  },
  {
    name: 'Ultimate Web Development Bundle',
    description: 'The ultimate bundle for web developers, curated by Glexmedia. Includes templates, scripts, UI kits, and essential resources to accelerate your development workflow.',
    price: 200.00,
    category: 'Bundles',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.9,
    features: ['Premium Templates', 'High-Quality UI Kits', 'Useful Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    specs: {"Format": "ZIP / PDF", "Components": "500+", "Technologies": "HTML, CSS, JS, React", "License": "Royalty Free", "Support": "Priority Email Support"}
  },
  {
    name: 'Ultimate Mega Bundle',
    description: 'A massive collection of digital assets, tools, and resources. The Ultimate Mega Bundle is your one-stop shop for premium creative content.',
    price: 200.00,
    category: 'Bundles',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 5.0,
    features: ['Huge Asset Library', 'Diverse Categories', 'High-Resolution Graphics', 'Ready-to-use Code', 'Exclusive Content'],
    specs: {"Total Files": "5000+", "Categories": "Design, Code, Marketing", "File Types": "PSD, AI, HTML, PDF", "Download": "Instant Access", "Validity": "Lifetime"}
  },
  {
    name: 'Web Applications Collection',
    description: 'A curated selection of high-quality web applications. Explore a variety of functional and well-designed apps for your projects.',
    price: 200.00,
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.7,
    features: ['Modern Tech Stack', 'Responsive Designs', 'Well-Documented', 'Easy Customization', 'Performance Optimized'],
    specs: {"Apps Included": "50+", "Frameworks": "React, Vue, Angular", "Backend": "Node.js, Python", "Database": "SQL / NoSQL", "Deployment": "Docker Ready"}
  }
];

async function seed() {
    console.log("🌱 Seeding products...");
    
    // First check if products exist to avoid duplicates (optional, but good)
    const { count, error: countError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    if (countError) {
        console.error("❌ Error checking table:", countError.message);
        return;
    }

    if (count !== null && count > 0) {
        console.log(`⚠️ Table already has ${count} products. Skipping seed to avoid duplicates.`);
        return;
    }

    const { data, error } = await supabase.from('products').insert(products).select();

    if (error) {
        console.error("❌ Insert failed:", error.message);
        console.error("   Note: If using Anon Key, ensure RLS policies allow INSERT.");
    } else {
        console.log(`✅ Successfully inserted ${data.length} products!`);
    }
}

seed();
