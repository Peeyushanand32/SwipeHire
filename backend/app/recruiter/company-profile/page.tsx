'use client';

import { useState, useEffect } from 'react';

export default function RecruiterCompanyProfilePage() {
  const [name, setName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('PENDING');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/company', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            setName(data.company.name || '');
            setGstNumber(data.company.gstNumber || '');
            setCity(data.company.city || '');
            setStatus(data.company.status || 'PENDING');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/company', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, gstNumber, city }),
      });

      if (res.ok) {
        setMessage('Company details updated successfully!');
      } else {
        setMessage('Failed to update company details.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Company Profile</h1>
        <p className="text-sm text-[#464555]">Manage your company verification details and business location</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#777587]">
          Loading company details...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-4">
          {message && (
            <div className="p-3 rounded-xl bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold text-center">
              {message}
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#EFECFF] border border-[#E8E5FF]">
            <div>
              <span className="text-xs font-bold text-[#1A1A2E] block">KYC Verification Status</span>
              <span className="text-[11px] text-[#464555]">Controlled by Admin review</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                status === 'VERIFIED'
                  ? 'bg-[#22C55E] text-white'
                  : status === 'PENDING'
                  ? 'bg-[#F59E0B] text-white'
                  : 'bg-[#BA1A1A] text-white'
              }`}
            >
              {status}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Company Legal Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              GST Number
            </label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              placeholder="29ABCDE1234F1ZH"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Headquarters City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Bangalore"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? 'Saving...' : 'Update Company Profile'}
          </button>
        </form>
      )}
    </div>
  );
}
