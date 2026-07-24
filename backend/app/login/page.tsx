'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Route by user role
      if (data.user.role === 'SEEKER') {
        router.push('/seeker/feed');
      } else if (data.user.role === 'RECRUITER') {
        router.push('/recruiter/dashboard');
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FF] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#3525CD] to-[#7C6CF0] bg-clip-text text-transparent">
              SwipeHire
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Welcome Back</h1>
          <p className="text-sm text-[#464555] mt-1">Log in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FFDAD6] text-[#93000A] text-xs font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. seeker@example.com"
              className="w-full px-4 py-3 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#464555]">
          Don't have an account?{' '}
          <Link href="/signup" className="font-bold text-[#4F46E5] hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-[#EFECFF] text-center text-xs text-[#777587]">
          <p>Demo Accounts:</p>
          <p className="mt-1 font-mono text-[11px] text-[#4F46E5]">
            seeker@example.com / recruiter@techcorp.com / admin@swipehire.com
          </p>
          <p className="text-[10px] text-[#777587] mt-0.5">(Password: Password123!)</p>
        </div>
      </div>
    </div>
  );
}
