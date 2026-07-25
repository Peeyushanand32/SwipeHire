import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER') {
      return forbiddenResponse('Only recruiters can access candidate applications');
    }

    const recruiterCompanyId = user.recruiterProfile?.companyId;
    if (!recruiterCompanyId) {
      return NextResponse.json({ interests: [] });
    }

    const interests = await prisma.interest.findMany({
      where: {
        job: { companyId: recruiterCompanyId },
        passed: false,
      },
      include: {
        seeker: {
          include: {
            user: { select: { id: true, email: true, phone: true } },
          },
        },
        job: { select: { id: true, title: true, city: true } },
        conversation: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = interests.map((interest) => {
      let skillsArray: string[] = [];
      try {
        skillsArray = JSON.parse(interest.seeker.skills || '[]');
      } catch (e) {
        skillsArray = [];
      }

      return {
        id: interest.id,
        status: interest.status,
        shortlisted: interest.shortlisted,
        createdAt: interest.createdAt,
        job: interest.job,
        seeker: {
          ...interest.seeker,
          skills: skillsArray,
          email: interest.seeker.user.email,
          phone: interest.seeker.user.phone,
        },
        hasConversation: !!interest.conversation,
      };
    });

    return NextResponse.json({ interests: formatted });
  } catch (error: any) {
    console.error('Recruiter candidates error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
