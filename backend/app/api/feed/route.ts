import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    // Auto-create SeekerProfile if missing for this user
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

    // Search query parameters
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city')?.trim();
    const minSalary = searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!, 10) : null;
    const skillsParam = searchParams.get('skills')?.trim(); // comma-separated e.g. "React,TypeScript"
    const includeSwiped = searchParams.get('includeSwiped') === 'true';

    // Fetch IDs of jobs already swiped by this seeker (unless includeSwiped is true)
    let swipedJobIds: string[] = [];
    if (!includeSwiped) {
      const swipedInterests = await prisma.interest.findMany({
        where: { seekerId },
        select: { jobId: true },
      });
      swipedJobIds = swipedInterests.map((i) => i.jobId);
    }

    // Rule: Show ALL active jobs posted by recruiters in latest-first order
    let jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        id: {
          notIn: swipedJobIds,
        },
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            status: true,
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Latest published jobs appear FIRST on seeker deck!
      },
    });

    // Fallback: If all jobs were swiped, return all active jobs so deck is never empty
    if (jobs.length === 0) {
      jobs = await prisma.job.findMany({
        where: {
          isActive: true,
        },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              status: true,
              city: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let filteredJobs = jobs;

    // Filter by City (Case-insensitive matching)
    if (city) {
      const targetCity = city.toLowerCase();
      filteredJobs = filteredJobs.filter((job) => {
        const jobCity = (job.city || job.company?.city || '').toLowerCase();
        return jobCity.includes(targetCity);
      });
    }

    // Filter by Min Salary
    if (minSalary !== null && !isNaN(minSalary)) {
      filteredJobs = filteredJobs.filter((job) => {
        const maxSal = job.salaryMax ?? job.salaryMin ?? 0;
        const minSal = job.salaryMin ?? job.salaryMax ?? 0;
        return maxSal >= minSalary || minSal >= minSalary;
      });
    }

    // Filter by Skill Overlap
    if (skillsParam) {
      const targetSkills = skillsParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      if (targetSkills.length > 0) {
        filteredJobs = filteredJobs.filter((job) => {
          try {
            const rawSkills = typeof job.skills === 'string' ? JSON.parse(job.skills || '[]') : job.skills;
            const jobSkills: string[] = Array.isArray(rawSkills) ? rawSkills.map((s: string) => String(s).toLowerCase()) : [];
            return jobSkills.some((skill) => targetSkills.some((ts) => skill.includes(ts) || ts.includes(skill)));
          } catch (e) {
            return true;
          }
        });
      }
    }

    // Parse JSON skills back to array with 100% safety
    const formattedJobs = filteredJobs.map((j) => {
      let parsedSkills: string[] = [];
      try {
        if (Array.isArray(j.skills)) {
          parsedSkills = j.skills;
        } else if (typeof j.skills === 'string') {
          parsedSkills = JSON.parse(j.skills || '[]');
        }
      } catch (e) {
        parsedSkills = [];
      }
      return {
        ...j,
        skills: parsedSkills,
      };
    });

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error: any) {
    console.error('Feed error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
