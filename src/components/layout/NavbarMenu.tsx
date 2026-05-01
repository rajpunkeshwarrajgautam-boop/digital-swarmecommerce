"use client";

import * as React from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

export function NavbarMenu({ scrolled = false }: { scrolled?: boolean }) {
  const textColor = scrolled ? "text-white/70 hover:text-white" : "text-white/60 hover:text-white";

  return (
    <NavigationMenu.Root className="relative z-10 hidden lg:flex">
      <NavigationMenu.List className="flex items-center gap-1 xl:gap-2 list-none m-0 p-0">
        
        <NavigationMenu.Item>
          <Link href="/products" className={cn("px-3 xl:px-4 py-2 text-[13px] font-black transition-colors uppercase tracking-tight", textColor)}>Products</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/pricing" className={cn("px-3 xl:px-4 py-2 text-[13px] font-black transition-colors uppercase tracking-tight", textColor)}>Pricing</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/search" className={cn("px-3 xl:px-4 py-2 text-[13px] font-black transition-colors uppercase tracking-tight", textColor)}>Search</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/pulse" className={cn("px-3 xl:px-4 py-2 text-[13px] font-black transition-all uppercase tracking-tight text-primary border border-primary/20 rounded-lg hover:border-primary/50 bg-primary/5")}>Pulse</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/about" className={cn("px-3 xl:px-4 py-2 text-[13px] font-black transition-colors uppercase tracking-tight", textColor)}>About</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/blog" className={cn("px-3 xl:px-4 py-2 text-[13px] font-black transition-colors uppercase tracking-tight", textColor)}>Blog</Link>
        </NavigationMenu.Item>

      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <NavigationMenu.Viewport 
        className="relative mt-8 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-[width,height] duration-500 sm:w-(--radix-navigation-menu-viewport-width)" 
      />
      </div>
    </NavigationMenu.Root>
  );
}
