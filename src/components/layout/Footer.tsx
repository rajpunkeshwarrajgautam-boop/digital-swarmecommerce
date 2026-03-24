import { MapPin, Phone, Mail, Twitter, Instagram, Linkedin, Shield } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black border-t-8 border-cyan-500 mt-auto pt-32 pb-16 relative overflow-hidden text-white z-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.05)_0%,transparent_50%)] pointer-events-none" />
      
      {/* Top Tape */}
      <div className="absolute top-0 right-10 w-64 h-10 bg-cyan-500 border-x-4 border-b-4 border-black text-black font-black italic uppercase tracking-widest flex items-center justify-center shadow-[4px_4px_0_rgba(6,182,212,0.3)] z-10 text-[10px]">PRODUCTION_SYNC_ESTABLISHED</div>

      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-10">
            <Logo />
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
              <p className="text-[10px] text-gray-400 leading-relaxed font-black uppercase italic tracking-widest">
                Elite Digital Infrastructure <br />
                <span className="text-white">Built for the next decade of growth.</span>
              </p>
            </div>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" label="Twitter" />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" label="LinkedIn" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" label="Instagram" />
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-cyan-400 italic">Core_Assets</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase italic tracking-widest text-gray-500">
              <li><Link href="/products" className="hover:text-white transition-colors">All_Protocols</Link></li>
              <li><Link href="/products?category=AI+Agents" className="hover:text-white transition-colors text-white">Neural_Sworms</Link></li>
              <li><Link href="/products?category=Web+Development" className="hover:text-white transition-colors">Software_Stacks</Link></li>
              <li><Link href="/elite" className="text-cyan-400 hover:text-white transition-colors">Elite_Access</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition-colors">Verticals</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-cyan-400 italic">Legal_Node</h4>
            <ul className="space-y-5 text-[10px] font-black uppercase italic tracking-widest text-gray-500">
              <li><Link href="/about" className="hover:text-white transition-colors">Mission_Profile</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Usage_Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy_Protocol</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Exit_Agreement</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support_Uplink</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-10 text-cyan-400 italic">Data_Uplink</h4>
            <ul className="space-y-8 text-[10px] font-black uppercase italic tracking-widest text-gray-400">
              <li className="flex items-start gap-5">
                <MapPin className="w-5 h-5 text-cyan-500 shrink-0" />
                <span className="leading-tight">Cyber City Innovation Hub,<br />Haryana 122002, IND</span>
              </li>
              <li className="flex items-center gap-5">
                <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
                <a href="tel:+918810777573" className="hover:text-white transition-colors">+91 88107 77573</a>
              </li>
              <li className="flex items-start gap-5">
                <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
                <a href="mailto:support@digitalswarm.in" className="hover:text-white transition-colors">support@digitalswarm.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 text-center md:text-left">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
               © {new Date().getFullYear()} Digital_Swarm. Secure Checkout via <span className="text-white">Cashfree Payments</span>.
             </p>
             <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-[8px] font-black uppercase tracking-widest text-white/20 italic">
                <span>GSTIN: [AUTHENTICATED]</span>
                <span>Udyam: [VERIFIED]</span>
                <span>MSME Industrial Node</span>
             </div>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-6">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Shield className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure SSL Node Active</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center text-black hover:bg-black hover:text-[#CCFF00] shadow-[4px_4px_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
