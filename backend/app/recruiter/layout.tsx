'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [companyName, setCompanyName] = useState('My Company');
  const [companyStatus, setCompanyStatus] = useState('PENDING');

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
            setCompanyName(data.company.name);
            setCompanyStatus(data.company.status);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompany();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/recruiter/dashboard' },
    { label: 'Post a Job', icon: 'add_box', href: '/recruiter/post-job' },
    { label: 'Candidate Review', icon: 'people', href: '/recruiter/candidate-review' },
    { label: 'Chats & Messages', icon: 'chat', href: '/recruiter/chats' },
    { label: 'Company Profile', icon: 'domain', href: '/recruiter/company-profile' },
  ];

  return (
    <div className="min-h-screen bg-[#FCF8FF] flex font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E8E5FF] flex flex-col justify-between p-6 sticky top-0 h-screen shadow-sm">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#3525CD] to-[#7C6CF0] bg-clip-text text-transparent block">
                SwipeHire
              </span>
              <span className="text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                Recruiter / Company Hub
              </span>
            </div>
          </div>

          {/* Company Status Pill */}
          <div className="p-3 rounded-2xl bg-[#EFECFF] border border-[#E8E5FF] mb-6">
            <p className="text-xs font-bold text-[#1A1A2E] truncate">{companyName}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  companyStatus === 'VERIFIED'
                    ? 'bg-[#22C55E]'
                    : companyStatus === 'PENDING'
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#BA1A1A]'
                }`}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#464555]">
                {companyStatus}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#4F46E5] text-white shadow-md'
                      : 'text-[#464555] hover:bg-[#EFECFF] hover:text-[#4F46E5]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User / Logout Footer */}
        <div className="pt-4 border-t border-[#EFECFF]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E8E5FF] text-xs font-bold text-[#777587] hover:text-[#FF6B5C] hover:bg-[#FFDAD6]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
