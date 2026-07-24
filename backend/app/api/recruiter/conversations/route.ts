import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER') {
      return forbiddenResponse('Only recruiters can access candidate conversations');
    }

    const companyId = user.recruiterProfile?.companyId;
    if (!companyId) {
      return NextResponse.json({ conversations: [] });
    }

    // Fetch all interests with conversations under recruiter's company jobs
    const interests = await prisma.interest.findMany({
      where: {
        job: { companyId },
        conversation: { isNot: null },
      },
      include: {
        seeker: {
          include: {
            user: {
              select: { email: true, phone: true },
            },
          },
        },
        job: {
          select: { id: true, title: true, city: true },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = interests.map((item: any) => ({
      interestId: item.id,
      status: item.status,
      seeker: {
        id: item.seeker.id,
        fullName: item.seeker.fullName,
        headline: item.seeker.headline,
        email: item.seeker.user?.email || '',
        phone: item.seeker.user?.phone || null,
        skills: typeof item.seeker.skills === 'string' ? JSON.parse(item.seeker.skills || '[]') : item.seeker.skills,
        resumeUrl: item.seeker.resumeUrl,
      },
      job: item.job,
      conversationId: item.conversation?.id,
      messages: item.conversation?.messages || [],
      lastMessage: item.conversation?.messages?.[item.conversation.messages.length - 1] || null,
    }));

    return NextResponse.json({ conversations: formatted });
  } catch (error: any) {
    console.error('Recruiter conversations error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
