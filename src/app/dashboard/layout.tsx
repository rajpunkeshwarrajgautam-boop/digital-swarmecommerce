import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingBag, PlusCircle, LayoutDashboard } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Admin check — only the ADMIN_EMAIL can access the dashboard
  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = adminEmail
    ? user.emailAddresses.some(e => e.emailAddress === adminEmail)
    : true; // If ADMIN_EMAIL is not set, allow all authenticated users (dev fallback)

  if (!isAdmin) {
    redirect("/"); // Not an admin — send them home
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
            <LayoutDashboard className="w-6 h-6 text-green-500" />
            <span>Mission Control</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all">
            <ShoppingBag className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
            <Package className="w-5 h-5" />
            <span>Products</span>
          </Link>
          <Link href="/dashboard/add-product" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
            <PlusCircle className="w-5 h-5" />
            <span>Add New</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
             <UserButton afterSignOutUrl="/" />
             <div className="text-sm">
                <p className="font-medium">{user.firstName || 'Admin'}</p>
                <p className="text-xs text-muted-foreground truncate w-32">{user.primaryEmailAddress?.emailAddress}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
