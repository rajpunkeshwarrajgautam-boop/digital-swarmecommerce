-- Insert initial products (Digital Bundles)
insert into public.products (name, description, price, category, image, in_stock, rating, features, specs)
values
  (
    '1000 Manually Tested Web Applications', 
    'A comprehensive collection of 1000 manually tested web applications, including 20 free premium bonuses. Perfect for developers looking for inspiration and robust codebases.', 
    200.00, 
    'Web Development', 
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.8,
    ARRAY['1000+ Tested Applications', '20 Premium Bonuses', 'Diverse Use Cases', 'Clean Codebase Examples', 'Instant Digital Download'],
    '{"Format": "PDF / Source Code", "Size": "1.2 GB", "License": "Personal & Commercial Use", "Compatibility": "Universal", "Updates": "Lifetime Access"}'::jsonb
  ),
  (
    'Ultimate Web Development Bundle', 
    'The ultimate bundle for web developers, curated by Glexmedia. Includes templates, scripts, UI kits, and essential resources to accelerate your development workflow.', 
    200.00, 
    'Bundles', 
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.9,
    ARRAY['Premium Templates', 'High-Quality UI Kits', 'Useful Scripts & Plugins', 'Developer Tools', 'Regular Updates'],
    '{"Format": "ZIP / PDF", "Components": "500+", "Technologies": "HTML, CSS, JS, React", "License": "Royalty Free", "Support": "Priority Email Support"}'::jsonb
  ),
  (
    'Ultimate Mega Bundle', 
    'A massive collection of digital assets, tools, and resources. The Ultimate Mega Bundle is your one-stop shop for premium creative content.', 
    200.00, 
    'Bundles', 
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60', 
    true, 
    5.0,
    ARRAY['Huge Asset Library', 'Diverse Categories', 'High-Resolution Graphics', 'Ready-to-use Code', 'Exclusive Content'],
    '{"Total Files": "5000+", "Categories": "Design, Code, Marketing", "File Types": "PSD, AI, HTML, PDF", "Download": "Instant Access", "Validity": "Lifetime"}'::jsonb
  ),
  (
    'Web Applications Collection', 
    'A curated selection of high-quality web applications. Explore a variety of functional and well-designed apps for your projects.', 
    200.00, 
    'Web Development', 
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.7,
    ARRAY['Modern Tech Stack', 'Responsive Designs', 'Well-Documented', 'Easy Customization', 'Performance Optimized'],
    '{"Apps Included": "50+", "Frameworks": "React, Vue, Angular", "Backend": "Node.js, Python", "Database": "SQL / NoSQL", "Deployment": "Docker Ready"}'::jsonb
  );
