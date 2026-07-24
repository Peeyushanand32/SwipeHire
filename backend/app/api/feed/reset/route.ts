import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'SEEKER' || !user.seekerProfile) {
      return forbiddenResponse('Only Job Seekers can reset swiped cards');
    }

    const seekerId = user.seekerProfile.id;

    // Delete existing interests for this seeker so all jobs appear in feed afresh
    await prisma.interest.deleteMany({
      where: { seekerId },
    });

    return NextResponse.json({
      success: true,
      message: 'Swiped job cards reset successfully. All jobs are now visible!',
    });
  } catch (error: any) {
    console.error('Reset feed error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
