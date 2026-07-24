'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', icon: 'monitoring', href: '/admin/dashboard' },
    { label: 'Company KYC Approval', icon: 'verified_user', href: '/admin/kyc' },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex font-sans">
      {/* Dark Admin Sidebar */}
      <aside className="w-64 bg-[#121223] border-r border-[#2F2E43] flex flex-col justify-between p-6 sticky top-0 h-screen">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C6CF0] to-[#FF6B5C] flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                SwipeHire
              </span>
              <span className="text-[10px] font-bold text-[#FF6B5C] uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#7C6CF0] text-white shadow-md'
                      : 'text-[#C7C4D8] hover:bg-[#2F2E43] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-[#2F2E43]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#2F2E43] text-xs font-bold text-[#C7C4D8] hover:text-[#FF6B5C] hover:bg-[#FF6B5C]/10 transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span> Exit Admin Panel
          </button>
        </div>
      </aside>

      {/* Main Admin View */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
