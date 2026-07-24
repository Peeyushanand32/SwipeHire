import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const jobs = await prisma.job.findMany({
    include: {
      company: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  console.log(`TOTAL JOBS IN DB: ${jobs.length}`);
  jobs.forEach((j: any) => {
    console.log(`- Job ID: ${j.id} | Title: "${j.title}" | Company: "${j.company.name}" (Status: ${j.company.status}) | Active: ${j.isActive}`);
  });

  await prisma.$disconnect();
}

check();
