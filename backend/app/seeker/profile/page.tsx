'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeekerProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [city, setCity] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');

  // Resume & Avatar File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (data.user) {
          setPhone(data.user.phone || '');
          if (data.user.seekerProfile) {
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
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingAvatar(true);
    setMessage('');

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
      if (res.ok) {
        setAvatarUrl(data.avatarUrl);
        setMessage('Profile photo uploaded and saved!');
      } else {
        setMessage(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error(err);
      setMessage('Profile photo upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadingResume(true);
    setMessage('');

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
      if (res.ok) {
        setResumeUrl(data.resumeUrl);
        setMessage('Resume file uploaded and saved to your profile!');
      } else {
        setMessage(data.error || 'Failed to upload resume');
      }
    } catch (err) {
      console.error(err);
      setMessage('Resume upload failed');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const parsedSkills = skills ? skills.split(',').map((s) => s.trim()) : [];

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          headline,
          skills: parsedSkills,
          expectedSalary: expectedSalary ? parseInt(expectedSalary, 10) : null,
          city,
          resumeUrl,
          avatarUrl,
          phone,
        }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-[#1A1A2E]">Profile Settings</h1>
        <p className="text-xs text-[#464555]">Manage your profile photo, bio, skills, and resume upload</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-[#777587]">
          Loading profile details...
        </div>
      ) : (
        <form onSubmit={handleSave} className="w-full bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] space-y-4">
          {message && (
            <div className="p-3 rounded-xl bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold text-center">
              {message}
            </div>
          )}

          {/* Profile Photo Avatar Section */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FCF8FF] border border-[#E8E5FF] space-y-2">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#4F46E5] shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] text-white font-black text-2xl flex items-center justify-center border-4 border-[#E8E5FF] shadow-md">
                  {fullName ? fullName.charAt(0).toUpperCase() : '👤'}
                </div>
              )}

              <input
                type="file"
                id="profile-avatar-input"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />

              <label
                htmlFor="profile-avatar-input"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs shadow-md cursor-pointer hover:bg-[#3525CD]"
                title="Change photo"
              >
                📷
              </label>
            </div>

            <label
              htmlFor="profile-avatar-input"
              className="text-xs font-bold text-[#4F46E5] cursor-pointer hover:underline"
            >
              {uploadingAvatar ? 'Uploading Photo...' : avatarUrl ? 'Change Photo from Computer' : '+ Upload Profile Photo'}
            </label>
          </div>

          {/* Local Resume Upload Section */}
          <div className="p-4 rounded-2xl bg-[#FCF8FF] border border-[#C3C0FF] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[#1A1A2E]">Resume File</h3>
                <p className="text-[11px] text-[#464555]">
                  {resumeUrl ? `Current: ${resumeUrl}` : 'No resume uploaded yet'}
                </p>
              </div>

              <input
                type="file"
                id="profile-resume-input"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleResumeFileUpload}
                className="hidden"
              />

              <label
                htmlFor="profile-resume-input"
                className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                {uploadingResume ? 'Uploading...' : 'Upload Resume File'}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
              Key Skills (Comma Separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                Expected Salary (₹ / yr)
              </label>
              <input
                type="number"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="1800000"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#464555] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bangalore"
                className="w-full px-4 py-2.5 rounded-xl border border-[#C7C4D8] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
