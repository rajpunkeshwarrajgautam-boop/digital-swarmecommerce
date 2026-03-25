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
  User as UserIcon
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
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div 
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 p-4 transition-all border-4 ${isActive ? "bg-white text-black border-black shadow-[6px_6px_0_#ff6b35]" : "border-transparent text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* System Status Segment */}
        <div className="p-8 border-t-4 border-black space-y-6">
          <div className="space-y-4">
             <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[.2em] text-white/20">
                <span>System Integrity</span>
                <span className="text-primary italic">Nominal</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "88%" }}
                  className="h-full bg-primary"
                />
             </div>
          </div>
          
          <SignOutButton>
            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> Terminate Session
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
