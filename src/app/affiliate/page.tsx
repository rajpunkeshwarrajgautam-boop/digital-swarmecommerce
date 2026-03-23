import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AffiliateDashboardClient from '@/components/affiliates/AffiliateDashboardClient';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function AffiliateDashboard() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in?redirect_url=/affiliate');
  }

  // Fetch existing affiliate data from Supabase
  const { data: affiliate, error } = await supabaseAdmin
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)] pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
              Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Dashboard</span>
            </h1>
            <p className="text-lg text-[var(--secondary-foreground)]">
              Generate links, track your clicks, and manage your Swarm payouts.
            </p>
          </div>
          
          <AffiliateDashboardClient 
            initialData={affiliate || null} 
            userId={user.id} 
            userEmail={user.emailAddresses[0]?.emailAddress || 'Partner'} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
