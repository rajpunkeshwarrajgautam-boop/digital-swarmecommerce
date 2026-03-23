import { seoData } from '@/lib/seo-data';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'AI Agent Solutions by Industry | Digital Swarm',
  description: 'Explore our catalog of autonomous AI agents across 50+ industries including Legal, Finance, Real Estate, and Healthcare.',
};

export default function SolutionsHub() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 text-center mt-6">
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">
              Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Industry</span> Solutions
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">Select your operational sector to deploy specialized autonomous reasoning models.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seoData.map((data) => (
              <Link href={"/solutions/" + data.slug} key={data.slug}>
                <div className="bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md rounded-2xl p-6 transition-all group h-full cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
                  <div className="text-xs font-black uppercase text-cyan-500 mb-2 tracking-widest">{data.industry}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors drop-shadow-sm">{data.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{data.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
