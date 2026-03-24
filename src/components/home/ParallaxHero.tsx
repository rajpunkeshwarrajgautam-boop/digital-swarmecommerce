import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, CheckCircle2, Star, Shield, Rocket } from "lucide-react";
import Image from "next/image";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -75]);

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen relative overflow-hidden bg-black"
    >
      {/* High-Fidelity Cyber Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero/cyber-bg.png" 
          alt="Cyber Background" 
          fill 
          priority
          className="object-cover opacity-40 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/20 to-black" />
      </div>
      <div className="container relative z-30 flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-screen pt-32 pb-16 gap-12 lg:gap-16 px-6 sm:px-8 w-full max-w-7xl mx-auto">
        
        {/* Left: Typography & CTAs */}
        <motion.div
          className="flex flex-col gap-8 lg:max-w-2xl w-full"
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.1)] w-fit backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]" />
              <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase italic">Digital Swarm v2.4 // Online</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.04em] uppercase italic italic-mask">
              LAUNCH YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                AI EMPIRE
              </span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-gray-400 font-bold leading-tight max-w-xl uppercase tracking-tight">
            The absolute standard in algorithmic growth. Download production-ready <span className="text-white">AI agents</span>, <span className="text-white">UI kits</span>, and <span className="text-white">strategic code</span> built to scale your agency to 7-figures.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 mt-2 w-full sm:w-auto">
            <Link href="/products" className="w-full sm:w-auto block group">
              <button className="w-full sm:w-auto bg-white text-black font-black uppercase italic px-10 py-5 rounded-none border-4 border-black shadow-[8px_8px_0_#22d3ee] hover:shadow-[4px_4px_0_#22d3ee] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3">
                Access Terminal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/freebies" className="w-full sm:w-auto block">
              <button className="w-full sm:w-auto px-10 py-5 rounded-none bg-black text-white font-black uppercase italic border-4 border-white shadow-[8px_8px_0_rgba(255,255,255,0.1)] hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                Free Resources
              </button>
            </Link>
          </div>
          
          {/* Trust Badges - Mandatory Diagnostic Metric */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-4 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative w-8 h-8 rounded-full border-2 border-black bg-gray-800 overflow-hidden shadow-xl">
                    <Image 
                      src={`https://i.pravatar.cc/100?img=${i + 20}`} 
                      alt="Verified User" 
                      width={32} 
                      height={32} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white italic">Trusted by 2.4k+ Devs</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">One-Click Deployment</span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">MRR License Included</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Advanced 3D Interactive Mockup */}
        <motion.div
          className="relative w-full lg:w-1/2 flex items-center justify-center lg:h-[700px] mt-12 lg:mt-0"
          style={{ y: y1 }}
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="relative w-full max-w-lg aspect-square"
          >
            {/* Main Cyber Dashboard Container */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-[#050608] rounded-[3rem] border-[10px] border-white/5 p-8 flex flex-col gap-6 z-20 shadow-[0_40px_100px_rgba(0,0,0,0.9)] backdrop-blur-3xl overflow-hidden group">
              
              {/* Animated Scan Line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-24 w-full animate-scan-fast z-[-1] pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                    <Rocket className="w-7 h-7 text-black fill-black" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-32 bg-white rounded-full opacity-90" />
                    <div className="h-2 w-20 bg-cyan-500/30 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-2">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <div className="h-3 w-20 bg-white/20 rounded-full" />
                  <div className="text-3xl font-black text-white italic tracking-tighter">₹8,492</div>
                  <div className="h-2 w-full bg-cyan-500/20 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-cyan-500" />
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-cyan-500 flex flex-col gap-4 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                  <div className="h-3 w-20 bg-black/30 rounded-full" />
                  <div className="text-3xl font-black text-black italic tracking-tighter">1,204</div>
                  <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-black" />
                  </div>
                </div>
              </div>

              <div className="flex-1 rounded-4xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-6 flex flex-col gap-5">
                {[1,2].map(i => (
                  <div key={i} className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-2xl group-hover/row:border-cyan-500/50 transition-colors italic font-black">
                        {i === 1 ? 'A' : 'B'}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-32 bg-white/20 rounded-full" />
                        <div className="h-2 w-20 bg-white/10 rounded-full" />
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase italic border border-cyan-500/20">Active</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating 3D "Assets" */}
            <motion.div 
              className="absolute -right-12 top-10 w-32 h-32 bg-[#050608] border border-white/10 rounded-[2rem] z-30 flex items-center justify-center shadow-2xl backdrop-blur-3xl group-hover:rotate-12 transition-transform duration-500"
              animate={{ y: [0, -30, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            >
              <div className="text-6xl drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">🛸</div>
              <div className="absolute inset-0 rounded-[2rem] border-4 border-cyan-500/20 animate-pulse" />
            </motion.div>
            
            <motion.div 
              className="absolute -left-16 bottom-20 w-28 h-28 bg-[#050608] border border-white/10 rounded-full z-30 flex items-center justify-center shadow-2xl backdrop-blur-3xl"
              animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 9, repeat: Infinity, delay: 0.5 }}
            >
              <div className="w-full h-full p-6">
                <div className="w-full h-full bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                  <Shield className="w-10 h-10 text-black" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="absolute left-1/2 -bottom-20 -translate-x-1/2 w-[120%] h-40 bg-gradient-to-t from-cyan-400/20 to-transparent blur-[100px] z-10"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
