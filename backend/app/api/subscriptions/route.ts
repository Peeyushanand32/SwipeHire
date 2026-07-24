import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can view subscription details');
    }

    const companyId = user.recruiterProfile.companyId;

    let subscription = await prisma.subscription.findUnique({
      where: { companyId },
    });

    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          companyId,
          plan: 'FREE',
          active: true,
        },
      });
    }

    return NextResponse.json({ subscription });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'RECRUITER' || !user.recruiterProfile) {
      return forbiddenResponse('Only recruiters can upgrade subscriptions');
    }

    const body = await req.json();
    const { plan } = body; // "FREE" | "PRO" | "ENTERPRISE"

    if (!plan || !['FREE', 'PRO', 'ENTERPRISE'].includes(plan)) {
      return errorResponse('Invalid subscription plan', 400);
    }

    const companyId = user.recruiterProfile.companyId;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month plan duration

    const subscription = await prisma.subscription.upsert({
      where: { companyId },
      update: {
        plan,
        active: true,
        expiresAt,
      },
      create: {
        companyId,
        plan,
        active: true,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
