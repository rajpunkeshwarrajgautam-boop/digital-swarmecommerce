"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Copy, PlusCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

interface AffiliateData {
  id: string;
  user_id: string;
  referral_code: string;
  total_clicks?: number;
  total_earnings?: number | string;
  created_at?: string;
}

interface AffiliateDashboardProps {
  initialData: AffiliateData | null;
  userId: string;
  userEmail: string;
}

export default function AffiliateDashboardClient({ initialData }: AffiliateDashboardProps) {
  const [data, setData] = useState<AffiliateData | null>(initialData);
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/affiliates/generate', {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success) {
        setData(result.affiliate);
        alert('Affiliate link generated uniquely for your profile!');
      } else {
        alert(result.message || 'Failed to generate link');
      }
    } catch (e) {
      alert(String(e));
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!data?.referral_code) return;
    const link = `${window.location.origin}?ref=${data.referral_code}`;
    navigator.clipboard.writeText(link);
    alert('Tracking Link Copied to clipboard!');
  };

  if (!data) {
    return (
      <div className="bg-white dark:bg-[#1a1c23] rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Join the Swarm Partner Network</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Earn 30% lifetime commission on all digital products you refer.</p>
        </div>
        <div className="mt-4">
          <Button 
            className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-500 text-white rounded-full h-12 px-8 font-bold" 
            onClick={handleGenerateCode}
            disabled={loading}
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {loading ? 'Initializing...' : 'Generate My Affiliate Link'}
          </Button>
        </div>
      </div>
    );
  }

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}?ref=${data.referral_code}` : `https://digitalswarm.in?ref=${data.referral_code}`;

  return (
    <div className="space-y-8">
      
      {/* Tracking Link Section */}
      <div className="bg-white dark:bg-[#1a1c23] rounded-4xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-gray-800">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Tracking Link</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Share this exact URL to track your commissions.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Input 
            value={referralLink} 
            readOnly 
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none h-14 rounded-2xl text-lg sm:w-2/3 px-6" 
          />
          <Button onClick={copyToClipboard} className="bg-linear-to-r from-blue-600 to-indigo-500 text-white rounded-full h-14 px-8 font-bold w-full sm:w-auto whitespace-nowrap">
            <Copy className="mr-2 h-5 w-5" /> Copy Link
          </Button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Clicks */}
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Referrals</span>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">{data.total_clicks || 0}</div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Unique Link Clicks</p>
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversions</span>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">0</div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Paid Sales Pending Sync</p>
          </div>
        </div>

        {/* Unpaid Earnings */}
        <div className="bg-white dark:bg-[#1a1c23] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Unpaid Earnings</span>
            <DollarSign className="h-5 w-5 text-fuchsia-500" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">₹{Number(data.total_earnings || 0).toFixed(2)}</div>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Ready for Payout</p>
          </div>
        </div>

      </div>
    </div>
  );
}
