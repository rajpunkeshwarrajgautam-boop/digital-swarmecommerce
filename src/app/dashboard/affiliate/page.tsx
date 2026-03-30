"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

type AffiliateStatus = "none" | "pending" | "approved";

export default function AffiliatePortal() {
  const { user } = useUser();
  const [status, setStatus] = useState<AffiliateStatus>("none");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audienceLink, setAudienceLink] = useState("");

  useEffect(() => {
    // In a real DB, we would fetch the current status from Supabase via an action.
    // Since we don't have the getter action yet, we simulate fetching.
    setTimeout(() => {
      // LocalStorage fallback for optimistic UI update pattern
      const localStatus = localStorage.getItem("ds_affiliate_status") as AffiliateStatus;
      if (localStatus) {
        setStatus(localStatus);
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.fullName || "User",
          email: user.primaryEmailAddress?.emailAddress,
          link: audienceLink
        }),
      });
      
      if (res.ok || res.status === 409) {
        setStatus("pending");
        localStorage.setItem("ds_affiliate_status", "pending");
      } else {
        alert("Failed to yield application. Ensure your data is correct.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-white/30 italic font-black uppercase tracking-widest p-8">Initializing Syndicate Protocol...</div>;
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
        >
          <Users className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Syndicate Partner</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
          Affiliate <br />
          <span className="text-white/20 italic">Network</span>
        </h1>
      </header>

      {status === "none" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter border-b-4 border-black pb-4">
              Deploy Assets. <span className="text-primary">Extract Value.</span>
            </h2>
            <p className="text-xl text-white/50 leading-relaxed font-mono">
              The Digital Swarm Syndicate is an elite partner program. You share our digital infrastructure with your audience, and receive an automated 30% yield on all acquisitions made through your unique deployment link.
            </p>
            
            <ul className="space-y-6 flex flex-col pt-4">
               {[
                 { title: "30% Net Yield", desc: "Highest tier commission on all template suites." },
                 { title: "90-Day Cookie Window", desc: "Long range tracking to ensure you capture your leads." },
                 { title: "Automated Payouts", desc: "Monthly wire directly to your linked ledger." }
               ].map((benefit, i) => (
                 <li key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black italic uppercase tracking-tight">{benefit.title}</h4>
                      <p className="text-sm font-mono text-white/40">{benefit.desc}</p>
                    </div>
                 </li>
               ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 border-4 border-black p-8 shadow-[12px_12px_0_#000] space-y-6 flex flex-col justify-center">
             <div className="space-y-2 pb-4">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">Submit Application</h3>
               <p className="text-[10px] uppercase font-black tracking-widest text-primary">Protocol Authorization Required</p>
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Primary Identity Email</label>
               <input 
                 type="text"
                 disabled
                 value={user?.primaryEmailAddress?.emailAddress || ""}
                 className="w-full bg-black border-2 border-white/10 px-4 py-3 font-mono text-sm text-white/50 cursor-not-allowed italic opacity-50 focus:outline-none"
               />
             </div>

             <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-white/70">Traffic Source URL (Twitter/Substack/Site)</label>
               <input 
                 type="url"
                 required
                 value={audienceLink}
                 onChange={e => setAudienceLink(e.target.value)}
                 placeholder="https://x.com/yourhandle"
                 className="w-full bg-black border-2 border-white/20 px-4 py-3 font-mono text-sm text-white focus:border-primary focus:outline-none transition-colors"
               />
             </div>

             <Button 
               disabled={isSubmitting}
               className="w-full bg-primary text-black font-black uppercase italic tracking-widest py-6 mt-4 hover:bg-white transition-all group shadow-[4px_4px_0_#000] hover:shadow-[4px_4px_0_#fff]"
             >
               {isSubmitting ? "Transmitting..." : "Initialize Syndicate Link"}
               <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
          </form>
        </motion.div>
      )}

      {status === "pending" && (
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white/5 border-4 border-black p-12 text-center max-w-2xl mx-auto shadow-[12px_12px_0_#000] space-y-8"
         >
            <div className="w-20 h-20 bg-primary/10 border-2 border-primary mx-auto flex items-center justify-center animate-pulse">
               <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div>
               <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Application Under Review</h2>
               <p className="font-mono text-white/50 leading-relaxed">
                 Your request to join the Digital Swarm Syndicate has been logged into the ledger. Our team is manually verifying your traffic source to ensure alignment with our protocols. 
                 <br/><br/>
                 Authorization takes roughly 24-48 hours. A secure transmission will be sent to your inbox upon clearance.
               </p>
            </div>
         </motion.div>
      )}

      {status === "approved" && (
         <div className="text-center p-12 border-4 border-primary/20 bg-primary/5">
            <h2 className="text-3xl font-black uppercase italic text-primary">System Override: Approved</h2>
            {/* Real affiliate metrics would go here */}
         </div>
      )}
    </div>
  );
}
