"use client";

import * as React from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Cpu, Globe, Shield, Zap, Sparkles } from "lucide-react";

const PRODUCTS = [
  {
    title: "AI Agent Swarms",
    href: "/products?category=AI+Agents",
    description: "Autonomous multi-agent frameworks for YouTube, Sales, and Legal automation.",
    icon: <Cpu className="w-5 h-5 text-primary" />,
  },
  {
    title: "Software Starters",
    href: "/products?category=Web+Development",
    description: "Next.js 15 boilerplates with Clerk, Supabase, and Razorpay pre-integrated.",
    icon: <Globe className="w-5 h-5 text-secondary" />,
  },
  {
    title: "Elite Subscriptions",
    href: "/elite",
    description: "Private Discord access and weekly AI prompt/module injections.",
    icon: <Shield className="w-5 h-5 text-[#4ECDC4]" />,
  },
];

const CATEGORIES = [
  { title: "React & Next.js", href: "/products?category=Web+Development" },
  { title: "Artificial Intelligence", href: "/products?category=AI+Agents" },
  { title: "Performance Marketing", href: "/products?category=Marketing+AI" },
  { title: "E-commerce Assets", href: "/products?category=Bundles" },
];

export function NavbarMenu() {
  return (
    <NavigationMenu.Root className="relative z-10 hidden lg:flex">
      <NavigationMenu.List className="flex items-center gap-2 list-none m-0 p-0">
        
        {/* Products Dropdown */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors outline-none select-none uppercase tracking-tight">
            Products
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-full left-0 mt-3 w-[450px] bg-white rounded-4xl shadow-2xl border border-black/5 p-6 origin-top-left overflow-hidden">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Technological Core</p>
                {PRODUCTS.map((item) => (
                  <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>
                    {item.description}
                  </ListItem>
                ))}
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Categories Dropdown */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors outline-none select-none uppercase tracking-tight">
            Categories
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-full left-0 mt-3 w-[500px] bg-white rounded-4xl shadow-2xl border border-black/5 p-6 origin-top-left overflow-hidden">
             <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Vertical Infiltration</p>
                 {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.title} 
                      href={cat.href}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-2 group/cat"
                    >
                      <Zap className="w-3 h-3 text-gray-300 group-hover/cat:text-primary transition-colors" />
                      {cat.title}
                    </Link>
                 ))}
               </div>
               <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-black uppercase italic tracking-tighter text-gray-900 leading-tight">Elite Tier Inbound</h4>
                  <p className="text-xs text-gray-500 font-medium">Gain access to the full matrix of private repositories and 1-on-1 support.</p>
                  <Link href="/elite" className="text-xs font-black uppercase text-primary hover:text-secondary flex items-center gap-1 group/link">
                    Upgrade Access <ChevronDown className="w-3 h-3 -rotate-90 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
               </div>
             </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        {/* Static Links */}
        <NavigationMenu.Item>
          <Link href="#products" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">Pricing</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="#about" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">About</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="#contact" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">Contact</Link>
        </NavigationMenu.Item>

        {/* Indicator */}
        <NavigationMenu.Indicator className="fixed top-full z-1 flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-45 rounded-tl-[2px] bg-white border border-black/5" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <NavigationMenu.Viewport className="relative mt-[10px] h-(--radix-navigation-menu-viewport-height) w-full origin-[top_center] overflow-hidden rounded-4xl bg-white transition-[width,height] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 sm:w-(--radix-navigation-menu-viewport-width) shadow-2xl" />
      </div>
    </NavigationMenu.Root>
  );
}

const ListItem = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }>(
  ({ className, title, children, icon, ...props }, ref) => {
    return (
      <NavigationMenu.Link asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-2xl p-4 leading-none no-underline outline-none transition-all group hover:bg-gray-50",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-4">
            {icon && <div className="shrink-0 p-2 rounded-xl bg-white border border-black/5 group-hover:scale-110 transition-transform shadow-sm">{icon}</div>}
            <div>
              <div className="text-sm font-black uppercase tracking-tight text-gray-900 mb-1 group-hover:text-primary transition-colors leading-none">
                {title}
              </div>
              <p className="line-clamp-2 text-xs font-medium leading-relaxed text-gray-500">
                {children}
              </p>
            </div>
          </div>
        </a>
      </NavigationMenu.Link>
    );
  }
);
ListItem.displayName = "ListItem";
