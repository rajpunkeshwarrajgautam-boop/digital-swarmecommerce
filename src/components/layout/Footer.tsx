import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto pt-16 pb-8 backdrop-blur-sm relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium digital products for developers and creators. Source code, UI kits, and templates — download and ship today.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href="https://facebook.com" label="Facebook" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} href="https://twitter.com" label="Twitter" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href="https://instagram.com" label="Instagram" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="https://linkedin.com" label="LinkedIn" />
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/products?category=Web+Development" className="hover:text-primary transition-colors">Web Development</Link></li>
              <li><Link href="/products?category=AI+Agents" className="hover:text-primary transition-colors">AI Agents</Link></li>
              <li><Link href="/bundle-builder" className="hover:text-primary transition-colors">Bundle Builder</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/license" className="hover:text-primary transition-colors">License</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Cyber City Innovation Hub,<br />Gurugram, Haryana 122002, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918810777573" className="hover:text-primary transition-colors">+91 88107 77573</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:support@digitalswarm.in" className="hover:text-primary transition-colors">support@digitalswarm.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Digital Swarm. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">Refunds</Link>
            <Link href="/license" className="hover:text-foreground transition-colors">License</Link>
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
      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-black transition-all duration-300"
    >
      {icon}
    </a>
  );
}
