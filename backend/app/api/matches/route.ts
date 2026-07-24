import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    // Auto-provision seekerProfile if missing
    let seekerProfile = user.seekerProfile;
    if (!seekerProfile) {
      seekerProfile = await prisma.seekerProfile.create({
        data: {
          userId: user.id,
          fullName: user.email.split('@')[0],
          headline: 'Job Seeker',
          skills: JSON.stringify(['React', 'TypeScript']),
        },
      });
    }

    const seekerId = seekerProfile.id;

    // Rule: Return ONLY interests where recruiter has SHORTLISTED the seeker or initiated contact
    const interests = await prisma.interest.findMany({
      where: {
        seekerId,
        OR: [
          { shortlisted: true },
          { status: 'CONTACTED' },
          { conversation: { isNot: null } },
        ],
      },
      include: {
        job: {
          include: {
            company: true,
            postedBy: true,
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const matches = interests.map((item) => ({
      id: item.id,
      status: item.status, // INTERESTED, CONTACTED, EXPIRED, WITHDRAWN
      shortlisted: item.shortlisted,
      respondByAt: item.respondByAt,
      expiresAt: item.expiresAt,
      job: {
        ...item.job,
        skills: typeof item.job.skills === 'string' ? JSON.parse(item.job.skills || '[]') : item.job.skills,
      },
      conversation: item.conversation,
      hasConversation: !!item.conversation,
      lastMessage: item.conversation?.messages[0] || null,
    }));

    return NextResponse.json({ matches });
  } catch (error: any) {
    console.error('Matches fetch error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
