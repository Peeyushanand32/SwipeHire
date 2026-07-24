import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, unauthorizedResponse, forbiddenResponse, errorResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();

    const body = await req.json();
    const { interestId, body: messageBody } = body;

    if (!interestId || !messageBody || typeof messageBody !== 'string' || !messageBody.trim()) {
      return errorResponse('interestId and message body are required', 400);
    }

    const interest = await prisma.interest.findUnique({
      where: { id: interestId },
      include: {
        seeker: { include: { user: true } },
        job: { include: { company: true, postedBy: { include: { user: true } } } },
        conversation: true,
      },
    });

    if (!interest) {
      return errorResponse('Interest record not found', 404);
    }

    // Check existing conversation
    let conversation = interest.conversation;

    // Rule 2: Recruiter-first message check
    if (!conversation) {
      // First message MUST be sent by RECRUITER
      if (user.role !== 'RECRUITER') {
        return forbiddenResponse('A job seeker cannot send the first message. The recruiter must initiate the chat first.');
      }

      // Create conversation & update interest status to CONTACTED
      conversation = await prisma.$transaction(async (tx) => {
        const newConv = await tx.conversation.create({
          data: {
            interestId: interest.id,
            startedById: user.id,
          },
        });

        await tx.interest.update({
          where: { id: interest.id },
          data: { status: 'CONTACTED' },
        });

        // Create FIRST_MESSAGE notification for Seeker
        await tx.notification.create({
          data: {
            userId: interest.seeker.userId,
            type: 'FIRST_MESSAGE',
            body: `Recruiter for ${interest.job.title} sent you a message: "${messageBody.trim().substring(0, 40)}..."`,
          },
        });

        return newConv;
      });
    }

    // Add message to conversation
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        senderRole: user.role,
        body: messageBody.trim(),
      },
    });

    // Make sure interest is CONTACTED
    await prisma.interest.update({
      where: { id: interest.id },
      data: { status: 'CONTACTED' },
    });

    return NextResponse.json({ success: true, message, conversationId: conversation.id });
  } catch (error: any) {
    console.error('Message POST error:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
}
