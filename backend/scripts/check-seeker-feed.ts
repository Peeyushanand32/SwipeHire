import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testSeekerFeed() {
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      company: {
        status: 'VERIFIED',
      },
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          status: true,
          city: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log('=========================================================');
  console.log(` SEEKER PANEL FEED VERIFICATION (${jobs.length} JOBS ACTIVE)`);
  console.log('=========================================================');

  jobs.forEach((j: any, index: number) => {
    let parsedSkills = [];
    try {
      parsedSkills = typeof j.skills === 'string' ? JSON.parse(j.skills || '[]') : j.skills;
    } catch (e) {
      parsedSkills = [];
    }

    console.log(`Card #${index + 1}:`);
    console.log(`  📌 Title: "${j.title}"`);
    console.log(`  🏢 Company: "${j.company.name}" (Status: ${j.company.status})`);
    console.log(`  📍 Location: ${j.city || j.company.city || 'Remote'}`);
    console.log(`  💰 Salary: ${j.salaryMin ? `₹${j.salaryMin.toLocaleString()} - ₹${j.salaryMax?.toLocaleString() || ''}` : 'Competitive'}`);
    console.log(`  🛠️ Skills: ${parsedSkills.join(', ')}`);
    console.log('---------------------------------------------------------');
  });

  await prisma.$disconnect();
}

testSeekerFeed();
