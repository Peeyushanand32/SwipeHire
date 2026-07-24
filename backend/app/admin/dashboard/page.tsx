'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Platform Overview</h1>
          <p className="text-sm text-[#C7C4D8]">Live metrics across job seekers, recruiters, and companies</p>
        </div>

        <Link
          href="/admin/kyc"
          className="px-5 py-2.5 rounded-full bg-[#7C6CF0] hover:bg-[#5846CA] text-white text-xs font-bold shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">verified_user</span> Review Pending KYC ({analytics?.pendingCompanies || 0})
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#C7C4D8]">
          Loading platform metrics...
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-[#2F2E43] border border-[#464555]">
            <div className="w-10 h-10 rounded-2xl bg-[#7C6CF0]/20 text-[#7C6CF0] flex items-center justify-center text-xl font-bold mb-3">
              group
            </div>
            <div className="text-3xl font-black text-white">{analytics?.totalUsers || 0}</div>
            <p className="text-xs text-[#C7C4D8] font-medium mt-1">Total Users Registered</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#2F2E43] border border-[#464555]">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center text-xl font-bold mb-3">
              pending_actions
            </div>
            <div className="text-3xl font-black text-[#F59E0B]">{analytics?.pendingCompanies || 0}</div>
            <p className="text-xs text-[#C7C4D8] font-medium mt-1">Pending KYC Companies</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#2F2E43] border border-[#464555]">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center text-xl font-bold mb-3">
              work
            </div>
            <div className="text-3xl font-black text-white">{analytics?.activeJobs || 0}</div>
            <p className="text-xs text-[#C7C4D8] font-medium mt-1">Active Job Listings</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#2F2E43] border border-[#464555]">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B5C]/20 text-[#FF6B5C] flex items-center justify-center text-xl font-bold mb-3">
              touch_app
            </div>
            <div className="text-3xl font-black text-white">{analytics?.totalSwipes || 0}</div>
            <p className="text-xs text-[#C7C4D8] font-medium mt-1">Total Swipes Interest</p>
          </div>
        </div>
      )}
    </div>
  );
}
