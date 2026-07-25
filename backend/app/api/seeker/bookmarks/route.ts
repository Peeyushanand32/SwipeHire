import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'SEEKER') {
      return forbiddenResponse('Only job seekers can view bookmarks');
    }

    const seekerProfile = await prisma.seekerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!seekerProfile) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { seekerId: seekerProfile.id },
      include: {
        job: {
          include: {
            company: { select: { id: true, name: true, city: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedJobs = bookmarks.map((b) => ({
      ...b.job,
      skills: JSON.parse(b.job.skills || '[]'),
      bookmarkedAt: b.createdAt,
    }));

    return NextResponse.json({ bookmarks: formattedJobs });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch bookmarks', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'SEEKER') {
      return forbiddenResponse('Only job seekers can bookmark jobs');
    }

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return errorResponse('jobId is required', 400);
    }

    let seekerProfile = await prisma.seekerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!seekerProfile) {
      seekerProfile = await prisma.seekerProfile.create({
        data: {
          userId: user.id,
          fullName: user.email.split('@')[0],
          skills: '[]',
        },
      });
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        seekerId_jobId: {
          seekerId: seekerProfile.id,
          jobId,
        },
      },
    });

    if (existing) {
      // Toggle off (remove bookmark)
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false, message: 'Removed from saved jobs' });
    } else {
      // Toggle on (add bookmark)
      await prisma.bookmark.create({
        data: {
          seekerId: seekerProfile.id,
          jobId,
        },
      });
      return NextResponse.json({ bookmarked: true, message: 'Job saved successfully' });
    }
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update bookmark', 500);
  }
}
