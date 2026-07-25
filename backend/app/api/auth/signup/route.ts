import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword, signToken, errorResponse } from '@/lib/auth';

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

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = phone && String(phone).trim() ? String(phone).trim() : null;

    // Check if user with this email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
      include: {
        seekerProfile: true,
        recruiterProfile: { include: { company: true } },
      },
    });

    if (existingUser) {
      // Smart Auto-Login: If password matches existing account, log user in seamlessly!
      const isMatch = await comparePassword(password, existingUser.passwordHash);
      if (isMatch) {
        const token = signToken({
          userId: existingUser.id,
          email: existingUser.email,
          role: existingUser.role as 'SEEKER' | 'RECRUITER' | 'ADMIN',
        });

        return NextResponse.json({
          message: 'Account already registered. Successfully logged in!',
          token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            seekerProfile: existingUser.seekerProfile,
            recruiterProfile: existingUser.recruiterProfile,
          },
        });
      }

      return errorResponse(
        `An account with email "${cleanEmail}" is already registered. Please Sign In with your password.`,
        400
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: cleanEmail,
          phone: cleanPhone,
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
            expectedSalary: expectedSalary ? parseInt(String(expectedSalary), 10) : null,
            city: city || null,
          },
        });
      } else if (role === 'RECRUITER') {
        const company = await tx.company.create({
          data: {
            name: companyName || `${fullName}'s Company`,
            gstNumber: gstNumber || null,
            city: city || null,
            status: 'VERIFIED', // Auto-verify for seamless onboarding
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
