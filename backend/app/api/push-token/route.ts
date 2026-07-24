import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { token, platform } = body;

    if (!token) {
      return errorResponse('Push token is required', 400);
    }

    const pushToken = await prisma.pushToken.upsert({
      where: { token },
      update: {
        userId: user.id,
        platform: platform || 'android',
      },
      create: {
        userId: user.id,
        token,
        platform: platform || 'android',
      },
    });

    return NextResponse.json({ success: true, pushToken });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
