import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'SEEKER' || !user.seekerProfile) {
      return forbiddenResponse('Only Job Seekers can upload a profile photo');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No image file uploaded', 400);
    }

    // Validate image MIME type
    if (!file.type.startsWith('image/')) {
      return errorResponse('File must be an image (PNG, JPG, JPEG, WEBP)', 400);
    }

    // Convert file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create destination directory
    const fileExtension = path.extname(file.name) || '.jpg';
    const filename = `avatar_${user.id}_${Date.now()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');

    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update SeekerProfile in DB
    const updatedProfile = await prisma.seekerProfile.update({
      where: { userId: user.id },
      data: { avatarUrl },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      avatarUrl,
      fileName: file.name,
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return errorResponse(error.message || 'Failed to process profile photo upload', 500);
  }
}
