import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'ADMIN') {
      return forbiddenResponse('Only Admins can access platform analytics');
    }

    const [
      totalUsers,
      totalSeekers,
      totalRecruiters,
      totalCompanies,
      pendingCompanies,
      verifiedCompanies,
      totalJobs,
      activeJobs,
      totalSwipes,
      totalConversations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SEEKER' } }),
      prisma.user.count({ where: { role: 'RECRUITER' } }),
      prisma.company.count(),
      prisma.company.count({ where: { status: 'PENDING' } }),
      prisma.company.count({ where: { status: 'VERIFIED' } }),
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.interest.count(),
      prisma.conversation.count(),
    ]);

    return NextResponse.json({
      analytics: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalCompanies,
        pendingCompanies,
        verifiedCompanies,
        totalJobs,
        activeJobs,
        totalSwipes,
        totalConversations,
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
