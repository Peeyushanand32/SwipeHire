import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    // Auto-create SeekerProfile if missing
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

    const body = await req.json();
    const { jobId, direction } = body; // direction: "right" | "left"

    if (!jobId || !direction) {
      return errorResponse('jobId and direction are required', 400);
    }

    const seekerId = seekerProfile.id;

    // Swipe left records nothing as per spec section 4 rule 1
    if (direction === 'left') {
      return NextResponse.json({ success: true, message: 'Swiped left' });
    }

    if (direction === 'right') {
      // Check if job exists
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        return errorResponse('Job not found', 404);
      }

      // Check for existing interest
      const existing = await prisma.interest.findUnique({
        where: {
          seekerId_jobId: {
            seekerId,
            jobId,
          },
        },
      });

      if (existing) {
        return NextResponse.json({ success: true, interest: existing });
      }

      const now = new Date();
      const respondByAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours
      const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days

      const interest = await prisma.interest.create({
        data: {
          seekerId,
          jobId,
          status: 'INTERESTED',
          respondByAt,
          expiresAt,
        },
      });

      return NextResponse.json({ success: true, interest });
    }

    return errorResponse('Invalid direction', 400);
  } catch (error: any) {
    console.error('Swipe error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
