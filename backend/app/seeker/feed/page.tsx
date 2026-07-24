'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  city: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    status: string;
    city: string | null;
  };
}

export default function SeekerFeedPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState<'right' | 'left' | null>(null);

  // Job Details Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [minSalaryFilter, setMinSalaryFilter] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');

  const activeFilterCount = (cityFilter ? 1 : 0) + (minSalaryFilter ? 1 : 0) + (skillsFilter ? 1 : 0);

  const fetchJobs = async (customCity?: string, customSalary?: string, customSkills?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const queryParams = new URLSearchParams();
      const cityVal = customCity !== undefined ? customCity : cityFilter;
      const salaryVal = customSalary !== undefined ? customSalary : minSalaryFilter;
      const skillsVal = customSkills !== undefined ? customSkills : skillsFilter;

      if (cityVal) queryParams.set('city', cityVal);
      if (salaryVal) queryParams.set('minSalary', salaryVal);
      if (skillsVal) queryParams.set('skills', skillsVal);

      const res = await fetch(`/api/feed?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      setJobs(data.jobs || []);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Error fetching job feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSwipe = async (direction: 'right' | 'left') => {
    if (currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];

    setSwiping(direction);
    setShowDetailsModal(false);

    try {
      const token = localStorage.getItem('token');
      await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: currentJob.id,
          direction,
        }),
      });
    } catch (err) {
      console.error('Swipe error:', err);
    }

    setTimeout(() => {
      setSwiping(null);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleResetFeedCards = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/feed/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCityFilter('');
      setMinSalaryFilter('');
      setSkillsFilter('');
      await fetchJobs('', '', '');
    } catch (e) {
      console.error('Error resetting feed cards:', e);
    } finally {
      setLoading(false);
    }
  };

  const currentJob = jobs[currentIndex];
  const hasMoreJobs = currentIndex < jobs.length;

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#1A1A2E]">Discover Jobs</h1>
          <p className="text-xs text-[#464555]">Click card to view details. Swipe right to apply, left to pass.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetFeedCards}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-bold hover:bg-[#4F46E5] hover:text-white transition-colors"
            title="Reset swiped cards to see all published jobs"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Reset Cards
          </button>

          <button
            onClick={() => setShowFilters(true)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E8E5FF] shadow-sm text-xs font-bold text-[#1A1A2E] hover:border-[#4F46E5]"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#4F46E5] text-white text-[10px] font-extrabold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Feed Deck Container */}
      {loading ? (
        <div className="w-full h-[520px] bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF] flex flex-col items-center justify-center space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-[#777587]">Fetching latest job cards...</p>
        </div>
      ) : !hasMoreJobs ? (
        <div className="w-full h-[520px] bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF] flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-3xl font-extrabold">
            ✓
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1A1A2E]">All Cards Swiped</h2>
            <p className="text-xs text-[#464555] mt-1 max-w-xs">
              Click below to reset your deck and view all newly published job listings again!
            </p>
          </div>
          <button
            onClick={handleResetFeedCards}
            className="px-6 py-2.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold shadow-md hover:bg-[#3525CD]"
          >
            🔄 Reset Deck & View All Jobs
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-lg mx-auto h-[530px]">
          {/* Animated Card */}
          <div
            className={`w-full h-full bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] flex flex-col justify-between transition-all duration-300 transform ${
              swiping === 'right'
                ? 'translate-x-full rotate-12 opacity-0'
                : swiping === 'left'
                ? '-translate-x-full -rotate-12 opacity-0'
                : 'translate-x-0 rotate-0 opacity-100'
            }`}
          >
            {/* Company & Header Info - Clickable for details */}
            <div
              onClick={() => setShowDetailsModal(true)}
              className="flex items-start justify-between border-b border-[#EFECFF] pb-4 cursor-pointer hover:opacity-90 transition-opacity"
              title="Click to view full Job & Company details"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C6CF0] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {currentJob.company.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#1A1A2E] line-clamp-1">{currentJob.title}</h2>
                  <p className="text-xs font-bold text-[#4F46E5] flex items-center gap-1">
                    <span>{currentJob.company.name}</span>
                    <span>•</span>
                    <span className="text-[#777587] font-normal">{currentJob.city || currentJob.company.city || 'Remote'}</span>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold tracking-wide uppercase">
                VERIFIED
              </span>
            </div>

            {/* Job Details - Clickable for full details modal */}
            <div
              onClick={() => setShowDetailsModal(true)}
              className="py-4 space-y-3 flex-1 cursor-pointer hover:opacity-95 transition-opacity"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#777587]">
                    About the Position
                  </h3>
                  <span className="text-[11px] font-bold text-[#4F46E5] flex items-center gap-0.5">
                    View Details ↗
                  </span>
                </div>
                <p className="text-xs text-[#464555] leading-relaxed line-clamp-4">
                  {currentJob.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777587] mb-1.5">
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {currentJob.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777587] mb-0.5">
                  Offered Compensation
                </h3>
                <div className="text-base font-extrabold text-[#1A1A2E]">
                  {currentJob.salaryMin && currentJob.salaryMax
                    ? `₹${currentJob.salaryMin.toLocaleString()} - ₹${currentJob.salaryMax.toLocaleString()} / yr`
                    : 'Competitive Salary'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-center gap-6 border-t border-[#EFECFF]">
              <button
                onClick={() => handleSwipe('left')}
                className="w-14 h-14 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-2xl shadow-sm hover:scale-110 active:scale-95 transition-transform"
                title="Pass (Swipe Left)"
              >
                ✕
              </button>
              <button
                onClick={() => setShowDetailsModal(true)}
                className="px-4 py-2.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-bold shadow-sm hover:bg-[#4F46E5] hover:text-white transition-colors"
                title="View Full Job & Company Details"
              >
                ℹ️ Full Details
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 rounded-full bg-[#FF6B5C] text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-[#FF6B5C]/40 hover:scale-110 active:scale-95 transition-transform"
                title="Interested (Swipe Right)"
              >
                ♥
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job & Company Details Modal */}
      {showDetailsModal && currentJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#EFECFF] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C6CF0] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {currentJob.company.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#1A1A2E]">{currentJob.title}</h2>
                  <p className="text-xs font-bold text-[#4F46E5] mt-0.5">
                    {currentJob.company.name} • {currentJob.city || currentJob.company.city || 'Remote'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-[#777587] hover:text-[#1A1A2E] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Company Overview Section */}
            <div className="p-4 rounded-2xl bg-[#FCF8FF] border border-[#E8E5FF] space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
                  Company Overview
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold uppercase">
                  ✓ VERIFIED COMPANY
                </span>
              </div>
              <p className="text-xs text-[#464555]">
                {currentJob.company.name} is a verified employer hiring talent on SwipeHire.
              </p>
              <div className="text-[11px] text-[#777587] flex items-center gap-2">
                <span>📍 Location: {currentJob.company.city || 'Pan India'}</span>
                <span>•</span>
                <span>📅 Posted: {new Date(currentJob.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Comprehensive Job Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777587] mb-1">
                  Full Job Description
                </h3>
                <p className="text-xs text-[#1A1A2E] leading-relaxed whitespace-pre-line">
                  {currentJob.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777587] mb-2">
                  Required Skills & Qualifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#777587] mb-1">
                  Offered Salary / CTC
                </h3>
                <p className="text-base font-extrabold text-[#1A1A2E]">
                  {currentJob.salaryMin && currentJob.salaryMax
                    ? `₹${currentJob.salaryMin.toLocaleString()} - ₹${currentJob.salaryMax.toLocaleString()} / yr`
                    : 'Competitive Compensation Package'}
                </p>
              </div>
            </div>

            {/* Privacy Enforcement Notice (Without Phone Number) */}
            <div className="p-3 rounded-2xl bg-[#EFECFF] border border-[#E8E5FF] text-[11px] text-[#4F46E5] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-base">lock</span>
              <span>
                Direct phone numbers are hidden to protect privacy. Connect with recruiters via in-app match messaging.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center gap-4 border-t border-[#EFECFF]">
              <button
                onClick={() => handleSwipe('left')}
                className="flex-1 py-3 rounded-full border border-[#F59E0B] text-[#F59E0B] text-xs font-bold hover:bg-[#F59E0B]/10"
              >
                Pass (Swipe Left)
              </button>
              <button
                onClick={() => handleSwipe('right')}
                className="flex-1 py-3 rounded-full bg-[#FF6B5C] text-white text-xs font-bold shadow-md hover:bg-[#e05a4d]"
              >
                ♥ Apply / Interested
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal / Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFECFF]">
              <h3 className="text-base font-bold text-[#1A1A2E]">Job Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-[#777587] hover:text-[#1A1A2E] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#464555] mb-1">Target City</label>
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#464555] mb-1">Minimum Salary (₹ / yr)</label>
              <input
                type="number"
                value={minSalaryFilter}
                onChange={(e) => setMinSalaryFilter(e.target.value)}
                placeholder="e.g. 1500000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#464555] mb-1">Skills (Comma Separated)</label>
              <input
                type="text"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                placeholder="React, TypeScript"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleResetFeedCards}
                className="py-3 px-4 rounded-full border border-[#C7C4D8] text-[#777587] text-xs font-bold hover:bg-gray-50"
              >
                Reset Deck
              </button>
              <button
                onClick={() => {
                  setShowFilters(false);
                  fetchJobs();
                }}
                className="flex-1 py-3 rounded-full bg-[#4F46E5] text-white text-xs font-bold shadow-md hover:bg-[#3525CD]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
