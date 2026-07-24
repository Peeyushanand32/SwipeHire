import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { interestId: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    const { interestId } = params;

    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        seeker: { include: { user: true } },
        job: { include: { company: true, postedBy: { include: { user: true } } } },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!interest) {
      return errorResponse('Interest record not found', 404);
    }

    // Rule: Seeker input stays locked until recruiter sends first message (Interest is CONTACTED or conversation exists)
    let canReply = true;
    if (user.role === 'SEEKER') {
      canReply = interest.status === 'CONTACTED' || !!interest.conversation;
    }

    return NextResponse.json({
      interestId: interest.id,
      status: interest.status,
      canReply,
      job: {
        id: interest.job.id,
        title: interest.job.title,
        companyName: interest.job.company.name,
      },
      conversation: interest.conversation || null,
      messages: interest.conversation?.messages || [],
    });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
