import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

// The real product catalog to seed into Supabase
const seedProducts = [
  {
    name: '1000 Manually Tested Web Applications',
    description: 'A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses. Perfect for developers looking for inspiration and robust codebases.',
    price: 200.00,
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60',
    in_stock: true,
    rating: 4.8,
    features: ['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase Examples', 'Instant Digital Download'],
    specs: { Format: 'PDF / Source Code', Size: '1.2 GB', License: 'Personal & Commercial Use', Compatibility: 'Universal', Updates: 'Lifetime Access' }
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
    specs: { Format: 'ZIP / PDF', Components: '500+', Technologies: 'HTML, CSS, JS, React', License: 'Royalty Free', Support: 'Priority Email Support' }
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
    specs: { 'Total Files': '5000+', Categories: 'Design, Code, Marketing', 'File Types': 'PSD, AI, HTML, PDF', Download: 'Instant Access', Validity: 'Lifetime' }
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
    specs: { 'Apps Included': '50+', Frameworks: 'React, Vue, Angular', Backend: 'Node.js, Python', Database: 'SQL / NoSQL', Deployment: 'Docker Ready' }
  }
];

export async function POST() {
  try {
    // Auth check — only authenticated users can seed
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if products already exist to avoid duplicates
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      return NextResponse.json({ message: 'DB check failed: ' + checkError.message }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({
        message: 'Database already has products. Skipping seed to avoid duplicates.',
        alreadySeeded: true
      });
    }

    // Insert seed data
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(seedProducts)
      .select();

    if (error) {
      return NextResponse.json({ message: 'Seed failed: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length ?? 0} products into Supabase.`,
      products: data
    });

  } catch (err) {
    console.error('[seed] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
