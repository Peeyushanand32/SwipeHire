'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  skills: string[];
  applicantCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function RecruiterDashboardPage() {
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [compRes, jobsRes] = await Promise.all([
        fetch('/api/company', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (compRes.ok) {
        const compData = await compRes.json();
        setCompany(compData.company);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteJob = async (jobId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setJobs((prev) => prev.filter((j) => j.id !== jobId));

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Job "${title}" deleted successfully.`);
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E]">Recruiter Dashboard</h1>
          <p className="text-sm text-[#464555]">Manage your company postings and applicant queue</p>
        </div>
        <Link
          href="/recruiter/post-job"
          className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-bold shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">add</span> Post New Job
        </Link>
      </div>

      {/* KYC Status Banner */}
      {company && company.status === 'PENDING' && (
        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B] text-[#92400E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-[#F59E0B]">warning</span>
            <div>
              <p className="text-xs font-bold">Company Verification Pending (KYC Gate)</p>
              <p className="text-[11px] mt-0.5">
                Your company is currently under review by SwipeHire Admins. Jobs you post will remain hidden from seeker feeds until verified.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F59E0B] text-white text-[10px] font-extrabold uppercase">
            PENDING
          </span>
        </div>
      )}

      {company && company.status === 'VERIFIED' && (
        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#22C55E] text-[#166534] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-[#22C55E]">check_circle</span>
            <div>
              <p className="text-xs font-bold">Company Verified</p>
              <p className="text-[11px] mt-0.5">
                Your business KYC is verified. All active job postings are live in the candidate discovery feed!
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#22C55E] text-white text-[10px] font-extrabold uppercase">
            VERIFIED
          </span>
        </div>
      )}

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white card-shadow border border-[#E8E5FF]">
          <div className="w-10 h-10 rounded-2xl bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-xl font-bold mb-3">
            💼
          </div>
          <div className="text-3xl font-black text-[#1A1A2E]">{jobs.length}</div>
          <p className="text-xs text-[#464555] font-medium mt-1">Total Jobs Posted</p>
        </div>

        <div className="p-6 rounded-3xl bg-white card-shadow border border-[#E8E5FF]">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6B5C]/10 text-[#FF6B5C] flex items-center justify-center text-xl font-bold mb-3">
            ❤️
          </div>
          <div className="text-3xl font-black text-[#1A1A2E]">
            {jobs.reduce((acc, j) => acc + j.applicantCount, 0)}
          </div>
          <p className="text-xs text-[#464555] font-medium mt-1">Candidates Swiped Right</p>
        </div>

        <div className="p-6 rounded-3xl bg-white card-shadow border border-[#E8E5FF]">
          <div className="w-10 h-10 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] flex items-center justify-center text-xl font-bold mb-3">
            ✓
          </div>
          <div className="text-3xl font-black text-[#1A1A2E]">{company?.status || 'PENDING'}</div>
          <p className="text-xs text-[#464555] font-medium mt-1">KYC Account Status</p>
        </div>
      </div>

      {/* Posted Jobs Table */}
      <div className="bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-4">
        <h2 className="text-lg font-bold text-[#1A1A2E]">Active Job Listings</h2>

        {loading ? (
          <div className="py-8 text-center text-xs font-bold text-[#777587]">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#777587]">
            No jobs posted yet. Click "Post New Job" above to create your first listing!
          </div>
        ) : (
          <div className="divide-y divide-[#EFECFF]">
            {jobs.map((job) => (
              <div key={job.id} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1A1A2E]">{job.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {job.skills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <span className="text-xs font-bold text-[#1A1A2E]">{job.applicantCount} applicants</span>
                    <span className="block text-[10px] text-[#777587]">swiped interested</span>
                  </div>

                  <Link
                    href={`/recruiter/candidate-review?jobId=${job.id}`}
                    className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-bold shadow-sm"
                  >
                    Review Applicants →
                  </Link>

                  <button
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    className="px-3.5 py-2 rounded-full border border-[#FFDAD6] text-[#BA1A1A] hover:bg-[#FFDAD6]/30 text-xs font-bold transition-colors"
                    title="Delete Job Listing"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
