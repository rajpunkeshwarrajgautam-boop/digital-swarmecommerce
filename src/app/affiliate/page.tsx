"use client";

import { Share2, DollarSign, BarChart3, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// export const metadata: Metadata = {
//   title: 'Affiliate Portal',
//  description: 'Join the Digital Swarm affiliate program and earn 30% commission on every sale.',
// };

export default function AffiliatePage() {
  const [formData, setFormData] = useState({ name: "", email: "", link: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText("");

    try {
      const res = await fetch("/api/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) setErrorText(err.message);
      else setErrorText("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Header section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-purple-500/10 text-purple-400 rounded-full mb-6">
            <Share2 className="w-8 h-8 sm:w-12 sm:h-12" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Partner with Digital Swarm
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Earn a massive <strong className="text-white">30% commission</strong> on every digital product and AI agent you sell. High-converting funnel, instant payouts.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-border rounded-xl p-8 hover:border-purple-500/30 transition-all group">
            <DollarSign className="w-10 h-10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">30% Commissions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our AOV is ₹3,000+. That means you earn around ₹900 minimum per sale. Payouts are instant via UPI or PayPal.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 hover:border-pink-500/30 transition-all group">
            <BarChart3 className="w-10 h-10 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">High Conversion Rate</h3>
            <p className="text-muted-foreground leading-relaxed">
              With our order bumps, exit-intent popups, and live social proof, our store converts at an industry-leading 4.2%.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 hover:border-blue-500/30 transition-all group">
            <Users className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-2">Dashboard Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Track your clicks, sales, and commissions in real-time. Generate unlimited custom tracking links instantly.
            </p>
          </div>
        </div>

        {/* CTA section (Simulated Dashboard) */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-black border-b border-border p-6 sm:px-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Your Dashboard</h2>
              <p className="text-muted-foreground">Apply below to unlock your tracking links.</p>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="bg-secondary/50 rounded-lg p-3 flex-1 sm:w-32 text-center border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-mono">Clicks</p>
                <p className="text-xl font-black text-white">0</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 flex-1 sm:w-32 text-center border border-border">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-mono">Earned</p>
                <p className="text-xl font-black text-emerald-400">₹0</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-10">
            <div className="max-w-xl">
              <h3 className="text-xl font-bold mb-4">Apply for Partnership</h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                We review applications manually to ensure high-quality traffic. Tell us how you plan to promote Digital Swarm (YouTube, Newsletter, Twitter, etc).
              </p>
              
              {success ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-emerald-400">Application Received</h3>
                  <p className="text-muted-foreground">Our team will review your application and send your tracking dashboard link within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" 
                        placeholder="john@example.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Link to your audience</label>
                    <input 
                      type="url" 
                      required
                      value={formData.link}
                      onChange={e => setFormData({...formData, link: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" 
                      placeholder="https://youtube.com/c/yourchannel" 
                    />
                  </div>
                  
                  {errorText && <p className="text-red-400 text-sm font-medium">{errorText}</p>}
                  
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-white text-black font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : (
                        <>Submit Application <ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
