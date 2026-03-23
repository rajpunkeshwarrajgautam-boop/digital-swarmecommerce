import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t-8 border-black mt-auto pt-24 pb-12 relative overflow-hidden text-black z-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Top Tape */}
      <div className="absolute top-0 right-10 w-48 h-8 bg-red-500 border-x-4 border-b-4 border-black text-white font-black italic uppercase tracking-widest flex items-center justify-center shadow-[4px_4px_0_#000] z-10 text-xs">EOF_SYSTEM_LOG</div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Logo />
            <p className="text-sm text-black/80 leading-relaxed font-black uppercase italic tracking-tighter max-w-xs bg-[#CCFF00] border-2 border-black p-4 shadow-[4px_4px_0_#000]">
              Elite Digital Assets. High-Performance Protocols For Modern Architects. Deploy With Absolute Certainty.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook className="w-5 h-5" />} href="https://facebook.com" label="Facebook" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="https://twitter.com" label="Twitter" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="https://instagram.com" label="Instagram" />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="https://linkedin.com" label="LinkedIn" />
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-black italic border-b-4 border-black pb-2 inline-block">Catalog_Index</h4>
            <ul className="space-y-4 text-xs font-black uppercase italic tracking-widest text-black/60">
              <li><Link href="/products" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">All_Protocols</Link></li>
              <li><Link href="/products?category=Web+Development" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Web_Infrastructure</Link></li>
              <li><Link href="/products?category=AI+Agents" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Neural_Networks</Link></li>
              <li><Link href="/bundle-builder" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Logical_Bundling</Link></li>
              <li><Link href="/tools/prompt-generator" className="text-blue-600 hover:text-white hover:bg-blue-600 border-2 border-transparent hover:border-blue-600 px-2 py-1 -ml-2 transition-all">Free_Utilities</Link></li>
              <li><Link href="/solutions" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Industry_Solutions</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-black italic border-b-4 border-black pb-2 inline-block">Organization</h4>
            <ul className="space-y-4 text-xs font-black uppercase italic tracking-widest text-black/60">
              <li><Link href="/about" className="hover:text-black hover:bg-yellow-400 border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Mission_Profile</Link></li>
              <li><Link href="/faq" className="hover:text-black hover:bg-yellow-400 border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Support_Grid</Link></li>
              <li><Link href="/license" className="hover:text-black hover:bg-yellow-400 border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Licensing_Sync</Link></li>
              <li><Link href="/terms" className="hover:text-black hover:bg-yellow-400 border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Usage_Agreement</Link></li>
              <li><Link href="/refund" className="hover:text-black hover:bg-yellow-400 border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">Exit_Protocol</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-black italic border-b-4 border-black pb-2 inline-block">Communications</h4>
            <ul className="space-y-6 text-xs font-black uppercase italic tracking-widest text-black/80">
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-red-500 shrink-0 filter drop-shadow-[2px_2px_0_#000]" />
                <span className="leading-tight bg-white border-2 border-black p-2 shadow-[2px_2px_0_#000]">Cyber City Innovation Hub,<br />Haryana 122002, IND</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-red-500 shrink-0 filter drop-shadow-[2px_2px_0_#000]" />
                <a href="tel:+918810777573" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">+91 88107 77573</a>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-red-500 shrink-0 filter drop-shadow-[2px_2px_0_#000]" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:support@digitalswarm.in" className="hover:text-black hover:bg-[#CCFF00] border-2 border-transparent hover:border-black px-2 py-1 -ml-2 transition-all">support@digitalswarm.in</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t-8 border-black flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
             <p className="text-xs font-black uppercase tracking-widest text-black italic bg-[#ffc737] border-2 border-black p-2 inline-block shadow-[2px_2px_0_#000]">
               © {new Date().getFullYear()} Digital_Swarm. All rights reserved.
             </p>
             <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-black/50 italic mt-4">
                <span>GSTIN: [PENDING_REGISTRATION]</span>
                <span>Udyam: [UDYAM-HR-XX-XXXXXXX]</span>
                <span>MSME Certified Node</span>
             </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="text-xs font-black uppercase tracking-widest text-white bg-black hover:bg-[#CCFF00] hover:text-black border-2 border-transparent hover:border-black px-4 py-2 transition-all italic shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0_#000]">Privacy_Protocol</Link>
            <Link href="/terms" className="text-xs font-black uppercase tracking-widest text-white bg-black hover:bg-[#CCFF00] hover:text-black border-2 border-transparent hover:border-black px-4 py-2 transition-all italic shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0_#000]">Usage_Terms</Link>
            <Link href="/refund" className="text-xs font-black uppercase tracking-widest text-white bg-black hover:bg-[#CCFF00] hover:text-black border-2 border-transparent hover:border-black px-4 py-2 transition-all italic shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0_#000]">Refund_Policy</Link>
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
