# Antigravity master build spec — SwipeHire (website + Android app)

> Give this ONE file to Google Antigravity's agent. It defines the whole platform:
> a shared backend, a web app (marketing site + all three panels), and an Android app
> (Expo) with the same three panels. Replace `[SwipeHire]` with the final app name.

---

## 0. What to build

1. **Backend (shared)** — one API + database that powers every client.
2. **Web app (Next.js)** — public marketing site + Job Seeker panel + Recruiter/Company panel +
   Admin/Master panel.
3. **Android app (Expo / React Native)** — the same panels for mobile:
   - Job Seeker (primary — native swipe + push notifications)
   - Recruiter/Company (post jobs, review candidates, chat)
   - Admin/Master (recommended web-only; if built on mobile, keep it read-only dashboards).

All clients talk to the **same backend over authenticated REST**. Build the backend once; never
duplicate it.

**One schema, both platforms, at the same time.** There is a single database schema (section 3) — it
is NOT split per platform. Build the shared backend first, then build the web app and the Android app
**in parallel** as two front-end tracks that consume the same API. See the milestones in section 8.

**Frontend UI source (already designed in Google Stitch):**
- Web screens → `stitch-website-frontend.md` (desktop web: marketing + all 3 panels).
- Android screens → `stitch-android-app-3panels.md` (mobile: seeker + recruiter + admin).

Use those Stitch designs as the UI for each client; this spec defines the backend, data, rules, and
wiring that make them work. Build web and Android **together** on the one backend below.

## 1. Architecture
- One PostgreSQL database. One Next.js backend exposing REST API routes.
- Auth = JWT bearer tokens. Every request carries the token; the server derives the user + role
  (`SEEKER | RECRUITER | ADMIN`) and scopes data accordingly.
- Web app and Android app are both thin clients of that API. Role decides which panel a logged-in
  user sees on each client.

## 2. Tech stack
- **Backend**: Next.js (App Router) API routes + Prisma + PostgreSQL.
- **Auth**: JWT; roles SEEKER/RECRUITER/ADMIN; Google sign-in optional.
- **Web**: Next.js + React + TypeScript + Tailwind CSS.
- **Android**: Expo (React Native + TypeScript), Expo Router, NativeWind (same palette), TanStack Query,
  `expo-secure-store` (token), `expo-notifications` (push).
- **Realtime chat/notifications**: Supabase Realtime or Socket.io.
- **Scheduled jobs**: Vercel Cron (interest timers).
- **File storage**: Supabase Storage or S3 (resumes, logos).
- **Palette** (both clients): primary indigo #4F46E5, violet #7C6CF0, coral #FF6B5C, bg #F7F7FB,
  text #1A1A2E, success #22C55E, warning #F59E0B. Font Inter.

## 3. Data model (Prisma)
```prisma
enum UserRole { SEEKER RECRUITER ADMIN }
enum CompanyStatus { PENDING VERIFIED REJECTED SUSPENDED }
enum InterestStatus { INTERESTED CONTACTED EXPIRED WITHDRAWN }

model User {
  id String @id @default(cuid())
  email String @unique
  phone String? @unique
  passwordHash String
  role UserRole
  createdAt DateTime @default(now())
  seekerProfile SeekerProfile?
  recruiterProfile RecruiterProfile?
  notifications Notification[]
  messages Message[]
  pushTokens PushToken[]
}

model SeekerProfile {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName String
  headline String?
  skills String[]
  expectedSalary Int?
  city String?
  resumeUrl String?
  interests Interest[]
}

model Company {
  id String @id @default(cuid())
  name String
  status CompanyStatus @default(PENDING)
  gstNumber String?
  city String?
  createdAt DateTime @default(now())
  recruiters RecruiterProfile[]
  jobs Job[]
}

model RecruiterProfile {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyId String
  company Company @relation(fields: [companyId], references: [id])
  fullName String
  postedJobs Job[]
}

model Job {
  id String @id @default(cuid())
  companyId String
  company Company @relation(fields: [companyId], references: [id])
  postedById String
  postedBy RecruiterProfile @relation(fields: [postedById], references: [id])
  title String
  description String
  skills String[]
  salaryMin Int?
  salaryMax Int?
  city String?
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  interests Interest[]
}

model Interest {
  id String @id @default(cuid())
  seekerId String
  seeker SeekerProfile @relation(fields: [seekerId], references: [id], onDelete: Cascade)
  jobId String
  job Job @relation(fields: [jobId], references: [id], onDelete: Cascade)
  status InterestStatus @default(INTERESTED)
  shortlisted Boolean @default(false)
  shortlistedAt DateTime?
  passed Boolean @default(false)
  passedAt DateTime?
  respondByAt DateTime   // createdAt + 24h  (recruiter urgency)
  reminded Boolean @default(false)
  expiresAt DateTime     // createdAt + 14 days (hard expiry)
  createdAt DateTime @default(now())
  conversation Conversation?
  @@unique([seekerId, jobId])
  @@index([jobId, status])
}

model Conversation {
  id String @id @default(cuid())
  interestId String @unique
  interest Interest @relation(fields: [interestId], references: [id], onDelete: Cascade)
  startedById String   // always the recruiter's User id
  createdAt DateTime @default(now())
  messages Message[]
}

model Message {
  id String @id @default(cuid())
  conversationId String
  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderId String
  sender User @relation(fields: [senderId], references: [id])
  senderRole UserRole
  body String
  createdAt DateTime @default(now())
  @@index([conversationId, createdAt])
}

model Notification {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  type String   // PROFILE_VIEWED | SHORTLISTED | FIRST_MESSAGE | RECRUITER_REMINDER | INTEREST_EXPIRED
  body String
  read Boolean @default(false)
  createdAt DateTime @default(now())
  @@index([userId, read])
}

model PushToken {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  token String @unique   // Expo push token
  platform String        // "android" | "ios"
  createdAt DateTime @default(now())
}
```

## 4. Core business rules (implement exactly, on the backend)
1. **Swipe right** → `Interest` (`INTERESTED`), `respondByAt = now+24h`, `expiresAt = now+14d`.
   `@@unique([seekerId, jobId])` blocks re-swiping. Swipe left records nothing.
2. **Recruiter-first message.** First message on an Interest (no `Conversation` yet) is allowed ONLY if
   sender role is `RECRUITER`; it creates the `Conversation`, flips Interest to `CONTACTED`, notifies the
   seeker (`FIRST_MESSAGE`). After that both sides may message. Seeker input stays locked until `CONTACTED`.
3. **Shortlist** → `shortlisted = true`, notify seeker (`SHORTLISTED`); no chat opened.
4. **Pass** → `passed = true`; removed from queue; no seeker notification.
5. **Recruiter queue** = interests with `INTERESTED` and `passed = false`, shortlisted-first then oldest.
6. **Seeker feed** = jobs where `isActive` AND `company.status = VERIFIED` AND no existing Interest;
   optional filters skills (overlap) / city (equals) / minSalary (`salaryMax >= value`); newest first.
7. **Timers (hourly cron)**: `INTERESTED` + not reminded + `respondByAt < now` → recruiter reminder;
   `INTERESTED` + `expiresAt < now` → `EXPIRED` + seeker notice.
8. **Company KYC**: companies start `PENDING`; their jobs are hidden from feeds until an admin sets
   `VERIFIED`; admin may `REJECT` / `SUSPEND`.

## 5. REST API (all clients use these)
**Auth**: `POST /api/auth/signup` (role seeker or recruiter), `POST /api/auth/login`,
`POST /api/auth/google`, `POST /api/push-token`.

**Seeker**: `GET /api/feed?skills&city&minSalary`, `POST /api/swipe {jobId,direction}`,
`GET /api/matches`, `GET /api/conversations/:interestId` (returns `canReply`),
`POST /api/messages {interestId,body}`, `GET /api/notifications`, `PATCH /api/profile`,
`POST /api/resume`.

**Recruiter**: `POST /api/jobs`, `PATCH /api/jobs/:id`, `GET /api/jobs` (own),
`GET /api/jobs/:id/queue`, `POST /api/interests/:id/shortlist`, `POST /api/interests/:id/pass`,
`POST /api/messages {interestId,body}` (first-message gate lives here), `GET /api/company`,
`PATCH /api/company`.

**Admin**: `GET /api/admin/companies?status`, `POST /api/admin/companies/:id/verify`,
`POST /api/admin/companies/:id/reject`, `POST /api/admin/companies/:id/suspend`,
`GET /api/admin/users`, `GET /api/admin/analytics`.

Every route validates the JWT, checks role, and enforces ownership.

## 6. Screens

### Web (Next.js, responsive)
- **Marketing**: landing, for-companies, pricing, sign-up (role select), log in.
- **Seeker**: swipe feed, filters, matches/chats, chat (input locked until recruiter messages),
  notifications, profile + resume upload.
- **Recruiter** (left sidebar): dashboard + verification banner + stats, post-a-job (live preview),
  candidate review (Interested / Shortlisted tabs; Pass / Shortlist / Message), chats, company profile.
- **Admin** (left sidebar): KPI dashboard + charts, pending company verifications (Approve / Reject),
  users, jobs, payments, reports.

### Android (Expo)
- **Seeker**: native swipe feed, filters sheet, matches/chats, chat with locked input, notifications,
  profile. Bottom tabs: Discover · Matches · Chats · Notifications · Profile. Push enabled.
- **Recruiter**: dashboard, post a job, candidate review (Pass / Shortlist / Message), chats. Push enabled.
- **Admin**: recommended web-only; optional read-only KPI dashboard on mobile.

One login screen per client; after login, route by `role` to the correct panel.

## 7. Push notifications (Android)
On login, register the Expo push token via `/api/push-token`. Backend sends a push when it creates
`SHORTLISTED`, `FIRST_MESSAGE`, `RECRUITER_REMINDER`, or `INTEREST_EXPIRED` notifications. Tapping a
push deep-links to the right screen.

## 8. Build milestones (backend first, then web + app in parallel)

**Phase 0 — Shared backend (do this first, both platforms depend on it):**
schema + migrations, JWT auth + roles, ALL REST routes (auth/seeker/recruiter/admin), cron timers,
storage, realtime. Nothing else can be finished until this is in place.

**Then run two tracks in parallel — same API, same schema:**

*Web track (Next.js)*
- W1. Auth + company onboarding + admin verification (KYC gate).
- W2. Recruiter: post job + candidate queue + shortlist/pass.
- W3. Seeker: profile + feed + filters + swipe.
- W4. Recruiter-first messaging + realtime chat.
- W5. Admin analytics + marketing site.

*App track (Expo / Android)*
- A1. App shell: splash, onboarding, auth, push permission.
- A2. Seeker: profile + feed + filters + swipe + chat lock.
- A3. Recruiter: dashboard + post job + candidate review + chat.
- A4. Expo push notifications wired to backend notifications.

**Phase 2 (both tracks done):** payments / subscriptions for recruiters, polish, store submission (app)
and production deploy (web).

## 9. Acceptance criteria (must pass on every client)
- A seeker can never send the first message; API rejects it, UI shows a locked input.
- A recruiter's first message creates the conversation and flips the Interest to `CONTACTED`.
- Jobs from a `PENDING` company never appear in any seeker feed (web or app).
- Passing a candidate removes them from the queue with no seeker notification.
- Shortlisting notifies the seeker without opening a chat.
- An untouched interest reminds the recruiter at 24h and expires at 14 days.
- Seeker filters narrow the feed by skills, city, and salary.
- Web and Android read/write the same data through the same API — no duplicated backend.
- Android receives a push when the seeker is shortlisted or messaged.
```
