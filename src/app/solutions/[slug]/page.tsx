import { seoData } from '@/lib/seo-data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return seoData.map((data) => ({ slug: data.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = seoData.find((entry) => entry.slug === slug);
  if (!data) return {};
  return { title: `${data.title} | Digital Swarm`, description: data.description, keywords: data.keywords };
}

export default async function SEOLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = seoData.find((entry) => entry.slug === slug);
  if (!data) notFound();

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[150px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-primary text-black font-black uppercase tracking-widest text-xs px-3 py-1 mb-6">Use case: {data.industry}</div>
            <h1 className="text-5xl sm:text-6xl font-black uppercase italic tracking-tighter text-white mb-6 leading-none">{data.title}</h1>
            <p className="text-xl text-gray-400 mb-8 max-w-xl leading-relaxed">{data.description}</p>

            <div className="space-y-4 mb-10">
              {[
                'Buyer-facing product pages state the actual delivery format',
                'Bring your own LLM accounts, business data, and third-party integrations unless explicitly included',
                'Human or licensed-professional review remains required for consequential outputs',
              ].map((feature) => (
                <div key={feature} className="flex items-start text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-primary mr-3 shrink-0 mt-0.5" />
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products"><Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg w-full">Browse verified products <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
              <Link href="/faq"><Button variant="outline" className="h-14 px-8 rounded-full font-bold text-lg w-full">Read delivery FAQ</Button></Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-primary/15 to-accent/10 rounded-3xl blur-2xl top-10" />
            <div className="bg-[#111116] border border-white/10 rounded-3xl p-8 relative shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-primary mb-7" />
              <h2 className="text-2xl font-black text-white mb-4">What this page does not promise</h2>
              <ul className="space-y-4 text-sm text-white/45 leading-relaxed">
                <li>No autonomous 24/7 execution claim.</li>
                <li>No “zero hallucination” or guaranteed-accuracy claim.</li>
                <li>No hidden RAG, phone, CRM, scheduling, trading, or store integration unless the individual SKU explicitly lists it.</li>
                <li>No percentage savings, productivity lift, or business result without measured evidence.</li>
              </ul>
              <p className="mt-8 text-xs text-white/25">Target audience: {data.target}. Evaluate each product’s scope before purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
