import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, errorResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        seekerProfile: user.seekerProfile
          ? {
              ...user.seekerProfile,
              skills: JSON.parse(user.seekerProfile.skills || '[]'),
            }
          : null,
        recruiterProfile: user.recruiterProfile || null,
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { fullName, headline, skills, expectedSalary, city, resumeUrl, phone } = body;

    if (user.role === 'SEEKER') {
      const parsedSkills = Array.isArray(skills) ? JSON.stringify(skills) : skills ? JSON.stringify([skills]) : undefined;

      const updatedProfile = await prisma.seekerProfile.update({
        where: { userId: user.id },
        data: {
          ...(fullName ? { fullName } : {}),
          ...(headline !== undefined ? { headline } : {}),
          ...(parsedSkills !== undefined ? { skills: parsedSkills } : {}),
          ...(expectedSalary !== undefined ? { expectedSalary: parseInt(expectedSalary, 10) } : {}),
          ...(city !== undefined ? { city } : {}),
          ...(resumeUrl !== undefined ? { resumeUrl } : {}),
        },
      });

      if (phone) {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone },
        });
      }

      return NextResponse.json({
        success: true,
        profile: {
          ...updatedProfile,
          skills: JSON.parse(updatedProfile.skills || '[]'),
        },
      });
    }

    if (user.role === 'RECRUITER') {
      const updatedProfile = await prisma.recruiterProfile.update({
        where: { userId: user.id },
        data: {
          ...(fullName ? { fullName } : {}),
        },
      });

      return NextResponse.json({ success: true, profile: updatedProfile });
    }

    return errorResponse('Invalid role for profile update', 400);
  } catch (error: any) {
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
