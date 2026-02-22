-- Insert initial products (Digital Bundles)
insert into public.products (name, description, price, category, image, in_stock, rating, features, specs)
values
  (
    'AI Deep Research Agent', 
    'A powerful research assistant that leverages OpenAI''s Agents SDK and Firecrawl to perform comprehensive web research and synthesize deep insights.', 
    1499.00, 
    'Advanced Agents', 
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.9,
    ARRAY['Deep Web Research', 'OpenAI Agents SDK', 'Firecrawl Integration', 'Downloadable Markdown Reports', 'Interactive UI'],
    '{"Kernel": "Agents SDK", "Network": "Firecrawl", "Model": "GPT-4o", "License": "Commercial", "Updates": "Quarterly"}'::jsonb
  ),
  (
    'AI System Architect (R1)', 
    'An advanced system design agent powered by DeepSeek R1. Capable of generating complex architecture diagrams and technical specifications autonomously.', 
    1999.00, 
    'Advanced Agents', 
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60', 
    true, 
    5.0,
    ARRAY['DeepSeek R1 Core', 'Autonomous Design', 'Diagram Generation', 'Tech Spec Authoring', 'Self-Correction'],
    '{"Model": "DeepSeek R1", "Context": "128k Tokens", "Output": "Mermaid / Markdown", "License": "Enterprise", "Support": "Priority"}'::jsonb
  ),
  (
    'AI VC Due Diligence Team', 
    'A multi-agent team designed for venture capital analysis. Coordinates multiple specialized agents to evaluate startups, market trends, and financial health.', 
    2499.00, 
    'Agent Teams', 
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.8,
    ARRAY['Multi-Agent Coordination', 'Startup Scoring', 'Market Sentiment Analysis', 'Risk Assessment', 'Team Debrief Reports'],
    '{"Team Size": "5 Agents", "Protocol": "Swarm Logic", "Data": "Live APIs", "Duration": "Indefinite", "Security": "Encrypted"}'::jsonb
  ),
  (
    'AI Self-Evolving Agent', 
    'A revolutionary autonomous agent that learns from its own execution history and feedback loops to optimize its performance over time.', 
    2999.00, 
    'Research Agents', 
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60', 
    true, 
    5.0,
    ARRAY['Recursive Training', 'Feedback Integration', 'Performance Metrics', 'Dynamic Optimization', 'Long-term Memory'],
    '{"State": "Persistent", "Learning": "Neural-Adaptive", "Core": "Gemini 1.5 Pro", "Uptime": "99.9%", "Type": "Experimental"}'::jsonb
  ),
  (
    'AI Blog to Podcast Agent', 
    'Instantly transform written content into high-quality audio podcasts with natural voice synthesis and conversational structuring.', 
    799.00, 
    'Media Agents', 
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.7,
    ARRAY['Natural TTS Synthesis', 'Multi-voice Support', 'Script Generation', 'Background Scoring', 'Social Media Snippets'],
    '{"Voice": "Neural HDR", "Output": "MP3 / FLAC", "Speed": "5x Realtime", "Integration": "RSS / Spotify", "Storage": "Clour Sync"}'::jsonb
  ),
  (
    'AI Medical Imaging Agent', 
    'Sophisticated computer vision agent trained to analyze medical scans and provide preliminary diagnostic suggestions with high accuracy.', 
    1899.00, 
    'Specialized Agents', 
    'https://images.unsplash.com/photo-1576091160550-21735999ef04?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.6,
    ARRAY['X-Ray Analysis', 'MRI Interpretation', 'Privacy First (HIPAA Ready)', 'Doctor-in-the-loop Support', 'Secure Data Handling'],
    '{"Precision": "99.2%", "Type": "Computer Vision", "Framework": "PyTorch", "Data": "Anonymized", "Audit": "Third-party Verified"}'::jsonb
  ),
  (
    'AI Sales Intelligence Team', 
    'An elite squad of agents for B2B sales. Automates prospecting, outreach personalization, and meeting scheduling autonomously.', 
    1599.00, 
    'Agent Teams', 
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.9,
    ARRAY['Lead Generation', 'Hyper-Personalization', 'Automated Follow-ups', 'Calendar Sync', 'CRM Integration'],
    '{"Leads": "Unlimited", "Mail": "Warmer Included", "Model": "Claude 3.5 Sonnet", "Report": "Weekly PDF", "Support": "24/7"}'::jsonb
  ),
  (
    'AI Financial Coach Agent', 
    'Personalized wealth management and budget planning agent. Analyzes spending patterns and provides data-driven investment advice.', 
    999.00, 
    'Specialized Agents', 
    'https://images.unsplash.com/photo-1579621970795-87faff2f9050?w=800&auto=format&fit=crop&q=60', 
    true, 
    4.8,
    ARRAY['Portfolio Tracking', 'Risk Profiling', 'Goal-based Planning', 'Market Alerts', 'Crypto & Stock Sync'],
    '{"Markets": "Global", "Latency": "Real-time", "Security": "Bank-Grade", "Platform": "Web / Mobile", "Updates": "Daily"}'::jsonb
  );
