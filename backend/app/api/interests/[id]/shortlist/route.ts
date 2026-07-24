import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

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

    // Rule 3: Shortlist -> shortlisted = true, create SHORTLISTED notification for seeker without opening a chat
    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.interest.update({
        where: { id: interestId },
        data: {
          shortlisted: true,
          shortlistedAt: new Date(),
        },
      });

      await tx.notification.create({
        data: {
          userId: interest.seeker.userId,
          type: 'SHORTLISTED',
          body: `🎉 Great news! Aap ${interest.job.title} (${interest.job.company.name}) position ke liye Shortlist ho gaye hain! Kripya apne 'Short List' option me jaakar dekh lein.`,
        },
      });

      return res;
    });

    return NextResponse.json({
      success: true,
      message: 'Candidate shortlisted successfully and notification sent to seeker!',
      interest: updated,
    });
  } catch (error: any) {
    console.error('Shortlist error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
