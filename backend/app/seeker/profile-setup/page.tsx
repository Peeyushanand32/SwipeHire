'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeekerProfileSetupPage() {
  const router = useRouter();

  // Basic Profile Info
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [city, setCity] = useState('');

  // Academic Education
  const [tenthSchool, setTenthSchool] = useState('');
  const [tenthBoard, setTenthBoard] = useState('');
  const [twelfthSchool, setTwelfthSchool] = useState('');
  const [twelfthBoard, setTwelfthBoard] = useState('');
  const [underGraduation, setUnderGraduation] = useState('');
  const [postGraduation, setPostGraduation] = useState('');

  // Work & Internships
  const [internships, setInternships] = useState('');
  const [experiences, setExperiences] = useState('');

  // Live Project Portfolio
  const [liveProjectLink, setLiveProjectLink] = useState('');
  const [liveProjectDesc, setLiveProjectDesc] = useState('');

  // Avatar Photo State
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Resume File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

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
            setSkills(Array.isArray(p.skills) ? p.skills.join(', ') : p.skills || '');
            setExpectedSalary(p.expectedSalary ? String(p.expectedSalary) : '');
            setCity(p.city || '');
            setResumeUrl(p.resumeUrl || '');
            setAvatarUrl(p.avatarUrl || '');

            setTenthSchool(p.tenthSchool || '');
            setTenthBoard(p.tenthBoard || '');
            setTwelfthSchool(p.twelfthSchool || '');
            setTwelfthBoard(p.twelfthBoard || '');
            setUnderGraduation(p.underGraduation || '');
            setPostGraduation(p.postGraduation || '');

            setInternships(p.internships || '');
            setExperiences(p.experiences || '');
            setLiveProjectLink(p.liveProjectLink || '');
            setLiveProjectDesc(p.liveProjectDesc || '');
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
          tenthSchool: tenthSchool.trim(),
          tenthBoard: tenthBoard.trim(),
          twelfthSchool: twelfthSchool.trim(),
          twelfthBoard: twelfthBoard.trim(),
          underGraduation: underGraduation.trim(),
          postGraduation: postGraduation.trim(),
          internships: internships.trim(),
          experiences: experiences.trim(),
          liveProjectLink: liveProjectLink.trim(),
          liveProjectDesc: liveProjectDesc.trim(),
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
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 card-shadow border border-[#E8E5FF] space-y-6">
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
          <h1 className="text-2xl font-extrabold text-[#1A1A2E]">Comprehensive Seeker Profile Setup</h1>
          <p className="text-xs font-semibold text-[#64748B] mt-1">
            Complete your academic qualifications, work experience & live project portfolio
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-[#FFDAD6] text-[#93000A] text-xs font-extrabold flex items-center gap-2 border border-[#FFDAD6]">
            <span className="material-symbols-outlined text-base">warning</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitProfile} className="space-y-6">
          {/* Avatar Photo Upload Picker */}
          <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-[#EFECFF]">
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
                title="Choose photo"
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
                : '📷 Upload Mandatory Profile Photo *'}
            </label>
          </div>

          {/* Resume Upload Box */}
          <div className={`p-4 rounded-2xl border-2 border-dashed text-center space-y-2 ${
            resumeUrl ? 'bg-[#F0FDF4] border-[#22C55E]' : 'bg-[#FCF8FF] border-[#C3C0FF]'
          }`}>
            <div className="w-10 h-10 rounded-full bg-[#EFECFF] text-[#4F46E5] flex items-center justify-center text-xl mx-auto">
              📄
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
              {uploadingResume
                ? 'Uploading File...'
                : selectedFile
                ? `Uploaded: ${selectedFile.name}`
                : resumeUrl
                ? 'Change Resume File'
                : 'Choose Resume File *'}
            </label>
          </div>

          {/* Section 1: Personal & Skills */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black uppercase text-[#4F46E5] tracking-wider">👤 Personal Details</h3>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Professional Headline *</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer | React & Node.js"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Key Skills (Comma Separated) *</label>
              <input
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, TypeScript, Node.js, Prisma, Tailwind"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Expected Salary (₹ / yr)</label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="1800000"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">City / Location *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru / Remote"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Qualifications */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black uppercase text-[#4F46E5] tracking-wider">🎓 Academic Qualifications</h3>

            {/* Class 10th */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#334155] mb-1">10th School Name</label>
                <input
                  type="text"
                  value={tenthSchool}
                  onChange={(e) => setTenthSchool(e.target.value)}
                  placeholder="St. Xavier's High School"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">10th Board</label>
                <input
                  type="text"
                  value={tenthBoard}
                  onChange={(e) => setTenthBoard(e.target.value)}
                  placeholder="CBSE / ICSE"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
                />
              </div>
            </div>

            {/* Class 12th */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#334155] mb-1">12th School Name</label>
                <input
                  type="text"
                  value={twelfthSchool}
                  onChange={(e) => setTwelfthSchool(e.target.value)}
                  placeholder="DPS International School"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">12th Board</label>
                <input
                  type="text"
                  value={twelfthBoard}
                  onChange={(e) => setTwelfthBoard(e.target.value)}
                  placeholder="CBSE / State"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Under Graduation (Degree & College)</label>
              <input
                type="text"
                value={underGraduation}
                onChange={(e) => setUnderGraduation(e.target.value)}
                placeholder="B.Tech Computer Science - RV College of Engineering (2020-2024)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Post Graduation (Degree & College)</label>
              <input
                type="text"
                value={postGraduation}
                onChange={(e) => setPostGraduation(e.target.value)}
                placeholder="M.Tech AI/Data Science - IIIT Bangalore (2024-2026)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>
          </div>

          {/* Section 3: Internships & Work Experience */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black uppercase text-[#4F46E5] tracking-wider">💼 Work Experience & Internships</h3>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Internship Details</label>
              <textarea
                rows={3}
                value={internships}
                onChange={(e) => setInternships(e.target.value)}
                placeholder="Frontend Intern at TechCorp (6 Months) - Worked on Next.js UI component library..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Work Experience</label>
              <textarea
                rows={3}
                value={experiences}
                onChange={(e) => setExperiences(e.target.value)}
                placeholder="Software Engineer at InnovateX (2 Years) - Built REST APIs & React Native App..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>
          </div>

          {/* Section 4: Live Project & Portfolio */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-4">
            <h3 className="text-xs font-black uppercase text-[#4F46E5] tracking-wider">🚀 Live Projects & Portfolio</h3>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Live Project Link (URL)</label>
              <input
                type="url"
                value={liveProjectLink}
                onChange={(e) => setLiveProjectLink(e.target.value)}
                placeholder="https://my-live-project.vercel.app"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1">Project Description & Highlights</label>
              <textarea
                rows={3}
                value={liveProjectDesc}
                onChange={(e) => setLiveProjectDesc(e.target.value)}
                placeholder="Full-stack real-time matching web app built with Next.js, Prisma, WebSockets..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#4F46E5] outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploadingResume || uploadingAvatar}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C6CF0] hover:shadow-lg text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50 mt-4"
          >
            {saving ? 'Saving Complete Profile...' : 'Save Profile & Access Deck →'}
          </button>
        </form>
      </div>
    </div>
  );
}
