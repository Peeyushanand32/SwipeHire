import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER') {
      return forbiddenResponse('Only recruiters can update jobs');
    }

    const { id } = params;
    const body = await req.json();
    const { isActive, title, description, city, salaryMin, salaryMax, skills } = body;

    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!existingJob) {
      return errorResponse('Job not found', 404);
    }

    // Ensure job belongs to recruiter's company
    const recruiterCompanyId = user.recruiterProfile?.companyId;
    if (existingJob.companyId !== recruiterCompanyId) {
      return forbiddenResponse('You can only update jobs posted by your company');
    }

    const updateData: any = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (title) updateData.title = String(title).trim();
    if (description) updateData.description = String(description).trim();
    if (city !== undefined) updateData.city = city ? String(city).trim() : null;
    if (salaryMin !== undefined) updateData.salaryMin = salaryMin ? parseInt(String(salaryMin)) : null;
    if (salaryMax !== undefined) updateData.salaryMax = salaryMax ? parseInt(String(salaryMax)) : null;
    if (skills) updateData.skills = JSON.stringify(skills);

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      job: {
        ...updatedJob,
        skills: JSON.parse(updatedJob.skills || '[]'),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update job', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER') {
      return forbiddenResponse('Only recruiters can delete jobs');
    }

    const { id } = params;
    const existingJob = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        interests: {
          include: { seeker: true },
        },
      },
    });

    if (!existingJob) {
      return errorResponse('Job not found', 404);
    }

    const recruiterCompanyId = user.recruiterProfile?.companyId;
    if (existingJob.companyId !== recruiterCompanyId) {
      return forbiddenResponse('You can only delete jobs posted by your company');
    }

    const jobTitle = existingJob.title;
    const companyName = existingJob.company?.name || 'Company';

    // Notify all seekers who applied or were shortlisted before deleting job
    await prisma.$transaction(async (tx) => {
      for (const interest of existingJob.interests) {
        if (interest.seeker?.userId) {
          await tx.notification.create({
            data: {
              userId: interest.seeker.userId,
              type: 'JOB_DELETED',
              body: `ℹ️ Job Update: The job opening "${jobTitle}" at ${companyName} (where you applied / were shortlisted) has been closed & deleted by the recruiter.`,
            },
          });
        }
      }

      await tx.job.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully and notification alerts sent to all applicants.',
    });
  } catch (error: any) {
    console.error('Delete job error:', error);
    return errorResponse(error.message || 'Failed to delete job', 500);
  }
}
