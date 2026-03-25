"use client";

import * as React from "react";
import Link from "next/link";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { cn } from "@/lib/utils";

export function NavbarMenu() {
  return (
    <NavigationMenu.Root className="relative z-10 hidden lg:flex">
      <NavigationMenu.List className="flex items-center gap-2 list-none m-0 p-0">
        
        <NavigationMenu.Item>
          <Link href="/products" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">Products</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/pricing" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">Pricing</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/about" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">About</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/faq" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">FAQ</Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <Link href="/blog" className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-tight">Blog</Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="fixed top-full z-1 flex h-[10px] items-end justify-center overflow-hidden transition-[width,transform_250ms_ease]">
          <div className="relative top-[70%] h-[10px] w-[10px] rotate-45 rounded-tl-[2px] bg-white border border-black/5" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="perspective-[2000px] absolute top-full left-0 flex w-full justify-center">
        <NavigationMenu.Viewport 
        className="relative mt-8 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden border-4 border-black bg-white/95 backdrop-blur-3xl shadow-[32px_32px_0_#000] transition-[width,_height] duration-500 sm:w-(--radix-navigation-menu-viewport-width)" 
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
