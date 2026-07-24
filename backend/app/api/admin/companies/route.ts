import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'ADMIN') {
      return forbiddenResponse('Only Admins can access company management');
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // PENDING | VERIFIED | REJECTED | SUSPENDED

    const companies = await prisma.company.findMany({
      where: status ? { status } : {},
      include: {
        recruiters: {
          include: {
            user: { select: { email: true, phone: true } },
          },
        },
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ companies });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
