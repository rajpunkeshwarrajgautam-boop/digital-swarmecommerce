"use client";

import * as React from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

export function NavbarMenu({ scrolled = false }: { scrolled?: boolean }) {
  const textColor = scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/60 hover:text-white";

  return (
    <NavigationMenu.Root className="relative z-10 hidden lg:flex">
      <NavigationMenu.List className="flex items-center gap-2 list-none m-0 p-0">
        
        <NavigationMenu.Item>
          <Link href="/products" className={cn("px-4 py-2 text-sm font-black transition-colors uppercase tracking-tight", textColor)}>Inventory</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/verticals" className={cn("px-4 py-2 text-sm font-black transition-colors uppercase tracking-tight text-primary shadow-[0_0_15px_rgba(204,255,0,0.3)]", scrolled ? "text-[#CCFF00]" : "text-primary")}>Sectors</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/pricing" className={cn("px-4 py-2 text-sm font-black transition-colors uppercase tracking-tight", textColor)}>Plans</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/about" className={cn("px-4 py-2 text-sm font-black transition-colors uppercase tracking-tight", textColor)}>Forge</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/blog" className={cn("px-4 py-2 text-sm font-black transition-colors uppercase tracking-tight", textColor)}>Logs</Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="fixed top-full z-1 flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-45 rounded-tl-[2px] bg-white border border-black/5" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <NavigationMenu.Viewport 
        className="relative mt-8 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-[width,height] duration-500 sm:w-(--radix-navigation-menu-viewport-width)" 
      />
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
