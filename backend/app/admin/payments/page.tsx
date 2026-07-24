'use client';

import { useState, useEffect } from 'react';

interface SubItem {
  id: string;
  plan: string;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    status: string;
    recruiters: {
      fullName: string;
      user: { email: string };
    }[];
  };
}

export default function AdminPaymentsPage() {
  const [subscriptions, setSubscriptions] = useState<SubItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/admin/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.subscriptions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Recruiter / Company Subscriptions & Payments</h1>
        <p className="text-sm text-[#C7C4D8]">Overview of company subscription tiers and revenue status</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#C7C4D8]">
          Loading subscription records...
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-[#2F2E43] rounded-3xl p-12 text-center border border-[#464555]">
          <p className="text-xs text-[#C7C4D8]">No active recruiter subscription records found.</p>
        </div>
      ) : (
        <div className="bg-[#2F2E43] rounded-3xl p-6 border border-[#464555] space-y-4">
          <div className="divide-y divide-[#464555]">
            {subscriptions.map((sub) => {
              const recruiter = sub.company.recruiters[0];
              return (
                <div key={sub.id} className="py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{sub.company.name}</h3>
                    <p className="text-xs text-[#C7C4D8] mt-0.5">
                      Recruiter: <strong>{recruiter?.fullName || 'N/A'}</strong> ({recruiter?.user.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        sub.plan === 'ENTERPRISE'
                          ? 'bg-[#FF6B5C] text-white'
                          : sub.plan === 'PRO'
                          ? 'bg-[#7C6CF0] text-white'
                          : 'bg-[#464555] text-[#C7C4D8]'
                      }`}
                    >
                      {sub.plan} PLAN
                    </span>

                    <span className="text-xs text-[#C7C4D8]">
                      Status: <strong className="text-white">{sub.active ? 'Active' : 'Expired'}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
