import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

const MAX_SAFE_INT = 2000000000; // Cap at 2 Billion to prevent SQL 32-bit INT overflow

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER') {
      return forbiddenResponse('Only recruiters can access posted jobs');
    }

    // Auto-create RecruiterProfile and Company if missing
    let companyId = user.recruiterProfile?.companyId;

    if (!companyId) {
      const company = await prisma.company.create({
        data: {
          name: `${user.email.split('@')[0]}'s Company`,
          status: 'VERIFIED',
        },
      });
      const newProfile = await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          companyId: company.id,
          fullName: user.email.split('@')[0],
        },
      });
      companyId = newProfile.companyId;
    }

    const jobs = await prisma.job.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { interests: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = jobs.map((job) => ({
      ...job,
      skills: JSON.parse(job.skills || '[]'),
      applicantCount: job._count.interests,
    }));

    return NextResponse.json({ jobs: formatted });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    // If user is not RECRUITER role, update user role to RECRUITER so they can post jobs
    if (user.role !== 'RECRUITER') {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'RECRUITER' },
      });
    }

    // Auto-create RecruiterProfile and Company if missing
    let recruiterProfileId = user.recruiterProfile?.id;
    let companyId = user.recruiterProfile?.companyId;

    if (!recruiterProfileId || !companyId) {
      const company = await prisma.company.create({
        data: {
          name: `${user.email.split('@')[0]}'s Company`,
          status: 'VERIFIED',
        },
      });
      const newProfile = await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          companyId: company.id,
          fullName: user.email.split('@')[0],
        },
      });
      recruiterProfileId = newProfile.id;
      companyId = newProfile.companyId;
    }

    const body = await req.json();
    const { title, description, skills, salaryMin, salaryMax, city } = body;

    if (!title || !description) {
      return errorResponse('Title and description are required', 400);
    }

    // Auto-verify company so recruiter's newly published job appears in seeker feed instantly
    await prisma.company.update({
      where: { id: companyId },
      data: { status: 'VERIFIED' },
    });

    const parsedSkills = Array.isArray(skills) ? JSON.stringify(skills) : JSON.stringify([]);

    // Safely cap salary integers to prevent 32-bit INT database overflow
    let cleanMinSalary: number | null = salaryMin ? parseInt(String(salaryMin).replace(/,/g, ''), 10) : null;
    let cleanMaxSalary: number | null = salaryMax ? parseInt(String(salaryMax).replace(/,/g, ''), 10) : null;

    if (cleanMinSalary !== null && !isNaN(cleanMinSalary)) {
      cleanMinSalary = Math.min(Math.max(cleanMinSalary, 0), MAX_SAFE_INT);
    } else {
      cleanMinSalary = null;
    }

    if (cleanMaxSalary !== null && !isNaN(cleanMaxSalary)) {
      cleanMaxSalary = Math.min(Math.max(cleanMaxSalary, 0), MAX_SAFE_INT);
    } else {
      cleanMaxSalary = null;
    }

    const job = await prisma.job.create({
      data: {
        companyId: companyId,
        postedById: recruiterProfileId,
        title: String(title).trim(),
        description: String(description).trim(),
        skills: parsedSkills,
        salaryMin: cleanMinSalary,
        salaryMax: cleanMaxSalary,
        city: city ? String(city).trim() : null,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        skills: JSON.parse(job.skills || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Post job API error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
