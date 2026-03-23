import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import PromptGeneratorClient from '@/components/tools/PromptGeneratorClient';

export default function PromptGenerator() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 overflow-hidden relative">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Master Prompt</span> Generator
            </h1>
            <p className="text-xl text-[var(--secondary-foreground)] max-w-2xl mx-auto leading-relaxed">
              Stop writing basic AI wrappers. Enter your niche below to generate the exact System Protocol used in elite enterprise multi-agent architectures.
            </p>
          </div>
          
          <PromptGeneratorClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
