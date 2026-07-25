'use client';

import { useState, useEffect } from 'react';

interface CompanyItem {
  id: string;
  name: string;
  status: string;
  gstNumber: string | null;
  city: string | null;
  createdAt: string;
  recruiters: {
    fullName: string;
    user: {
      email: string;
      phone: string | null;
    };
  }[];
  _count: {
    jobs: number;
  };
}

export default function AdminKycPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`/api/admin/companies?status=${filterStatus}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filterStatus]);

  const updateStatus = async (companyId: string, action: 'verify' | 'reject' | 'suspend') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/companies/${companyId}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchCompanies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Company KYC Verification Grid</h1>
          <p className="text-sm text-[#C7C4D8]">Approve, reject, or suspend companies to control feed visibility</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-[#2F2E43] p-1 rounded-full border border-[#464555]">
          {['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#7C6CF0] text-white shadow-md'
                  : 'text-[#C7C4D8] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#C7C4D8]">
          Loading company verification entries...
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-[#2F2E43] rounded-3xl p-12 text-center space-y-2 border border-[#464555]">
          <div className="w-12 h-12 rounded-full bg-[#121223] text-[#7C6CF0] flex items-center justify-center text-2xl mx-auto">
            verified
          </div>
          <h2 className="text-base font-bold text-white">No Companies Found</h2>
          <p className="text-xs text-[#C7C4D8]">No companies found matching the "{filterStatus}" filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {companies.map((comp) => {
            const recruiter = comp.recruiters[0];
            return (
              <div key={comp.id} className="bg-[#2F2E43] rounded-3xl p-6 border border-[#464555] space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                    <p className="text-xs text-[#C7C4D8] mt-0.5">
                      GST: <strong>{comp.gstNumber || 'Not Provided'}</strong> • City: <strong>{comp.city || 'N/A'}</strong>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      comp.status === 'VERIFIED'
                        ? 'bg-[#22C55E] text-white'
                        : comp.status === 'PENDING'
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-[#BA1A1A] text-white'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                {recruiter && (
                  <div className="p-3 rounded-2xl bg-[#121223] text-xs space-y-1">
                    <p className="text-[#C7C4D8]">
                      👤 Recruiter Name: <strong className="text-white">{recruiter.fullName}</strong>
                    </p>
                    <p className="text-[#C7C4D8]">
                      ✉️ Email: <strong className="text-white">{recruiter.user.email}</strong>
                    </p>
                    <p className="text-[#C7C4D8]">
                      📞 Phone: <strong className="text-white">{recruiter.user.phone || 'Not Provided'}</strong>
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2 border-t border-[#464555]">
                  <button
                    onClick={() => updateStatus(comp.id, 'verify')}
                    className="flex-1 py-2.5 rounded-full bg-[#22C55E] hover:bg-[#16a34a] text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Approve (Verify)
                  </button>
                  <button
                    onClick={() => updateStatus(comp.id, 'reject')}
                    className="flex-1 py-2.5 rounded-full bg-[#BA1A1A] hover:bg-[#991b1b] text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(comp.id, 'suspend')}
                    className="px-4 py-2.5 rounded-full border border-[#464555] text-[#C7C4D8] hover:text-white text-xs font-bold transition-colors"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
