"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Shield, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trackContactSubmit } from "@/lib/web-analytics";

const OPERATION_TYPES = [
  "Enterprise Build",
  "Custom AI Integration",
  "Product Support",
  "Partnership Query",
] as const;

export default function ContactPage() {
  const [callsign, setCallsign] = useState("");
  const [email, setEmail] = useState("");
  const [operationType, setOperationType] = useState<string>(OPERATION_TYPES[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const parts = callsign.trim().split(/\s+/);
    const firstName = parts[0]?.length ? parts[0] : "";
    const lastName = parts.slice(1).join(" ");
    const fullMessage = `Operation: ${operationType}\n\n${message.trim()}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email: email.trim(), message: fullMessage }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "We could not save your message. Try again or email support@digitalswarm.in.");
        return;
      }
      trackContactSubmit(operationType);
      setStatus("success");
      setCallsign("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Email support@digitalswarm.in directly.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <header className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Contact Digital Swarm</span>
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
                Start a <br />
                <span className="text-white/20 italic">Conversation</span>
              </h1>
              <p className="text-white/50 text-lg font-medium leading-relaxed max-w-lg">
                Send a product-support, partnership, or custom-build inquiry. Messages submitted here are stored in our support database for follow-up.
              </p>
            </header>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Support email</p>
                  <a href="mailto:support@digitalswarm.in" className="text-xl font-black tracking-tighter hover:text-primary transition-colors">support@digitalswarm.in</a>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  "No invented response-time or uptime promises",
                  "Product and order questions can be tied to your email",
                  "Custom work is scoped before any commitment is made",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-white/45">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white border-8 border-black p-10 lg:p-16 shadow-[24px_24px_0_#d8b36a] relative z-10">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 text-black border-l-8 border-primary pl-6">
                Send Message
              </h2>
              <form className="space-y-8" onSubmit={handleSubmit}>
                {status === "success" && (
                  <p className="text-sm font-bold text-green-700 border-4 border-green-600 bg-green-50 p-4">
                    Message received. We will reply at the email you provided.
                  </p>
                )}
                {status === "error" && errorMsg && (
                  <p className="text-sm font-bold text-red-700 border-4 border-red-600 bg-red-50 p-4">{errorMsg}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="contact-callsign" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Name</label>
                    <input id="contact-callsign" name="callsign" type="text" required placeholder="John Doe" value={callsign} onChange={(e) => setCallsign(e.target.value)} className="w-full bg-black/5 border-4 border-black p-5 font-black tracking-tighter text-lg focus:bg-primary/10 outline-none transition-all shadow-[6px_6px_0_#000]" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Email</label>
                    <input id="contact-email" name="email" type="email" required placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black/5 border-4 border-black p-5 font-black tracking-tighter text-lg focus:bg-primary/10 outline-none transition-all shadow-[6px_6px_0_#000]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-operation" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Inquiry type</label>
                  <select id="contact-operation" name="operationType" value={operationType} onChange={(e) => setOperationType(e.target.value)} className="w-full bg-black/5 border-4 border-black p-5 font-black tracking-tighter text-lg focus:bg-primary/10 outline-none transition-all shadow-[6px_6px_0_#000] appearance-none">
                    {OPERATION_TYPES.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Message</label>
                  <textarea id="contact-message" name="message" rows={5} required placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-black/5 border-4 border-black p-5 font-black tracking-tighter text-lg focus:bg-primary/10 outline-none transition-all shadow-[6px_6px_0_#000] resize-none" />
                </div>

                <Button type="submit" disabled={status === "loading"} className="w-full py-8 text-xl font-black uppercase tracking-widest bg-black text-white hover:bg-primary transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                  {status === "loading" ? "Sending…" : (<><span>Send Message</span><Send className="w-6 h-6" /></>)}
                </Button>
              </form>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-primary/15 blur-[150px] -z-10 rounded-full" />
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap gap-8 text-white/30 text-xs uppercase tracking-widest">
          <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4" /> Stored securely</span>
          <span>Support: support@digitalswarm.in</span>
        </div>
      </div>
    </div>
  );
}
