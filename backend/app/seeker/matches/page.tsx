'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Match {
  id: string;
  status: string; // INTERESTED | CONTACTED | EXPIRED
  shortlisted: boolean;
  respondByAt: string;
  expiresAt: string;
  job: {
    id: string;
    title: string;
    skills: string[];
    company: {
      name: string;
    };
  };
  hasConversation: boolean;
  lastMessage: {
    body: string;
    createdAt: string;
  } | null;
}

export default function SeekerMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/matches', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [router]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-[#1A1A2E]">Short List</h1>
        <p className="text-xs text-[#464555]">
          Jobs where employers have reviewed your profile and shortlisted you
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-bold text-[#777587]">
          Loading your shortlist alerts...
        </div>
      ) : matches.length === 0 ? (
        <div className="w-full bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-3xl mx-auto font-extrabold">
            🎉
          </div>
          <h2 className="text-base font-bold text-[#1A1A2E]">No Shortlist Alerts Yet</h2>
          <p className="text-xs text-[#464555] max-w-xs mx-auto">
            When recruiters review your card and shortlist your profile, your shortlist notifications will appear here!
          </p>
          <Link
            href="/seeker/feed"
            className="inline-block px-5 py-2.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold shadow-md mt-2"
          >
            Explore & Swipe Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((item) => (
            <div
              key={item.id}
              className="w-full bg-white rounded-2xl p-4 card-shadow border border-[#22C55E]/40 ring-1 ring-[#22C55E]/20 flex items-center justify-between gap-3 hover:border-[#4F46E5] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {item.job.company.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#1A1A2E]">{item.job.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold flex items-center gap-1">
                      🎉 SHORTLISTED
                    </span>
                  </div>
                  <p className="text-xs text-[#464555] font-semibold">{item.job.company.name}</p>

                  {item.lastMessage ? (
                    <p className="text-[11px] text-[#777587] truncate max-w-xs mt-1">
                      💬 Recruiter: {item.lastMessage.body}
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#22C55E] font-bold mt-1">
                      ✓ Recruiter shortlisted your profile!
                    </p>
                  )}
                </div>
              </div>

              <Link
                href={`/seeker/chat/${item.id}`}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  item.hasConversation || item.status === 'CONTACTED'
                    ? 'bg-[#4F46E5] text-white hover:bg-[#3525CD] shadow-sm'
                    : 'bg-[#EFECFF] text-[#4F46E5] hover:bg-[#e2e0fc]'
                }`}
              >
                {item.hasConversation || item.status === 'CONTACTED' ? 'Open Chat' : 'View Status'}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
