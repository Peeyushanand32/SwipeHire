'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterPricingPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState('FREE');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/subscriptions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.subscription?.plan || 'FREE');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSub();
  }, []);

  const handleSelectPlan = async (plan: 'FREE' | 'PRO' | 'ENTERPRISE') => {
    if (plan === currentPlan) return;
    setUpgrading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentPlan(data.subscription.plan);
        setMessage(`Successfully upgraded company plan to ${plan}!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  const plans = [
    {
      name: 'FREE',
      price: '₹0',
      period: 'forever',
      features: ['Up to 2 Job Postings', 'Basic Candidate Queue', 'Standard Email Support'],
      highlight: false,
    },
    {
      name: 'PRO',
      price: '₹4,999',
      period: 'per month',
      features: [
        'Unlimited Job Postings',
        'Priority Candidate Queue',
        'Shortlist Notifications & SMS',
        'Direct Candidate Chat Access',
      ],
      highlight: true,
    },
    {
      name: 'ENTERPRISE',
      price: '₹14,999',
      period: 'per month',
      features: [
        'Everything in PRO',
        'Dedicated Account Manager',
        'Bulk Candidate Export',
        'Custom Company Branding',
      ],
      highlight: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Recruiter / Company Subscription Plans</h1>
        <p className="text-sm text-[#464555]">Upgrade your hiring tier to unlock unlimited candidate matching</p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold text-center border border-[#22C55E]/20">
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#777587]">
          Loading subscription options...
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = currentPlan === p.name;
            return (
              <div
                key={p.name}
                className={`bg-white rounded-3xl p-6 card-shadow border transition-all flex flex-col justify-between ${
                  p.highlight ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-[#E8E5FF]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#4F46E5]">
                      {p.name} PLAN
                    </span>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold">
                        CURRENT PLAN
                      </span>
                    )}
                  </div>

                  <div className="text-3xl font-black text-[#1A1A2E]">{p.price}</div>
                  <span className="text-xs text-[#777587] font-medium">{p.period}</span>

                  <ul className="mt-6 space-y-2.5">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-[#464555]">
                        <span className="material-symbols-outlined text-sm text-[#22C55E]">check_circle</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(p.name as any)}
                  disabled={isCurrent || upgrading}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all mt-8 ${
                    isCurrent
                      ? 'bg-[#EFECFF] text-[#4F46E5] cursor-default'
                      : 'bg-[#4F46E5] hover:bg-[#3525CD] text-white shadow-md'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : upgrading ? 'Processing...' : `Upgrade to ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
