'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: string;
  senderId: string;
  senderRole: string;
  body: string;
  createdAt: string;
}

export default function SeekerChatPage() {
  const params = useParams();
  const router = useRouter();
  const interestId = params.interestId as string;

  const [loading, setLoading] = useState(true);
  const [canReply, setCanReply] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputBody, setInputBody] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/conversations/${interestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      const data = await res.json();
      setCanReply(data.canReply);
      setJobTitle(data.job?.title || 'Job Match');
      setCompanyName(data.job?.companyName || 'Company');
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching chat:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatDetails();
    const interval = setInterval(fetchChatDetails, 5000); // Poll every 5s for new messages
    return () => clearInterval(interval);
  }, [interestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBody.trim() || !canReply) return;

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
          interestId,
          body: inputBody,
        }),
      });

      if (res.ok) {
        setInputBody('');
        fetchChatDetails();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-3xl card-shadow border border-[#E8E5FF] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#FCF8FF] border-b border-[#EFECFF] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/seeker/matches" className="text-[#777587] hover:text-[#1A1A2E] text-lg font-bold">
            ←
          </Link>
          <div>
            <h2 className="text-sm font-extrabold text-[#1A1A2E] leading-tight">{jobTitle}</h2>
            <p className="text-[11px] text-[#464555] font-medium">{companyName}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-[10px] font-extrabold">
          {canReply ? 'Active Chat' : 'Input Locked'}
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCF8FF]">
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-[#777587]">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#777587]">
            No messages yet. Waiting for recruiter to initiate chat.
          </div>
        ) : (
          messages.map((msg) => {
            const isSeeker = msg.senderRole === 'SEEKER';
            return (
              <div
                key={msg.id}
                className={`flex ${isSeeker ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium ${
                    isSeeker
                      ? 'bg-[#4F46E5] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-[#1A1A2E] rounded-bl-none border border-[#E8E5FF] shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed">{msg.body}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      isSeeker ? 'text-white/70' : 'text-[#777587]'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Lock Box */}
      <div className="p-3 bg-white border-t border-[#EFECFF]">
        {!canReply ? (
          <div className="p-3 rounded-2xl bg-[#EFECFF] border border-[#C3C0FF] text-[#3525CD] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-base">lock</span>
            <div>
              <p className="font-bold">Input Locked</p>
              <p className="text-[10px] text-[#464555]">
                The recruiter must send the first message to unlock chat replies.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputBody}
              onChange={(e) => setInputBody(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 rounded-full border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
            <button
              type="submit"
              disabled={sending || !inputBody.trim()}
              className="w-10 h-10 rounded-full bg-[#4F46E5] text-white flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-[#3525CD] transition-colors"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
