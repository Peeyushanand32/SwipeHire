import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can access company profile');
    }

    const company = await prisma.company.findUnique({
      where: { id: user.recruiterProfile.companyId },
      include: {
        recruiters: true,
        _count: {
          select: { jobs: true },
        },
      },
    });

    if (!company) {
      return errorResponse('Company not found', 404);
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can update company profile');
    }

    const body = await req.json();
    const { name, gstNumber, city } = body;

    const company = await prisma.company.update({
      where: { id: user.recruiterProfile.companyId },
      data: {
        ...(name ? { name } : {}),
        ...(gstNumber !== undefined ? { gstNumber } : {}),
        ...(city !== undefined ? { city } : {}),
      },
    });

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
