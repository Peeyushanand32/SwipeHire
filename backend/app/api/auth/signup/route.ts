import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, role, phone, companyName, gstNumber, city, headline, skills, expectedSalary } = body;

    if (!email || !password || !fullName || !role) {
      return errorResponse('Email, password, fullName, and role are required', 400);
    }

    if (role !== 'SEEKER' && role !== 'RECRUITER') {
      return errorResponse('Role must be SEEKER or RECRUITER', 400);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(phone ? [{ phone }] : [])],
      },
    });

    if (existingUser) {
      return errorResponse('User with this email or phone already exists', 400);
    }

    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          phone: phone || null,
          passwordHash,
          role,
        },
      });

      if (role === 'SEEKER') {
        const parsedSkills = Array.isArray(skills) ? JSON.stringify(skills) : JSON.stringify([]);
        await tx.seekerProfile.create({
          data: {
            userId: user.id,
            fullName,
            headline: headline || null,
            skills: parsedSkills,
            expectedSalary: expectedSalary ? parseInt(expectedSalary, 10) : null,
            city: city || null,
          },
        });
      } else if (role === 'RECRUITER') {
        const company = await tx.company.create({
          data: {
            name: companyName || `${fullName}'s Company`,
            gstNumber: gstNumber || null,
            city: city || null,
            status: 'PENDING', // Rule: Companies start PENDING until Admin verifies
          },
        });

        await tx.recruiterProfile.create({
          data: {
            userId: user.id,
            companyId: company.id,
            fullName,
          },
        });
      }

      return user;
    });

    const token = signToken({
      userId: result.id,
      email: result.email,
      role: result.role as 'SEEKER' | 'RECRUITER' | 'ADMIN',
    });

    return NextResponse.json({
      message: 'Signup successful',
      token,
      user: {
        id: result.id,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
