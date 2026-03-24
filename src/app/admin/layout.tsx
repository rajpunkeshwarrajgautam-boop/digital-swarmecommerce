import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, TerminalSquare, Activity, Users, Database } from "lucide-react";

// ==========================================
// 🚨 MASTER ADMIN CONFIGURATION 🚨
// Replace this with your actual Clerk email!
// ==========================================
const MASTER_ADMIN_EMAILS = [
  "admin@digitalswarm.in",
  "rajpunkeshwarrajgautam@gmail.com", // Assumed from github username
  "test@example.com" // For local testing
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  // 1. Kick out unauthenticated users
  if (!user) {
    redirect("/");
  }

  // 2. Extract primary email
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  // 3. Kick out non-admins
  if (!primaryEmail || !MASTER_ADMIN_EMAILS.includes(primaryEmail.toLowerCase())) {
    redirect("/");
  }

  // If they pass, render the secure Admin Shell
  return (
    <div className="min-h-screen bg-[#020408] text-gray-200 font-mono flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-[#CCFF00]/10 bg-black/50 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-10 text-[#CCFF00]">
          <ShieldAlert className="w-8 h-8" />
          <span className="font-black italic uppercase tracking-widest text-lg">GOD VIEW</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#CCFF00]/10 text-[#CCFF00] font-bold border border-[#CCFF00]/20">
            <Activity className="w-4 h-4" /> Telemetry
          </Link>
          <Link href="/admin/affiliates" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-all font-bold">
            <Users className="w-4 h-4" /> Affiliates
          </Link>
          <Link href="/admin/database" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-all font-bold">
            <Database className="w-4 h-4" /> Raw Data
          </Link>
          <div className="pt-8 mt-8 border-t border-white/5">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:text-white transition-all text-xs uppercase tracking-widest">
              <TerminalSquare className="w-4 h-4" /> Return to Matrix
            </Link>
          </div>
        </nav>

        <div className="text-[10px] text-gray-600 uppercase tracking-widest text-center mt-auto">
          Admin clearance verified.<br/>
          {primaryEmail}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
        {/* Deep background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[#CCFF00]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="p-8 md:p-12 relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
