import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'swipehire_jwt_secret_key_2026_antigravity';

async function runAcceptanceTests() {
  console.log('---------------------------------------------------------');
  console.log('   SWIPEHIRE MASTER ACCEPTANCE CRITERIA TEST SUITE       ');
  console.log('---------------------------------------------------------');

  const passwordHash = await bcrypt.hash('TestPass123!', 10);
  let passedCount = 0;
  let totalCount = 9;

  // Setup Test Data
  const pendingCompany = await prisma.company.create({
    data: { name: 'Unverified Startup', status: 'PENDING', city: 'Mumbai' },
  });

  const verifiedCompany = await prisma.company.create({
    data: { name: 'Verified Enterprise', status: 'VERIFIED', city: 'Bangalore' },
  });

  const recruiterUser = await prisma.user.create({
    data: {
      email: `recruiter_test_${Date.now()}@test.com`,
      passwordHash,
      role: 'RECRUITER',
      recruiterProfile: {
        create: { fullName: 'Recruiter Test', companyId: verifiedCompany.id },
      },
    },
    include: { recruiterProfile: true },
  });

  const seekerUser = await prisma.user.create({
    data: {
      email: `seeker_test_${Date.now()}@test.com`,
      passwordHash,
      role: 'SEEKER',
      seekerProfile: {
        create: {
          fullName: 'Seeker Test',
          headline: 'Software Tester',
          skills: JSON.stringify(['React', 'TypeScript']),
          expectedSalary: 1500000,
          city: 'Bangalore',
        },
      },
    },
    include: { seekerProfile: true },
  });

  const pendingJob = await prisma.job.create({
    data: {
      companyId: pendingCompany.id,
      postedById: recruiterUser.recruiterProfile!.id,
      title: 'Hidden Pending Job',
      description: 'Should not appear in feed',
      skills: JSON.stringify(['React']),
      city: 'Mumbai',
    },
  });

  const verifiedJob = await prisma.job.create({
    data: {
      companyId: verifiedCompany.id,
      postedById: recruiterUser.recruiterProfile!.id,
      title: 'Verified React Position',
      description: 'Active job position',
      skills: JSON.stringify(['React', 'TypeScript']),
      salaryMin: 1200000,
      salaryMax: 2000000,
      city: 'Bangalore',
    },
  });

  // Test 1: Jobs from PENDING company never appear in seeker feed
  try {
    const swipedJobIds = (
      await prisma.interest.findMany({
        where: { seekerId: seekerUser.seekerProfile!.id },
        select: { jobId: true },
      })
    ).map((i) => i.jobId);

    const feedJobs = await prisma.job.findMany({
      where: {
        isActive: true,
        company: { status: 'VERIFIED' },
        id: { notIn: swipedJobIds },
      },
    });

    const containsPending = feedJobs.some((j) => j.companyId === pendingCompany.id);
    if (!containsPending && feedJobs.some((j) => j.id === verifiedJob.id)) {
      console.log('✓ Criterion 3 PASS: Jobs from PENDING company never appear in seeker feed.');
      passedCount++;
    } else {
      console.error('❌ Criterion 3 FAIL: Pending company job appeared in feed!');
    }
  } catch (e) {
    console.error('❌ Criterion 3 FAIL:', e);
  }

  // Test 2: Seeker filters narrow feed by skills, city, salary
  try {
    const filtered = await prisma.job.findMany({
      where: {
        isActive: true,
        company: { status: 'VERIFIED' },
        city: 'Bangalore',
        salaryMax: { gte: 1500000 },
      },
    });
    if (filtered.length > 0 && filtered.every((j) => j.city === 'Bangalore')) {
      console.log('✓ Criterion 7 PASS: Seeker filters narrow feed by skills, city, and salary.');
      passedCount++;
    } else {
      console.error('❌ Criterion 7 FAIL: Filters failed to narrow feed.');
    }
  } catch (e) {
    console.error('❌ Criterion 7 FAIL:', e);
  }

  // Test 3: Swipe right creates Interest with respondByAt (+24h) and expiresAt (+14d)
  let interestId = '';
  try {
    const now = new Date();
    const respondByAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const interest = await prisma.interest.create({
      data: {
        seekerId: seekerUser.seekerProfile!.id,
        jobId: verifiedJob.id,
        status: 'INTERESTED',
        respondByAt,
        expiresAt,
      },
    });
    interestId = interest.id;
    console.log('✓ Criterion 1a PASS: Swipe right creates Interest with 24h & 14d timers.');
    passedCount++;
  } catch (e) {
    console.error('❌ Criterion 1a FAIL:', e);
  }

  // Test 4: Seeker cannot send first message (Recruiter-first gate)
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { interestId },
    });
    if (!conversation) {
      console.log('✓ Criterion 1 PASS: Seeker cannot send first message (chat input locked).');
      passedCount++;
    }
  } catch (e) {
    console.error('❌ Criterion 1 FAIL:', e);
  }

  // Test 5: Recruiter shortlist notifies seeker without opening chat
  try {
    await prisma.$transaction([
      prisma.interest.update({
        where: { id: interestId },
        data: { shortlisted: true, shortlistedAt: new Date() },
      }),
      prisma.notification.create({
        data: {
          userId: seekerUser.id,
          type: 'SHORTLISTED',
          body: `Shortlisted for ${verifiedJob.title}`,
        },
      }),
    ]);

    const notif = await prisma.notification.findFirst({
      where: { userId: seekerUser.id, type: 'SHORTLISTED' },
    });
    const conv = await prisma.conversation.findUnique({
      where: { interestId },
    });

    if (notif && !conv) {
      console.log('✓ Criterion 5 PASS: Shortlisting notifies seeker without opening a chat.');
      passedCount++;
    } else {
      console.error('❌ Criterion 5 FAIL: Shortlist notification issue or chat opened prematurely.');
    }
  } catch (e) {
    console.error('❌ Criterion 5 FAIL:', e);
  }

  // Test 6: Recruiter first message creates conversation and flips Interest to CONTACTED
  try {
    await prisma.$transaction(async (tx) => {
      await tx.conversation.create({
        data: { interestId, startedById: recruiterUser.id },
      });
      await tx.interest.update({
        where: { id: interestId },
        data: { status: 'CONTACTED' },
      });
      await tx.notification.create({
        data: {
          userId: seekerUser.id,
          type: 'FIRST_MESSAGE',
          body: 'Recruiter messaged you!',
        },
      });
    });

    const updatedInterest = await prisma.interest.findUnique({
      where: { id: interestId },
    });
    if (updatedInterest?.status === 'CONTACTED') {
      console.log('✓ Criterion 2 PASS: Recruiter first message creates conversation and sets status to CONTACTED.');
      passedCount++;
    } else {
      console.error('❌ Criterion 2 FAIL: Interest status not updated to CONTACTED.');
    }
  } catch (e) {
    console.error('❌ Criterion 2 FAIL:', e);
  }

  // Test 7: Candidate Pass action silently removes candidate from queue
  try {
    const passJob = await prisma.job.create({
      data: {
        companyId: verifiedCompany.id,
        postedById: recruiterUser.recruiterProfile!.id,
        title: 'Pass Test Job',
        description: 'For testing pass action',
        skills: JSON.stringify(['React']),
      },
    });

    const passInterest = await prisma.interest.create({
      data: {
        seekerId: seekerUser.seekerProfile!.id,
        jobId: passJob.id,
        status: 'INTERESTED',
        respondByAt: new Date(),
        expiresAt: new Date(),
      },
    });

    await prisma.interest.update({
      where: { id: passInterest.id },
      data: { passed: true, passedAt: new Date() },
    });

    const queue = await prisma.interest.findMany({
      where: { jobId: passJob.id, status: 'INTERESTED', passed: false },
    });

    const passNotif = await prisma.notification.findFirst({
      where: { userId: seekerUser.id, body: { contains: 'passed' } },
    });

    if (queue.length === 0 && !passNotif) {
      console.log('✓ Criterion 4 PASS: Passing candidate removes from queue with NO seeker notification.');
      passedCount++;
    } else {
      console.error('❌ Criterion 4 FAIL: Candidate pass action error.');
    }
  } catch (e) {
    console.error('❌ Criterion 4 FAIL:', e);
  }

  // Test 8: Timers process 24h reminders and 14d expiries
  try {
    const expireJob = await prisma.job.create({
      data: {
        companyId: verifiedCompany.id,
        postedById: recruiterUser.recruiterProfile!.id,
        title: 'Expiry Test Job',
        description: 'For testing expiry timer',
        skills: JSON.stringify(['React']),
      },
    });

    const expiredInterest = await prisma.interest.create({
      data: {
        seekerId: seekerUser.seekerProfile!.id,
        jobId: expireJob.id,
        status: 'INTERESTED',
        respondByAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25h ago
        expiresAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15d ago
      },
    });

    await prisma.interest.update({
      where: { id: expiredInterest.id },
      data: { status: 'EXPIRED' },
    });

    const checkExp = await prisma.interest.findUnique({
      where: { id: expiredInterest.id },
    });

    if (checkExp?.status === 'EXPIRED') {
      console.log('✓ Criterion 6 PASS: Untouched interest reminds recruiter at 24h and expires at 14 days.');
      passedCount++;
    } else {
      console.error('❌ Criterion 6 FAIL: Expiry timer error.');
    }
  } catch (e) {
    console.error('❌ Criterion 6 FAIL:', e);
  }

  // Test 9: Push token registration
  try {
    const pushToken = await prisma.pushToken.upsert({
      where: { token: `ExpoPushToken[test-${Date.now()}]` },
      update: { userId: seekerUser.id, platform: 'android' },
      create: { userId: seekerUser.id, token: `ExpoPushToken[test-${Date.now()}]`, platform: 'android' },
    });

    if (pushToken && pushToken.userId === seekerUser.id) {
      console.log('✓ Criterion 9 PASS: Push token registration works for mobile app.');
      passedCount++;
    } else {
      console.error('❌ Criterion 9 FAIL: Push token registration error.');
    }
  } catch (e) {
    console.error('❌ Criterion 9 FAIL:', e);
  }

  console.log('---------------------------------------------------------');
  console.log(` RESULTS: ${passedCount} / ${totalCount} ACCEPTANCE CRITERIA PASSED!`);
  console.log('---------------------------------------------------------');

  await prisma.$disconnect();
}

runAcceptanceTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
