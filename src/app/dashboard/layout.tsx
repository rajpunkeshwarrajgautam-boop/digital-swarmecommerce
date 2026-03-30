"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  LogOut, 
  Shield, 
  User as UserIcon,
  Users
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) return null;

  const navItems = [
    { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
    { name: "Active Protocols", href: "/dashboard/assets", icon: Package },
    { name: "Signature History", href: "/dashboard/orders", icon: History },
    { name: "Syndicate Network", href: "/dashboard/affiliate", icon: Users },
    { name: "System Config", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono flex pt-20">
      
      {/* Dashboard Sidebar */}
      <aside className="w-80 border-r-4 border-black bg-white/5 backdrop-blur-xl hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
        
        {/* User Identity Segment */}
        <div className="p-8 border-b-4 border-black">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center overflow-hidden relative">
               {user?.imageUrl ? (
                 <Image 
                   src={user.imageUrl} 
                   alt="Profile" 
                   fill 
                   className="object-cover"
                 />
               ) : (
                 <UserIcon className="w-6 h-6 text-primary" />
               )}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Callsign</p>
              <p className="text-sm font-black italic uppercase tracking-tighter truncate max-w-[140px]">
                {user?.firstName || user?.username || "Agent_Anon"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-primary text-black text-[10px] font-black uppercase italic tracking-widest w-fit shadow-[4px_4px_0_#000]">
            <Shield className="w-3 h-3" /> Level_01 Access
          </div>
        </div>

        {/* Global Navigation */}
        <nav className="flex-1 p-4 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div 
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 p-4 transition-all relative overflow-hidden group ${isActive ? "bg-white text-black shadow-[8px_8px_0_#ff6b35]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute left-0 top-0 w-1.5 h-full bg-primary"
                    />
                  )}
                  <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`} />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                  
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* System Status Segment */}
        <div className="p-8 border-t-4 border-black space-y-6 bg-black/20">
          <div className="space-y-4">
             <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[.2em] text-white/20">
                <span>Core_Integrity</span>
                <span className="text-primary italic animate-pulse">Operational</span>
             </div>
             <div className="h-1 bg-white/5 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  className="h-full bg-primary shadow-[0_0_8px_rgba(255,107,53,0.5)]"
                />
             </div>
          </div>
          
          <SignOutButton>
            <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-red-500 transition-colors group">
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
              Terminate_Session
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Command View */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
