import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can reject candidate applications');
    }

    const interestId = params.id;

    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        seeker: true,
        job: { include: { company: true } },
      },
    });

    if (!interest) {
      return errorResponse('Interest record not found', 404);
    }

    if (interest.job.companyId !== user.recruiterProfile.companyId) {
      return forbiddenResponse('Access denied');
    }

    // Mark application as rejected and send notification alert to Seeker
    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.interest.update({
        where: { id: interestId },
        data: {
          passed: true,
          passedAt: new Date(),
          status: 'REJECTED',
        },
      });

      await tx.notification.create({
        data: {
          userId: interest.seeker.userId,
          type: 'REJECTED',
          body: `❌ Application Update: Aapki application "${interest.job.title}" (${interest.job.company.name}) position ke liye reject kar di gayi hai.`,
        },
      });

      return res;
    });

    return NextResponse.json({
      success: true,
      message: 'Application rejected and notification sent to seeker.',
      interest: updated,
    });
  } catch (error: any) {
    console.error('Reject candidate error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
