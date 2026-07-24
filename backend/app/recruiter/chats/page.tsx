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
    const interval = setInterval(fetchConversations, 4000); // Auto-poll every 4s for new seeker messages
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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A2E]">Conversations & Candidate Messaging</h1>
        <p className="text-sm text-[#464555]">Real-time chat inbox with candidates who are in touch</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#777587]">
          Loading active candidate conversations...
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 card-shadow border border-[#E8E5FF] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-3xl mx-auto">
            chat_bubble
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
                            {conv.lastMessage.senderRole === 'SEEKER' ? '👤 Seeker: ' : 'You: '}
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
              {/* Candidate Info Header */}
              <div className="p-4 border-b border-[#EFECFF] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                    {activeConv.seeker.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1A1A2E]">{activeConv.seeker.fullName}</h3>
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
                    <span className="material-symbols-outlined text-sm">description</span> Resume
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
    </div>
  );
}
