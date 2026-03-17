import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 mt-auto pt-24 pb-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.02] pointer-events-none" />
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-primary"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Logo />
            <p className="text-sm text-white/40 leading-relaxed font-black uppercase italic tracking-tighter max-w-xs">
              Elite Digital Assets. High-Performance Protocols For Modern Architects. Deploy With Absolute Certainty.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href="https://facebook.com" label="Facebook" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} href="https://twitter.com" label="Twitter" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href="https://instagram.com" label="Instagram" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="https://linkedin.com" label="LinkedIn" />
            </div>
          </div>

          {/* Shop Links */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-primary italic">Catalog_Index</h4>
            <ul className="space-y-4 text-xs font-black uppercase italic tracking-tighter text-white/30">
              <li><Link href="/products" className="hover:text-white transition-colors">All_Protocols</Link></li>
              <li><Link href="/products?category=Web+Development" className="hover:text-white transition-colors">Web_Infrastructure</Link></li>
              <li><Link href="/products?category=AI+Agents" className="hover:text-white transition-colors">Neural_Networks</Link></li>
              <li><Link href="/bundle-builder" className="hover:text-white transition-colors">Logical_Bundling</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-primary italic">Organization</h4>
            <ul className="space-y-4 text-xs font-black uppercase italic tracking-tighter text-white/30">
              <li><Link href="/about" className="hover:text-white transition-colors">Mission_Profile</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Support_Grid</Link></li>
              <li><Link href="/license" className="hover:text-white transition-colors">Licensing_Sync</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Usage_Agreement</Link></li>
              <li><Link href="/refund" className="hover:text-white transition-colors">Exit_Protocol</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-primary italic">Communications</h4>
            <ul className="space-y-6 text-xs font-black uppercase italic tracking-tighter text-white/30">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="leading-tight">Cyber City Innovation Hub,<br />Haryana 122002, IND</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918810777573" className="hover:text-white transition-colors">+91 88107 77573</a>
              </li>
              <li className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:support@digitalswarm.in" className="hover:text-white transition-colors text-white">support@digitalswarm.in</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
            © {new Date().getFullYear()} Digital_Swarm. Secure_Transmission_Certified.
          </p>
          <div className="flex gap-10">
            <Link href="/privacy" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors italic">Privacy</Link>
            <Link href="/terms" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors italic">Legal</Link>
            <Link href="/refund" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-primary transition-colors italic">Refunds</Link>
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
      className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/30 hover:bg-primary hover:text-black hover:border-primary transition-all duration-300"
    >
      {icon}
    </a>
  );
}
