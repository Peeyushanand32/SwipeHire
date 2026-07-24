'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [role, setRole] = useState<'SEEKER' | 'RECRUITER'>('SEEKER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  
  // Seeker specific fields
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');

  // Recruiter specific fields
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'RECRUITER' || roleParam === 'SEEKER') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const parsedSkills = skills ? skills.split(',').map((s) => s.trim()) : [];

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone,
          role,
          city,
          headline: role === 'SEEKER' ? headline : undefined,
          skills: role === 'SEEKER' ? parsedSkills : undefined,
          expectedSalary: role === 'SEEKER' ? expectedSalary : undefined,
          companyName: role === 'RECRUITER' ? companyName : undefined,
          gstNumber: role === 'RECRUITER' ? gstNumber : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'SEEKER') {
        router.push('/seeker/profile-setup');
      } else {
        router.push('/recruiter/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF]">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] flex items-center justify-center text-white font-bold text-xl shadow-md">
            S
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#3525CD] to-[#7C6CF0] bg-clip-text text-transparent">
            SwipeHire
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Join SwipeHire</h1>
        <p className="text-xs text-[#464555] mt-1">Select your account type to get started</p>
      </div>

      {/* Role Toggle */}
      <div className="flex bg-[#EFECFF] p-1.5 rounded-full mb-6">
        <button
          type="button"
          onClick={() => setRole('SEEKER')}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
            role === 'SEEKER' ? 'bg-[#4F46E5] text-white shadow-md' : 'text-[#464555] hover:text-[#1A1A2E]'
          }`}
        >
          Job Seeker
        </button>
        <button
          type="button"
          onClick={() => setRole('RECRUITER')}
          className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
            role === 'RECRUITER' ? 'bg-[#4F46E5] text-white shadow-md' : 'text-[#464555] hover:text-[#1A1A2E]'
          }`}
        >
          Recruiter / Company
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-[#FFDAD6] text-[#93000A] text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Bangalore"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
            />
          </div>
        </div>

        {role === 'SEEKER' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack React & Node Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                  Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Python"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                  Expected Salary (₹ / yr)
                </label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="1500000"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
                />
              </div>
            </div>
          </>
        )}

        {role === 'RECRUITER' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. TechCorp Innovations"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                GST Number (Optional)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="29ABCDE1234F1ZH"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] focus:outline-none text-sm"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 mt-6"
        >
          {loading ? 'Creating Account...' : `Register as ${role === 'SEEKER' ? 'Job Seeker' : 'Recruiter'}`}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#464555]">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#4F46E5] hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FCF8FF] flex items-center justify-center p-6 font-sans">
      <Suspense fallback={<div className="text-center text-xs font-bold text-[#777587]">Loading registration form...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
