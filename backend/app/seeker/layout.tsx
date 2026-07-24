'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingGuard = async () => {
      // If user is already on profile-setup page, allow access without loop
      if (pathname === '/seeker/profile-setup') {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const seeker = data.user?.seekerProfile;

          // Mandatory Onboarding Guard Rule:
          // Seeker MUST have uploaded both profile photo (avatarUrl) AND resume file (resumeUrl)
          if (!seeker || !seeker.avatarUrl || !seeker.resumeUrl || !seeker.fullName) {
            router.push('/seeker/profile-setup');
            return;
          }
        }
      } catch (err) {
        console.error('Onboarding guard check error:', err);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingGuard();
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Discover', icon: 'swipe', href: '/seeker/feed' },
    { label: 'Short List', icon: 'star', href: '/seeker/matches' },
    { label: 'Alerts', icon: 'notifications', href: '/seeker/notifications' },
    { label: 'Profile', icon: 'person', href: '/seeker/profile' },
  ];

  if (checkingOnboarding && pathname !== '/seeker/profile-setup') {
    return (
      <div className="min-h-screen bg-[#FCF8FF] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-[#777587] mt-3">Validating Onboarding Setup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF8FF] flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass-panel px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#3525CD] to-[#7C6CF0] bg-clip-text text-transparent">
            SwipeHire
          </span>
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-[10px] font-bold uppercase tracking-wider">
            Job Seeker
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/seeker/notifications"
            className="w-8 h-8 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center hover:bg-[#4F46E5] hover:text-white transition-colors"
            title="Notifications Inbox"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs font-bold text-[#777587] hover:text-[#FF6B5C] transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      {pathname !== '/seeker/profile-setup' && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-[#E8E5FF] px-6 py-2 flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-[#4F46E5]' : 'text-[#777587] hover:text-[#1A1A2E]'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${isActive ? 'font-bold' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
