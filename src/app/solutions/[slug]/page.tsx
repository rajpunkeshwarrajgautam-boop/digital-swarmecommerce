import { seoData } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return seoData.map((data) => ({
    slug: data.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = seoData.find((d) => d.slug === slug);
  
  if (!data) return {};
  
  return {
    title: data.title + ' | Digital Swarm',
    description: data.description,
    keywords: data.keywords,
  };
}

export default async function SEOLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = seoData.find((d) => d.slug === slug);
  
  if (!data) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Copy */}
            <div>
              <div className="inline-block bg-[#CCFF00] text-black font-black uppercase tracking-widest text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] mb-6 transform -rotate-2">
                Target Sector: {data.industry}
              </div>
              <h1 className="text-5xl sm:text-6xl font-black uppercase italic tracking-tighter text-white mb-6 leading-none">
                {data.title.split(' ').map((word, i) => 
                  ['AI', 'Agent', 'Agents'].includes(word) ? <span key={i} className="text-blue-500">{word} </span> : <span key={i}>{word} </span>
                )}
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed font-medium">
                {data.description} Stop relying on manual labor. Deploy a Digital Swarm protocol specific to {data.target} and scale aggressively.
              </p>
              
              <div className="space-y-4 mb-8">
                {['Zero Hallucination Logic', '24/7 Autonomous Execution', 'Natively Integrated RAG Context'].map((feature, i) => (
                  <div key={i} className="flex items-center text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                    <span className="font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/bundle-builder">
                  <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg w-full">
                    Deploy The {data.industry} Swarm <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-500/20 rounded-3xl blur-2xl top-10" />
              <div className="bg-[#1a1c23] border border-gray-800 rounded-3xl p-8 relative shadow-2xl overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                  <div className="font-mono text-sm text-gray-400">terminal@digitalswarm</div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                </div>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="text-gray-500">$ ./init_agent --niche=&quot;{data.industry.toLowerCase()}&quot;</div>
                  <div className="text-green-400">Loading {data.industry} Protocols... [OK]</div>
                  <div className="text-blue-400">Establishing Context Nodes... [OK]</div>
                  <div className="text-yellow-400">Warning: High Execution Velocity Detected.</div>
                  <div className="text-white mt-4">System Online. Awaiting Commands for {data.target}.</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
