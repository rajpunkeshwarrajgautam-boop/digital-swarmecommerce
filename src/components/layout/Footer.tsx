import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border mt-auto pt-16 pb-8 backdrop-blur-sm relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advancing the agentic era. Built with Google Antigravity—the premier AI-assisted development platform.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} href="#" />
              <SocialIcon icon={<Linkedin className="w-4 h-4" />} href="#" />
            </div>
          </div>
          
          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/products?category=New" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=Featured" className="hover:text-primary transition-colors">Featured</Link></li>
              <li><Link href="/products?category=Sale" className="hover:text-primary transition-colors">Digital Deals</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold mb-6 text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 Cyber Avenue, Tech District<br />Digital City, DC 40404</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918810777573" className="hover:text-white transition-colors">+91 8810777573</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:support@antigravity.google" className="hover:text-white transition-colors">support@antigravity.google</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Google Antigravity. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/cookie" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-black transition-all duration-300"
    >
      {icon}
    </a>
  );
}
