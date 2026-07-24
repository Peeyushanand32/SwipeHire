import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'ADMIN') {
      return forbiddenResponse('Only Admins can suspend companies');
    }

    const companyId = params.id;

    const company = await prisma.company.update({
      where: { id: companyId },
      data: { status: 'SUSPENDED' },
    });

    return NextResponse.json({ success: true, company });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
