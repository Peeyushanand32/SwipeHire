import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SwipeHire database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@swipehire.com' },
    update: {},
    create: {
      email: 'admin@swipehire.com',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Created Admin user:', admin.email);

  // 2. Create Verified Company
  const company = await prisma.company.create({
    data: {
      name: 'TechCorp Innovations',
      status: 'VERIFIED',
      gstNumber: '29ABCDE1234F1ZH',
      city: 'Bangalore',
    },
  });
  console.log('Created Company:', company.name);

  // 3. Create Recruiter User
  const recruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@techcorp.com',
      passwordHash,
      role: 'RECRUITER',
      recruiterProfile: {
        create: {
          fullName: 'Sarah Jenkins',
          companyId: company.id,
        },
      },
    },
    include: { recruiterProfile: true },
  });
  console.log('Created Recruiter user:', recruiterUser.email);

  // 4. Create Job Seeker User
  const seekerUser = await prisma.user.create({
    data: {
      email: 'seeker@example.com',
      passwordHash,
      role: 'SEEKER',
      seekerProfile: {
        create: {
          fullName: 'Rahul Sharma',
          headline: 'Full Stack React & Node Developer',
          skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Next.js']),
          expectedSalary: 1800000,
          city: 'Bangalore',
        },
      },
    },
    include: { seekerProfile: true },
  });
  console.log('Created Seeker user:', seekerUser.email);

  // 5. Create Sample Jobs
  const job1 = await prisma.job.create({
    data: {
      companyId: company.id,
      postedById: recruiterUser.recruiterProfile!.id,
      title: 'Senior Frontend Engineer',
      description: 'Join TechCorp to build high-performance React web applications.',
      skills: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS']),
      salaryMin: 1500000,
      salaryMax: 2500000,
      city: 'Bangalore',
      isActive: true,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      companyId: company.id,
      postedById: recruiterUser.recruiterProfile!.id,
      title: 'Backend Systems Engineer',
      description: 'Build scalable REST APIs and microservices using Node.js & PostgreSQL.',
      skills: JSON.stringify(['Node.js', 'PostgreSQL', 'Prisma', 'Docker']),
      salaryMin: 1800000,
      salaryMax: 3000000,
      city: 'Bangalore',
      isActive: true,
    },
  });

  console.log('Created sample jobs:', job1.title, ',', job2.title);
  console.log('Seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
