import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&?]+)/);
  return match ? match[1] : url;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWEgEjqK', // password: password123
      name: 'Test User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create subject
  const subject = await prisma.subject.upsert({
    where: { slug: 'introduction-to-programming' },
    update: {},
    create: {
      title: 'Introduction to Programming',
      slug: 'introduction-to-programming',
      description: 'Learn the fundamentals of programming with this comprehensive course.',
      isPublished: true,
    },
  });

  console.log('✅ Created subject:', subject.title);

  // Create section
  const section = await prisma.section.create({
    data: {
      subjectId: subject.id,
      title: 'Getting Started',
      orderIndex: 0,
    },
  });

  console.log('✅ Created section:', section.title);

  // Create videos with the provided YouTube URLs
  const videoData = [
    {
      url: 'https://youtu.be/xnOwOBYaA3w?si=UoMoFO767jLvUvDr',
      title: 'Introduction to the Course',
      description: 'Welcome to the course! Learn what we will cover.',
      duration: 600,
    },
    {
      url: 'https://youtu.be/Qyw1Q8BqGmM?si=he9YPRQE9vjCh5v6',
      title: 'Setting Up Your Environment',
      description: 'Learn how to set up your development environment.',
      duration: 900,
    },
    {
      url: 'https://youtu.be/ZVnjOPwW4ZA?si=4s257ZOTzhQBID3L',
      title: 'Your First Program',
      description: 'Write and run your first program.',
      duration: 1200,
    },
  ];

  for (let i = 0; i < videoData.length; i++) {
    const data = videoData[i];
    const video = await prisma.video.create({
      data: {
        sectionId: section.id,
        title: data.title,
        description: data.description,
        youtubeVideoId: extractYouTubeId(data.url),
        orderIndex: i,
        durationSeconds: data.duration,
      },
    });
    console.log(`✅ Created video ${i + 1}:`, video.title);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
