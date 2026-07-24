import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can access candidate queue');
    }

    const jobId = params.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.companyId !== user.recruiterProfile.companyId) {
      return errorResponse('Job not found or access denied', 404);
    }

    // Rule 5: Recruiter queue = interests with INTERESTED and passed = false, shortlisted-first then oldest.
    const interests = await prisma.interest.findMany({
      where: {
        jobId,
        status: 'INTERESTED',
        passed: false,
      },
      include: {
        seeker: {
          include: {
            user: {
              select: { email: true, phone: true },
            },
          },
        },
      },
      orderBy: [
        { shortlisted: 'desc' }, // Shortlisted first
        { createdAt: 'asc' },   // Oldest first
      ],
    });

    const queue = interests.map((item) => ({
      interestId: item.id,
      shortlisted: item.shortlisted,
      shortlistedAt: item.shortlistedAt,
      createdAt: item.createdAt,
      respondByAt: item.respondByAt,
      expiresAt: item.expiresAt,
      candidate: {
        id: item.seeker.id,
        userId: item.seeker.userId,
        fullName: item.seeker.fullName,
        headline: item.seeker.headline,
        skills: JSON.parse(item.seeker.skills || '[]'),
        expectedSalary: item.seeker.expectedSalary,
        city: item.seeker.city,
        resumeUrl: item.seeker.resumeUrl,
        avatarUrl: item.seeker.avatarUrl,
        email: item.seeker.user.email,
        phone: item.seeker.user.phone,
      },
    }));

    return NextResponse.json({ jobId, queue });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
