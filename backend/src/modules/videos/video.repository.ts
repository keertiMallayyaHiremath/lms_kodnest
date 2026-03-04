import prisma from '../../config/db';

export class VideoRepository {
  async findById(id: number) {
    return prisma.video.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  async findBySectionId(sectionId: number) {
    return prisma.video.findMany({
      where: { sectionId },
      orderBy: { orderIndex: 'asc' },
    });
  }
}
