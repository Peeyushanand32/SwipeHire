'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface CandidateConversation {
  interestId: string;
  status: string;
  seeker: {
    id: string;
    fullName: string;
    headline: string | null;
    email: string;
    phone: string | null;
    skills: string[];
    resumeUrl: string | null;
    avatarUrl?: string | null;
    city?: string | null;
    expectedSalary?: number | null;
    tenthSchool?: string | null;
    tenthBoard?: string | null;
    twelfthSchool?: string | null;
    twelfthBoard?: string | null;
    underGraduation?: string | null;
    postGraduation?: string | null;
    internships?: string | null;
    experiences?: string | null;
    liveProjectLink?: string | null;
    liveProjectDesc?: string | null;
  };
  job: {
    id: string;
    title: string;
    city: string | null;
  };
  conversationId: string;
  messages: Array<{
    id: string;
    senderId: string;
    senderRole: string;
    body: string;
    createdAt: string;
  }>;
  lastMessage: {
    id: string;
    body: string;
    createdAt: string;
    senderRole: string;
  } | null;
}

export default function RecruiterChatsPage() {
  const [conversations, setConversations] = useState<CandidateConversation[]>([]);
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateConversation['seeker'] | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/recruiter/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const convs: CandidateConversation[] = data.conversations || [];
        setConversations(convs);

        if (convs.length > 0 && !selectedInterestId) {
          setSelectedInterestId(convs[0].interestId);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedInterestId]);

  const activeConv = conversations.find((c) => c.interestId === selectedInterestId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv || sending) return;

    const bodyText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interestId: activeConv.interestId,
          body: bodyText,
        }),
      });

      if (res.ok) {
        await fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Conversations & Candidate Messaging</h1>
        <p className="text-sm text-[#464555]">Click on any candidate's name or photo header to view their full profile</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#777587]">
          Loading active candidate conversations...
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 card-shadow border border-[#E8E5FF] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-3xl mx-auto">
            💬
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A1A2E]">No Candidate Chats Yet</h2>
            <p className="text-xs text-[#464555] max-w-sm mx-auto mt-1">
              Go to Candidate Review and send a first message to shortlisted candidates to start chatting.
            </p>
          </div>
          <Link
            href="/recruiter/candidate-review"
            className="inline-block px-6 py-3 rounded-full bg-[#4F46E5] text-white text-xs font-bold shadow-md hover:bg-[#3525CD]"
          >
            Review Candidate Queue →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 h-[600px] bg-white rounded-3xl card-shadow border border-[#E8E5FF] overflow-hidden">
          {/* Left Column: Candidate List */}
          <div className="md:col-span-1 border-r border-[#EFECFF] flex flex-col h-full bg-[#FCF8FF]">
            <div className="p-4 border-b border-[#EFECFF]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#777587]">
                Active Chats ({conversations.length})
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#EFECFF]">
              {conversations.map((conv) => {
                const isSelected = conv.interestId === selectedInterestId;
                return (
                  <button
                    key={conv.interestId}
                    onClick={() => setSelectedInterestId(conv.interestId)}
                    className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-white border-l-4 border-[#4F46E5]' : 'hover:bg-white/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                      {conv.seeker.fullName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-[#1A1A2E] truncate">{conv.seeker.fullName}</h3>
                        <span className="text-[10px] text-[#777587]">
                          {conv.lastMessage
                            ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : ''}
                        </span>
                      </div>

                      <p className="text-[11px] font-bold text-[#4F46E5] truncate">{conv.job.title}</p>
                      <p className="text-[11px] text-[#464555] truncate mt-0.5">
                        {conv.lastMessage ? (
                          <span>
                            {conv.lastMessage.senderRole === 'SEEKER' ? '👤 Candidate: ' : 'You: '}
                            {conv.lastMessage.body}
                          </span>
                        ) : (
                          'No messages yet'
                        )}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat Window */}
          {activeConv ? (
            <div className="md:col-span-2 flex flex-col h-full bg-white">
              {/* Candidate Info Header - CLICKABLE FOR FULL PROFILE */}
              <div className="p-4 border-b border-[#EFECFF] flex items-center justify-between bg-white">
                <div
                  onClick={() => setSelectedCandidate(activeConv.seeker)}
                  className="flex items-center gap-3 cursor-pointer group"
                  title="Click to view candidate full profile"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-extrabold text-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    {activeConv.seeker.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1A1A2E] group-hover:text-[#4F46E5] transition-colors flex items-center gap-1.5">
                      {activeConv.seeker.fullName}
                      <span className="text-[10px] bg-[#EFECFF] text-[#4F46E5] px-2 py-0.5 rounded-full font-bold">
                        🔍 View Profile
                      </span>
                    </h3>
                    <p className="text-xs text-[#4F46E5] font-semibold">
                      Applied for {activeConv.job.title} • {activeConv.seeker.headline || 'Candidate'}
                    </p>
                  </div>
                </div>

                {activeConv.seeker.resumeUrl && (
                  <a
                    href={activeConv.seeker.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-[#4F46E5] bg-[#EFECFF] px-3 py-1.5 rounded-full hover:bg-[#4F46E5] hover:text-white transition-colors"
                  >
                    📄 Resume PDF ↗
                  </a>
                )}
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCF8FF]">
                {activeConv.messages.map((msg) => {
                  const isRecruiter = msg.senderRole === 'RECRUITER';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isRecruiter ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-[#777587] mb-1 font-semibold">
                        {isRecruiter ? 'You (Recruiter)' : activeConv.seeker.fullName}
                      </div>

                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                          isRecruiter
                            ? 'bg-[#4F46E5] text-white rounded-br-none'
                            : 'bg-white border border-[#E8E5FF] text-[#1A1A2E] rounded-bl-none'
                        }`}
                      >
                        {msg.body}
                      </div>

                      <span className="text-[9px] text-[#777587] mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#EFECFF] bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Reply to ${activeConv.seeker.fullName}...`}
                  className="flex-1 px-4 py-2.5 rounded-full border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || sending}
                  className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-bold shadow-md disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            <div className="md:col-span-2 flex items-center justify-center p-8 text-center text-xs text-[#777587]">
              Select a conversation from the list to view chat
            </div>
          )}
        </div>
      )}

      {/* FULL CANDIDATE PROFILE MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECFF]">
              <h2 className="text-lg font-extrabold text-[#1A1A2E]">Full Candidate Profile</h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-[#FCF8FF] border border-[#E8E5FF] space-y-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-black text-2xl flex items-center justify-center border-4 border-[#E8E5FF] shadow-md">
                {selectedCandidate.fullName.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-xl font-black text-[#1A1A2E]">{selectedCandidate.fullName}</h3>
              <p className="text-xs font-bold text-[#4F46E5]">{selectedCandidate.headline || 'Job Seeker'}</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
              <h4 className="text-xs font-black uppercase text-[#4F46E5] tracking-wider">📍 Contact & Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#334155]">
                <p>✉️ Email: <strong>{selectedCandidate.email}</strong></p>
                <p>📞 Phone: <strong>{selectedCandidate.phone || 'Not Provided'}</strong></p>
              </div>
            </div>

            {selectedCandidate.skills?.length > 0 && (
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-black uppercase text-[#4F46E5] tracking-wider">⚡ Skills & Expertise</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.skills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#22C55E]/30 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#166534]">Candidate Resume Document</h4>
                <p className="text-[11px] text-[#22C55E]">PDF / DOCX Resume File</p>
              </div>

              {selectedCandidate.resumeUrl ? (
                <a
                  href={selectedCandidate.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-[#22C55E] text-white text-xs font-extrabold shadow-sm hover:bg-[#16a34a]"
                >
                  Open Resume PDF ↗
                </a>
              ) : (
                <span className="text-xs text-[#94A3B8] italic">No Resume Uploaded</span>
              )}
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="w-full py-3 rounded-full bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#3525CD]"
            >
              Close Profile View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
