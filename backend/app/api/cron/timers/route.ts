import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const now = new Date();

    // 1. INTERESTED + not reminded + respondByAt < now -> Recruiter reminder
    const needsReminder = await prisma.interest.findMany({
      where: {
        status: 'INTERESTED',
        reminded: false,
        respondByAt: { lt: now },
      },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
        seeker: true,
      },
    });

    let remindersSent = 0;
    for (const item of needsReminder) {
      await prisma.$transaction([
        prisma.interest.update({
          where: { id: item.id },
          data: { reminded: true },
        }),
        prisma.notification.create({
          data: {
            userId: item.job.postedBy.userId,
            type: 'RECRUITER_REMINDER',
            body: `Reminder: Candidate ${item.seeker.fullName} is waiting for your response on ${item.job.title}`,
          },
        }),
      ]);
      remindersSent++;
    }

    // 2. INTERESTED + expiresAt < now -> EXPIRED + seeker notice
    const expiredInterests = await prisma.interest.findMany({
      where: {
        status: 'INTERESTED',
        expiresAt: { lt: now },
      },
      include: {
        job: true,
        seeker: true,
      },
    });

    let expiredCount = 0;
    for (const item of expiredInterests) {
      await prisma.$transaction([
        prisma.interest.update({
          where: { id: item.id },
          data: { status: 'EXPIRED' },
        }),
        prisma.notification.create({
          data: {
            userId: item.seeker.userId,
            type: 'INTEREST_EXPIRED',
            body: `Your interest in ${item.job.title} has expired after 14 days without a recruiter response.`,
          },
        }),
      ]);
      expiredCount++;
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      expiredCount,
      timestamp: now.toISOString(),
    });
  } catch (error: any) {
    console.error('Cron timers error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
