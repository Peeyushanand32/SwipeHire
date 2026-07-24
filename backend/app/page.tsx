import Link from 'next/link';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#FCF8FF] text-[#1A1A2E] flex flex-col font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 glass-panel px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C6CF0] flex items-center justify-center text-white font-bold text-xl shadow-md">
            S
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#3525CD] to-[#7C6CF0] bg-clip-text text-transparent">
            SwipeHire
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#464555]">
          <a href="#features" className="hover:text-[#4F46E5] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#4F46E5] transition-colors">How it works</a>
          <a href="#employers" className="hover:text-[#4F46E5] transition-colors">For Recruiter / Company</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#4F46E5] hover:bg-[#EFECFF] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#4F46E5] to-[#7C6CF0] hover:shadow-lg transition-all transform active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-bold uppercase tracking-wider mb-6">
          <span className="material-symbols-outlined text-sm">bolt</span> Next-Gen Recruitment Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl text-[#1A1A2E]">
          Swipe Right on Your Next <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C6CF0] to-[#FF6B5C] bg-clip-text text-transparent">Dream Career</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[#464555] max-w-2xl font-medium">
          Ditch lengthy resumes and stale job portals. SwipeHire connects verified recruiters with top talent through effortless swipe matching and gated instant messaging.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link
            href="/signup?role=SEEKER"
            className="flex-1 py-4 px-6 rounded-full bg-[#FF6B5C] hover:bg-[#e05a4d] text-white font-bold text-base shadow-lg shadow-[#FF6B5C]/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined">person_search</span> Find a Job
          </Link>
          <Link
            href="/signup?role=RECRUITER"
            className="flex-1 py-4 px-6 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] text-white font-bold text-base shadow-lg shadow-[#4F46E5]/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined">business_center</span> Hire Candidates
          </Link>
        </div>

        {/* Feature Deck Mockup */}
        <div className="mt-16 relative w-full max-w-md bg-white rounded-3xl p-6 card-shadow border border-[#E8E5FF] text-left">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFECFF]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFECFF] flex items-center justify-center text-[#4F46E5] font-bold text-lg">
                TC
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E] text-base">Senior Frontend Engineer</h3>
                <p className="text-xs text-[#464555]">TechCorp Innovations • Bangalore</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold">
              VERIFIED
            </span>
          </div>

          <div className="py-4 space-y-3">
            <p className="text-xs text-[#464555] line-clamp-2">
              Join TechCorp to build high-performance React web applications using modern web technologies.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold">
                React
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold">
                TypeScript
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#EFECFF] text-[#4F46E5] text-xs font-semibold">
                Next.js
              </span>
            </div>
            <div className="text-sm font-bold text-[#1A1A2E] pt-2">
              ₹15,00,000 - ₹25,00,000 / year
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-6">
            <div className="w-14 h-14 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold text-2xl shadow-inner cursor-pointer hover:scale-110 transition-transform">
              ✕
            </div>
            <div className="w-16 h-16 rounded-full bg-[#FF6B5C] text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-[#FF6B5C]/40 cursor-pointer hover:scale-110 transition-transform">
              ♥
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="features" className="py-20 px-6 bg-white border-t border-[#EFECFF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-[#1A1A2E]">Why Job Seekers & Employers Choose SwipeHire</h2>
            <p className="mt-3 text-[#464555] text-base">Designed for high fluidity, verified safety, and instant candidate-recruiter alignment.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FCF8FF] border border-[#E8E5FF]">
              <div className="w-12 h-12 rounded-2xl bg-[#4F46E5] text-white flex items-center justify-center text-2xl mb-6">
                swipe
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Native Swipe Deck</h3>
              <p className="text-sm text-[#464555] leading-relaxed">
                Discover curated jobs matching your skill tags and expected salary with low-friction right swipes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FCF8FF] border border-[#E8E5FF]">
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B5C] text-white flex items-center justify-center text-2xl mb-6">
                verified_user
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">100% Verified Companies</h3>
              <p className="text-sm text-[#464555] leading-relaxed">
                No spam or fake job listings. Every company undergoes strict admin KYC verification before jobs go live.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FCF8FF] border border-[#E8E5FF]">
              <div className="w-12 h-12 rounded-2xl bg-[#7C6CF0] text-white flex items-center justify-center text-2xl mb-6">
                lock
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Recruiter-First Chat</h3>
              <p className="text-sm text-[#464555] leading-relaxed">
                Keep your inbox clean. Recruiters initiate conversations first when interested, opening direct 1-on-1 chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 bg-[#1A1A2E] text-white text-center text-sm">
        <p>© 2026 SwipeHire Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
