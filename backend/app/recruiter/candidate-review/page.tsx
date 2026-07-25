'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface CandidateQueueItem {
  interestId: string;
  shortlisted: boolean;
  shortlistedAt: string | null;
  createdAt: string;
  respondByAt: string;
  expiresAt: string;
  candidate: {
    id: string;
    userId: string;
    fullName: string;
    headline: string | null;
    skills: string[];
    expectedSalary: number | null;
    city: string | null;
    resumeUrl: string | null;
    avatarUrl: string | null;
    email: string;
    phone: string | null;
  };
}

export default function RecruiterCandidateReviewPage() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [queue, setQueue] = useState<CandidateQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  // First message modal state
  const [activeInterestId, setActiveInterestId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
          if (data.jobs?.length > 0 && !selectedJobId) {
            setSelectedJobId(data.jobs[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  const fetchQueue = async (jobId: string) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/jobs/${jobId}/queue`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setQueue(data.queue || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchQueue(selectedJobId);
    }
  }, [selectedJobId]);

  const handleReject = async (interestId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/interests/${interestId}/pass`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('❌ Application Rejected! Notification alert sent to seeker.');
      }
      setQueue((prev) => prev.filter((item) => item.interestId !== interestId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShortlist = async (interestId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/interests/${interestId}/shortlist`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert('🎉 Candidate Shortlisted! Notification alert sent to Seeker.');
      }
      fetchQueue(selectedJobId);
    } catch (err) {
      console.error(err);
    }
  };

  const openMessageModal = (interestId: string) => {
    setActiveInterestId(interestId);
    setMessageText('');
    setShowMessageModal(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeInterestId) return;

    setSendingMsg(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interestId: activeInterestId,
          body: messageText.trim(),
        }),
      });

      if (res.ok) {
        setShowMessageModal(false);
        fetchQueue(selectedJobId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingMsg(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Candidate Review Queue</h1>
        <p className="text-sm text-[#464555]">
          Review candidates who swiped interested on your jobs, inspect their resumes, and shortlist or initiate contact
        </p>
      </div>

      {/* Job Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-[#777587] uppercase tracking-wider shrink-0">
          Select Position:
        </span>
        {jobs.length === 0 ? (
          <span className="text-xs text-[#464555]">No jobs posted yet</span>
        ) : (
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white border border-[#E8E5FF] text-xs font-bold text-[#1A1A2E] shadow-sm outline-none"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#777587]">
          Loading candidate queue...
        </div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 card-shadow border border-[#E8E5FF] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-3xl mx-auto">
            inbox
          </div>
          <h2 className="text-lg font-bold text-[#1A1A2E]">No Pending Candidates</h2>
          <p className="text-xs text-[#464555] max-w-sm mx-auto">
            You've reviewed all candidates for this position or no new applicants have swiped right yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {queue.map((item) => (
            <div
              key={item.interestId}
              className={`bg-white rounded-3xl p-6 card-shadow border transition-all space-y-4 ${
                item.shortlisted ? 'border-[#22C55E] ring-2 ring-[#22C55E]/20' : 'border-[#E8E5FF]'
              }`}
            >
              {/* Header: Photo, Name, Headline */}
              <div className="flex items-start justify-between pb-3 border-b border-[#EFECFF]">
                <div className="flex items-center gap-3">
                  {item.candidate.avatarUrl ? (
                    <img
                      src={item.candidate.avatarUrl}
                      alt={item.candidate.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-[#4F46E5] shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-black text-base flex items-center justify-center shadow-md">
                      {item.candidate.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-extrabold text-[#1A1A2E] leading-tight">
                      {item.candidate.fullName}
                    </h3>
                    <p className="text-xs text-[#464555] font-semibold mt-0.5">
                      {item.candidate.headline || 'Job Seeker Candidate'}
                    </p>
                  </div>
                </div>

                {item.shortlisted && (
                  <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-extrabold uppercase tracking-wide">
                    ✓ SHORTLISTED
                  </span>
                )}
              </div>

              {/* Candidate Info Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-[#464555] bg-[#FCF8FF] p-3 rounded-2xl border border-[#E8E5FF]">
                  <div>
                    <span className="text-[10px] text-[#777587] font-bold block uppercase">City Location</span>
                    <span className="font-bold text-[#1A1A2E]">{item.candidate.city || 'Remote / Unspecified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777587] font-bold block uppercase">Expected CTC</span>
                    <span className="font-bold text-[#1A1A2E]">
                      {item.candidate.expectedSalary ? `₹${item.candidate.expectedSalary.toLocaleString()} / yr` : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Candidate Skills */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777587] block mb-1">
                    Verified Skills Profile
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.candidate.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RESUME VIEW & DOWNLOAD BUTTON */}
                <div className="pt-2 flex items-center justify-between bg-[#F0FDF4] p-3 rounded-2xl border border-[#22C55E]/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#22C55E] text-lg">description</span>
                    <span className="text-xs font-bold text-[#166534]">Candidate Resume</span>
                  </div>

                  {item.candidate.resumeUrl ? (
                    <a
                      href={item.candidate.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#22C55E] hover:bg-[#16a34a] text-white text-xs font-extrabold shadow-sm transition-all transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span> View Resume PDF ↗
                    </a>
                  ) : (
                    <span className="text-xs text-[#777587] font-semibold italic">No Resume Uploaded</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-[#EFECFF]">
                <button
                  onClick={() => handleReject(item.interestId)}
                  className="flex-1 py-2.5 rounded-full border border-[#FFDAD6] text-[#BA1A1A] hover:bg-[#FFDAD6]/30 text-xs font-bold transition-colors"
                >
                  ✕ Reject
                </button>
                <button
                  onClick={() => handleShortlist(item.interestId)}
                  className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-colors ${
                    item.shortlisted
                      ? 'bg-[#22C55E]/20 text-[#166534]'
                      : 'bg-[#EFECFF] text-[#4F46E5] hover:bg-[#e2e0fc]'
                  }`}
                >
                  {item.shortlisted ? '✓ Shortlisted' : 'Shortlist'}
                </button>
                <button
                  onClick={() => openMessageModal(item.interestId)}
                  className="flex-1 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-bold shadow-md transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recruiter First Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFECFF]">
              <h3 className="text-base font-bold text-[#1A1A2E]">Initiate Candidate Conversation</h3>
              <button onClick={() => setShowMessageModal(false)} className="text-[#777587] text-lg font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-[#464555]">
              As recruiter, your first message will unlock the chat input for the candidate and change status to <strong>CONTACTED</strong>.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                required
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your first message to the candidate..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E8E5FF] text-xs font-bold text-[#777587]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="px-5 py-2 rounded-full bg-[#4F46E5] text-white text-xs font-bold shadow-md"
                >
                  {sendingMsg ? 'Sending...' : 'Send & Unlock Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
