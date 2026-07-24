'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: string; // REJECTED | SHORTLISTED | FIRST_MESSAGE | EXPIRED | SYSTEM
  body: string;
  read: boolean;
  createdAt: string;
}

export default function SeekerNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'REJECTED' | 'SHORTLISTED'>('ALL');

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [router]);

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'REJECTED') {
      return n.type === 'REJECTED' || n.type === 'EXPIRED' || n.body.toLowerCase().includes('reject') || n.body.toLowerCase().includes('not selected');
    }
    if (activeTab === 'SHORTLISTED') {
      return n.type === 'SHORTLISTED' || n.body.toLowerCase().includes('shortlisted');
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#1A1A2E]">Notification Inbox</h1>
          <p className="text-xs text-[#464555]">Application updates, shortlist alerts, and rejection notices</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-bold hover:bg-[#4F46E5] hover:text-white transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EFECFF] pb-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'ALL'
              ? 'bg-[#4F46E5] text-white shadow-sm'
              : 'bg-white text-[#777587] hover:bg-[#EFECFF] border border-[#E8E5FF]'
          }`}
        >
          All Updates ({notifications.length})
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'REJECTED'
              ? 'bg-[#BA1A1A] text-white shadow-sm'
              : 'bg-white text-[#BA1A1A] hover:bg-[#FFDAD6]/30 border border-[#FFDAD6]'
          }`}
        >
          🚫 Rejections / Not Selected
        </button>

        <button
          onClick={() => setActiveTab('SHORTLISTED')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'SHORTLISTED'
              ? 'bg-[#22C55E] text-white shadow-sm'
              : 'bg-white text-[#15803D] hover:bg-[#22C55E]/10 border border-[#22C55E]/30'
          }`}
        >
          🎉 Shortlists
        </button>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="py-16 text-center text-xs font-bold text-[#777587]">
          Loading notification alerts...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="w-full bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-2xl mx-auto">
            notifications_off
          </div>
          <h2 className="text-base font-bold text-[#1A1A2E]">
            {activeTab === 'REJECTED' ? 'No Rejection Notices' : 'No Notifications Yet'}
          </h2>
          <p className="text-xs text-[#464555] max-w-xs mx-auto">
            {activeTab === 'REJECTED'
              ? 'Great news! You have no rejection notices for your applications.'
              : 'New application updates will appear here when companies review your swiped cards.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => {
            const isRejection = item.type === 'REJECTED' || item.type === 'EXPIRED' || item.body.toLowerCase().includes('reject') || item.body.toLowerCase().includes('not selected');
            const isShortlist = item.type === 'SHORTLISTED' || item.body.toLowerCase().includes('shortlisted');

            return (
              <div
                key={item.id}
                className={`w-full bg-white rounded-2xl p-4 card-shadow border transition-all flex items-start gap-3 ${
                  !item.read ? 'border-l-4 border-l-[#4F46E5]' : ''
                } ${
                  isRejection
                    ? 'border-[#FFDAD6] bg-[#FFF8F7]'
                    : isShortlist
                    ? 'border-[#22C55E]/30 bg-[#F0FDF4]'
                    : 'border-[#E8E5FF]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                    isRejection
                      ? 'bg-[#FFDAD6] text-[#93000A]'
                      : isShortlist
                      ? 'bg-[#22C55E]/20 text-[#15803D]'
                      : 'bg-[#EFECFF] text-[#4F46E5]'
                  }`}
                >
                  {isRejection ? '❌' : isShortlist ? '🎉' : '💬'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                        isRejection
                          ? 'bg-[#FFDAD6] text-[#93000A]'
                          : isShortlist
                          ? 'bg-[#22C55E]/20 text-[#15803D]'
                          : 'bg-[#EFECFF] text-[#4F46E5]'
                      }`}
                    >
                      {isRejection ? 'Rejection Update' : isShortlist ? 'Shortlisted' : 'Message Alert'}
                    </span>
                    <span className="text-[10px] text-[#777587] font-semibold">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#1A1A2E] font-medium leading-relaxed mt-2">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
