import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kodnest.com' },
    update: {},
    create: {
      email: 'admin@kodnest.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Create sample subject
  const subject = await prisma.subject.upsert({
    where: { slug: 'web-development-basics' },
    update: {},
    create: {
      title: 'Web Development Basics',
      slug: 'web-development-basics',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript',
      isPublished: true,
    },
  });

  console.log('Created subject:', subject.title);

  // Create sections
  const section1 = await prisma.section.create({
    data: {
      subjectId: subject.id,
      title: 'Introduction to Web Development',
      orderIndex: 1,
    },
  });

  const section2 = await prisma.section.create({
    data: {
      subjectId: subject.id,
      title: 'HTML Fundamentals',
      orderIndex: 2,
    },
  });

  const section3 = await prisma.section.create({
    data: {
      subjectId: subject.id,
      title: 'CSS Styling',
      orderIndex: 3,
    },
  });

  console.log('Created sections');

  // Create videos with the provided YouTube URLs
  const videos = [
    {
      sectionId: section1.id,
      title: 'Introduction to Web Development',
      description: 'Complete overview of what web development is and the technologies involved',
      youtubeUrl: 'https://youtu.be/xnOwOBYaA3w?si=UoMoFO767jLvUvDr',
      youtubeVideoId: 'xnOwOBYaA3w',
      orderIndex: 1,
      durationSeconds: 1800, // 30 minutes
    },
    {
      sectionId: section2.id,
      title: 'HTML Basics and Structure',
      description: 'Learn HTML tags, elements, and document structure',
      youtubeUrl: 'https://youtu.be/Qyw1Q8BqGmM?si=he9YPRQE9vjCh5v6',
      youtubeVideoId: 'Qyw1Q8BqGmM',
      orderIndex: 1,
      durationSeconds: 2400, // 40 minutes
    },
    {
      sectionId: section3.id,
      title: 'CSS Fundamentals and Styling',
      description: 'Master CSS selectors, properties, and layout techniques',
      youtubeUrl: 'https://youtu.be/ZVnjOPwW4ZA?si=4s257ZOTzhQBID3L',
      youtubeVideoId: 'ZVnjOPwW4ZA',
      orderIndex: 1,
      durationSeconds: 2100, // 35 minutes
    },
  ];

  for (const videoData of videos) {
    await prisma.video.create({
      data: videoData,
    });
  }

  console.log('Created videos with YouTube URLs');

  // Enroll admin user in the subject
  await prisma.enrollment.upsert({
    where: {
      userId_subjectId: {
        userId: adminUser.id,
        subjectId: subject.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      subjectId: subject.id,
    },
  });

  console.log('Enrolled admin user in subject');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
