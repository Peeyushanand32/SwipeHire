'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterPostJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [city, setCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not logged in. Redirecting to login page...');
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      const parsedSkills = skills
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      // Clean salary inputs (remove commas/spaces)
      const cleanMinSalary = salaryMin ? parseInt(salaryMin.replace(/,/g, '').trim(), 10) : null;
      const cleanMaxSalary = salaryMax ? parseInt(salaryMax.replace(/,/g, '').trim(), 10) : null;

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          skills: parsedSkills,
          salaryMin: cleanMinSalary && !isNaN(cleanMinSalary) ? cleanMinSalary : null,
          salaryMax: cleanMaxSalary && !isNaN(cleanMaxSalary) ? cleanMaxSalary : null,
          city: city.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish job listing');
      }

      setSuccessMsg('✓ Job Published Successfully! It is now live in candidates feed.');
      setTimeout(() => {
        router.push('/recruiter/dashboard');
      }, 1200);
    } catch (err: any) {
      console.error('Job post error:', err);
      setError(err.message || 'An unexpected error occurred while posting job');
    } finally {
      setLoading(false);
    }
  };

  const parsedSkillsList = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Post a New Job</h1>
        <p className="text-sm text-[#464555]">Create a listing that will appear in job seekers' discovery feed</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#FFDAD6] text-[#93000A] text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] text-xs font-extrabold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {successMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Job Creator Form */}
        <form onSubmit={handlePostJob} className="bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Job Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job responsibilities, company culture, and requirements..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Required Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Next.js"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                Min Salary (₹ / yr)
              </label>
              <input
                type="text"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="1500000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                Max Salary (₹ / yr)
              </label>
              <input
                type="text"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="2500000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Location / City
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
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Publishing Job...' : 'Publish Job Listing'}
          </button>
        </form>

        {/* Live Card Preview */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#777587]">
            Live Candidate Card Preview
          </h2>
          <div className="bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF]">
            <div className="flex items-start justify-between pb-4 border-b border-[#EFECFF]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C6CF0] text-white font-bold text-lg flex items-center justify-center shadow-md">
                  CO
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A2E] leading-tight">
                    {title || 'Job Title Placeholder'}
                  </h3>
                  <p className="text-xs text-[#464555] font-medium mt-0.5">
                    Your Company • {city || 'City'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold uppercase">
                VERIFIED
              </span>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-[#464555] line-clamp-3">
                {description || 'Job description preview will be displayed here as candidates swipe through cards...'}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {parsedSkillsList.length > 0 ? (
                  parsedSkillsList.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold">
                    Skill Tag
                  </span>
                )}
              </div>

              <div className="text-sm font-bold text-[#1A1A2E] pt-2">
                {salaryMin && salaryMax
                  ? `₹${salaryMin} - ₹${salaryMax} / yr`
                  : '₹ Salary Range'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
