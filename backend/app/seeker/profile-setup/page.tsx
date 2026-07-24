'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeekerProfileSetupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [city, setCity] = useState('');

  // Avatar Photo State
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Resume File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user?.seekerProfile) {
            const p = data.user.seekerProfile;
            setFullName(p.fullName || '');
            setHeadline(p.headline || '');
            setSkills(Array.isArray(p.skills) ? p.skills.join(', ') : '');
            setExpectedSalary(p.expectedSalary ? String(p.expectedSalary) : '');
            setCity(p.city || '');
            setResumeUrl(p.resumeUrl || '');
            setAvatarUrl(p.avatarUrl || '');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchExistingProfile();
  }, [router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingAvatar(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo');

      setAvatarUrl(data.avatarUrl);
    } catch (err: any) {
      setError(err.message || 'Avatar photo upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadingResume(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload resume');

      setResumeUrl(data.resumeUrl);
      setResumeUploadSuccess(true);
    } catch (err: any) {
      console.error('Resume upload failed:', err);
      setError(err.message || 'Resume upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mandatory Onboarding Verification Rules
    if (!avatarUrl) {
      setError('⚠️ MANDATORY: Profile photo is required! Please upload a photo from your computer.');
      return;
    }

    if (!resumeUrl) {
      setError('⚠️ MANDATORY: Resume file is required! Please upload your PDF/DOCX file from your computer.');
      return;
    }

    if (!fullName.trim() || !headline.trim() || !skills.trim()) {
      setError('⚠️ MANDATORY: Full Name, Professional Headline, and Skills are required.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const parsedSkills = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [];

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          headline: headline.trim(),
          skills: parsedSkills,
          expectedSalary: expectedSalary ? parseInt(expectedSalary, 10) : null,
          city: city.trim() || null,
          resumeUrl,
          avatarUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      router.push('/seeker/feed');
    } catch (err: any) {
      setError(err.message || 'Error saving profile setup');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FF] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF] space-y-6">
        {/* Header */}
        <div className="text-center border-b border-[#EFECFF] pb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#3525CD] to-[#7C6CF0] bg-clip-text text-transparent">
              SwipeHire
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Step 1: Mandatory Profile Onboarding</h1>
          <p className="text-xs font-semibold text-[#FF6B5C] mt-1">
            * Profile Photo and Resume file are mandatory before accessing the platform deck
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#FFDAD6] text-[#93000A] text-xs font-extrabold flex items-center gap-2 border border-[#FFDAD6]">
            <span className="material-symbols-outlined text-base">warning</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitProfile} className="space-y-5">
          {/* Avatar Photo Upload Picker (Mandatory) */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-2 border-b border-[#EFECFF]">
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#4F46E5] shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-black text-3xl flex items-center justify-center border-4 border-[#E8E5FF] shadow-md">
                  {fullName ? fullName.charAt(0).toUpperCase() : '📷'}
                </div>
              )}

              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-sm shadow-md cursor-pointer hover:bg-[#3525CD] transition-transform active:scale-95"
                title="Choose photo from computer"
              >
                📷
              </label>
            </div>

            <label
              htmlFor="avatar-upload"
              className="text-xs font-extrabold text-[#4F46E5] cursor-pointer hover:underline"
            >
              {uploadingAvatar
                ? 'Uploading Photo...'
                : avatarUrl
                ? '✓ Photo Uploaded (Click to Change)'
                : '📷 Upload Mandatory Profile Photo from Computer *'}
            </label>
          </div>

          {/* Section 2: Resume File Upload (Mandatory) */}
          <div className={`p-4 rounded-2xl border-2 border-dashed text-center space-y-2 ${
            resumeUrl ? 'bg-[#F0FDF4] border-[#22C55E]' : 'bg-[#FCF8FF] border-[#C3C0FF]'
          }`}>
            <div className="w-10 h-10 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-xl mx-auto">
              upload_file
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1A1A2E]">
                {resumeUrl ? '✓ Resume Uploaded & Validated' : 'Upload Mandatory Resume File *'}
              </h3>
              <p className="text-[11px] text-[#464555]">PDF, DOCX, or TXT file from computer</p>
            </div>

            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="resume-upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">folder_open</span>
              {uploadingResume
                ? 'Uploading File...'
                : selectedFile
                ? `Uploaded: ${selectedFile.name}`
                : resumeUrl
                ? 'Change Resume File'
                : 'Choose Mandatory Resume File from Computer *'}
            </label>
          </div>

          {/* Section 3: Bio & Profile Details */}
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
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Professional Headline *
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full Stack React & Node Developer"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] outline-none text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Key Skills (Comma Separated) *
            </label>
            <input
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Node.js, Next.js"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                Expected Salary (₹ / yr)
              </label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="1800000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                City / Preferred Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bangalore"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] focus:border-[#4F46E5] outline-none text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploadingResume || uploadingAvatar}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C6CF0] hover:shadow-lg text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50 mt-4"
          >
            {saving ? 'Completing Onboarding...' : 'Complete Onboarding & Access App →'}
          </button>
        </form>
      </div>
    </div>
  );
}
