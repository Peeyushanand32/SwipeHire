# SwipeHire Backend API (Phase 0)

This is the shared Next.js App Router REST API and Prisma database backend powering both the SwipeHire Web application and Android Expo application.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database ORM**: Prisma ORM
- **Database Engine**: SQLite (default local development) / PostgreSQL
- **Authentication**: JWT Bearer Tokens + bcryptjs password hashing

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Migration & Seed
```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```
The server will run at `http://localhost:3000`.

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup`: Registers a new SEEKER or RECRUITER. (Recruiter creates PENDING Company).
- `POST /api/auth/login`: Returns JWT Token + User details.
- `POST /api/push-token`: Registers Expo push notifications token.

### Job Seeker (`SEEKER`)
- `GET /api/feed?skills&city&minSalary`: Fetch job feed (only `VERIFIED` companies, excluding swiped jobs).
- `POST /api/swipe`: `{ jobId, direction }` (`right` sets `respondByAt = +24h`, `expiresAt = +14d`).
- `GET /api/matches`: Lists matches, active interests, and conversation states.
- `GET /api/conversations/:interestId`: View conversation detail & `canReply` lock status.
- `GET /api/profile` / `PATCH /api/profile`: Get and update seeker profile.
- `GET /api/notifications` / `PATCH /api/notifications`: Notifications list & mark read.

### Recruiter (`RECRUITER`)
- `POST /api/jobs` / `GET /api/jobs`: Post a job and list company jobs.
- `GET /api/jobs/:id/queue`: Candidate review queue (`shortlisted` first, then oldest).
- `POST /api/interests/:id/shortlist`: Shortlist candidate (notifies seeker).
- `POST /api/interests/:id/pass`: Pass candidate (silent).
- `POST /api/messages`: `{ interestId, body }`. **First message MUST be sent by Recruiter** to open conversation (`CONTACTED`).
- `GET /api/company` / `PATCH /api/company`: Manage company profile.

### Admin (`ADMIN`)
- `GET /api/admin/companies?status`: List pending, verified, rejected, or suspended companies.
- `POST /api/admin/companies/:id/verify`: Approve company KYC.
- `POST /api/admin/companies/:id/reject`: Reject company KYC.
- `POST /api/admin/companies/:id/suspend`: Suspend company access.
- `GET /api/admin/users`: List all platform users.
- `GET /api/admin/analytics`: Platform KPIs and metrics.

### Cron Timers
- `GET /api/cron/timers`: Trigger hourly check for 24h recruiter reminders & 14d interest hard expiries.
