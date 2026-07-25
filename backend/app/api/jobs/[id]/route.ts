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
    });

    if (!existingJob) {
      return errorResponse('Job not found', 404);
    }

    const recruiterCompanyId = user.recruiterProfile?.companyId;
    if (existingJob.companyId !== recruiterCompanyId) {
      return forbiddenResponse('You can only delete jobs posted by your company');
    }

    await prisma.job.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to delete job', 500);
  }
}
