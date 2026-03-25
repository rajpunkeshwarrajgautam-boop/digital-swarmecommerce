"use client";

import { CheckCircle2, Shield } from "lucide-react";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ParallaxHero } from "@/components/home/ParallaxHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TrustLogos } from "@/components/home/TrustLogos";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";
import { CommunityProtocol } from "@/components/home/CommunityProtocol";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative z-10 w-full bg-background">
      {/* 6. LIMITED OFFER Banner */}
      <PromoBanner />

      {/* 2. HERO Section */}
      <ParallaxHero />

      {/* 10. TRUST SIGNALS */}
      <TrustLogos />

      {/* 3. PRODUCT CATALOG */}
      <div id="products">
        <FeaturedSection />
      </div>

      {/* 17. ABOUT SECTION (Integrated Inline) */}
      <section id="about" className="py-32 bg-secondary text-white relative overflow-hidden">
        <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase italic">Our Mission</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
                Built by <span className="text-primary italic">Developers</span>, <br />
                For Developers.
              </h2>
              <p className="text-white/60 text-xl font-bold uppercase tracking-tight leading-snug">
                Digital Swarm was created to eliminate the &quot;Blank Screen&quot; problem. We provide the hardened architectural patterns needed to go from zero to production in hours, not weeks.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-4">
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-black text-primary italic">2,000+</span>
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Developers Empowered</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-black text-primary italic">30+</span>
                  <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Premium Templates</span>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl skew-y-3">
              <img 
                src="https://images.unsplash.com/photo-1522071823991-b51829f7ceac?auto=format&fit=crop&q=80&w=800" 
                alt="Digital Swarm Team" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-secondary via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/10">
                <p className="text-sm font-bold italic uppercase tracking-tight text-white/90">
                  &quot;The goal isn&apos;t just to write code. The goal is to build empires. We provide the bricks.&quot;
                </p>
                <p className="text-[10px] font-black uppercase text-primary mt-4 tracking-widest">— Digital Swarm Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE PROTOCOLS (Testimonials) */}
      <Testimonials />

      {/* 9. HOW IT WORKS */}
      <HowItWorks />

      {/* 7. FAQ SECTION */}
      <div id="faq">
        <HomeFAQ />
      </div>

      {/* 11. SWARM INTELLIGENCE (Community) */}
      <CommunityProtocol />

      {/* 8. OPERATIONAL SWARM (Newsletter) */}
      <div id="contact">
        <Newsletter />
      </div>

      {/* Visual Trust Badge strip */}
      <div className="bg-white py-12 border-t border-secondary/5">
        <div className="container mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40">
           <div className="flex items-center gap-2">
             <Shield className="w-5 h-5 text-secondary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-secondary">SSL Secure Payments</span>
           </div>
           <div className="flex items-center gap-2">
             <CheckCircle2 className="w-5 h-5 text-secondary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-secondary">30-Day Money Back</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="flex gap-0.5">
               {[1,2,3,4,5].map(i => <span key={i} className="text-secondary text-xs">★</span>)}
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-secondary">4.9/5 Rating</span>
           </div>
        </div>
      </div>
    </div>
  );
}
