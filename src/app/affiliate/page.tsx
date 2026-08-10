import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AffiliateDashboardClient from '@/components/affiliates/AffiliateDashboardClient';

type AffiliateData = {
  id: string;
  user_id: string;
  referral_code?: string;
  total_clicks?: number;
  conversions?: number;
  earnings?: number | string;
  total_earnings?: number | string;
  status?: string;
  created_at?: string;
};

export default async function AffiliateDashboard() {
  const user = await currentUser();
  if (!user) redirect('/sign-in?redirect_url=/affiliate');

  let affiliate: AffiliateData | null = null;
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('affiliates')
      .select('id,user_id,referral_code,total_clicks,total_earnings,status,created_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      affiliate = data as AffiliateData;
      const referralCode = data.referral_code || '';
      if (referralCode) {
        const { data: commissions } = await supabaseAdmin
          .from('commissions')
          .select('affiliate_share,status')
          .eq('affiliate_id', referralCode);
        const rows = commissions || [];
        affiliate = {
          ...affiliate,
          conversions: rows.length,
          earnings: rows.reduce((sum, row) => sum + Number(row.affiliate_share || 0), 0),
        };
      }
    }
  }

  return (
    <main className="min-h-screen bg-(--background) pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            Partner <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">Dashboard</span>
          </h1>
          <p className="text-lg text-(--secondary-foreground)">
            Generate a referral link and view recorded clicks, paid-order conversions, and commissions.
          </p>
        </div>
        <AffiliateDashboardClient initialData={affiliate} />
      </div>
    </main>
  );
}
