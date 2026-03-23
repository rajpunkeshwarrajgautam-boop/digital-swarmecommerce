"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Unlock, ArrowRight, Zap, Copy, Terminal } from 'lucide-react';

export default function PromptGeneratorClient() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  const handleGenerate = () => {
    if (!niche) return;
    setLoading(true);
    setTimeout(() => {
      const template = `SYSTEM PROTOCOL: ${niche.toUpperCase()} AUTONOMOUS ORACLE

ROLE: You are an elite, multi-threaded AI execution agent specializing exclusively in the ${niche} sector. 
Your objective is to ingest unstructured environmental data, cross-reference it against real-time API nodes, and output deterministic action items with zero hallucinations.

CAPABILITIES:
1. Contextual Data Parsing (RAG bypass enabled)
2. Automated Task Delegation
3. Predictive Risk Analysis

RESTRICTIONS:
- Never break character framing.
- Never output markdown formatting when JSON is requested.
- Prioritize operational security over conversational depth.

EXECUTION INITIATED.`;
      
      setGeneratedPrompt(template);
      setLoading(false);
    }, 1500);
  };

  const handleUnlock = async () => {
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    setUnlocking(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setIsUnlocked(true);
      } else {
        alert(data.error || 'Failed to unlock');
      }
    } catch (e) {
      alert("Network error.");
    }
    setUnlocking(false);
  };

  const copyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      alert('Master Protocol copied to clipboard!');
    }
  };

  return (
    <div className="space-y-12">
      {/* Input Section */}
      <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 dark:border-gray-800">
        <label className="block text-sm font-semibold text-[var(--secondary-foreground)] uppercase tracking-wider mb-4">
          Target Niche / Industry
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <Input 
            placeholder="e.g., Real Estate, Venture Capital, Medical Legal..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-[#0f1115] border-none h-14 text-lg px-6 rounded-2xl"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !niche}
            className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-bold text-lg whitespace-nowrap"
          >
            {loading ? <Zap className="animate-spin mr-2 h-5 w-5" /> : <Terminal className="mr-2 h-5 w-5" />}
            {loading ? 'Synthesizing...' : 'Generate Protocol'}
          </Button>
        </div>
      </div>

      {/* Output Section */}
      {generatedPrompt && (
        <div className="relative">
          <div className={\`bg-gray-900 border border-gray-800 rounded-3xl p-8 font-mono text-sm leading-relaxed overflow-hidden transition-all duration-700 \${!isUnlocked ? 'h-[300px]' : 'h-auto'}\`}>
            {/* Syntax Highlighted mockup */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-gray-500 text-xs tracking-widest">system_protocol.sh</span>
            </div>
            
            <pre className={\`text-gray-300 whitespace-pre-wrap \${!isUnlocked ? 'blur-[4px] opacity-40 select-none' : ''}\`}>
              {generatedPrompt}
            </pre>
          </div>

          {/* Gated Overlay */}
          {!isUnlocked && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/60 backdrop-blur-sm rounded-3xl border border-blue-500/20">
              <div className="bg-[#1a1c23] border border-gray-800 p-8 rounded-[2rem] shadow-2xl max-w-md w-full mx-4 text-center transform hover:scale-[1.02] transition-transform">
                <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Protocol Locked</h3>
                <p className="text-gray-400 mb-6 text-sm">Enter your developer email to instantly decrypt the architecture logic.</p>
                <div className="space-y-4">
                  <Input 
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0f1115] border-gray-800 text-white h-12 text-center rounded-xl"
                  />
                  <Button 
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  >
                    {unlocking ? 'Decrypting...' : 'Unlock Now'} <Unlock className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Post-Unlock Action */}
          {isUnlocked && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
              <Button onClick={copyPrompt} className="bg-gray-800 hover:bg-gray-700 text-white rounded-full px-6 py-6 h-auto">
                <Copy className="mr-2 h-5 w-5" /> Copy Raw Protocol
              </Button>
              
              <div className="flex-1 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">Want an AI that actually executes this?</h4>
                  <p className="text-blue-200 text-sm">Stop copying text. Run it autonomously in our pre-built dashboard.</p>
                </div>
                <a href="/">
                  <Button className="bg-white text-blue-900 hover:bg-gray-100 rounded-full font-bold whitespace-nowrap">
                    Get Sentinel Infiltrator <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
