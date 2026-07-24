import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function clean() {
  // 1. Auto-verify all companies so all recruiter jobs are active
  await prisma.company.updateMany({
    data: { status: 'VERIFIED' },
  });

  // 2. Clear previous test swipes so seekers can see all jobs afresh
  await prisma.interest.deleteMany({});

  console.log('DB Cleaned & All Companies Verified!');
  await prisma.$disconnect();
}

clean();
