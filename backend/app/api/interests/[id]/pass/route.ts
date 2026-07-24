import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can pass candidates');
    }

    const interestId = params.id;

    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: { job: true },
    });

    if (!interest) {
      return errorResponse('Interest record not found', 404);
    }

    if (interest.job.companyId !== user.recruiterProfile.companyId) {
      return forbiddenResponse('Access denied');
    }

    // Rule 4: Pass -> passed = true; removed from queue; no seeker notification.
    const updated = await prisma.interest.update({
      where: { id: interestId },
      data: {
        passed: true,
        passedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, interest: updated });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
