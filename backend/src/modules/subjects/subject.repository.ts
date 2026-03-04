import prisma from '../../config/db';

export class SubjectRepository {
  async findPublished(page: number, pageSize: number, query?: string) {
    const skip = (page - 1) * pageSize;
    
    const where = {
      isPublished: true,
      ...(query && {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      }),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.subject.count({ where }),
    ]);

    return { subjects, total };
  }

  async findById(id: number) {
    return prisma.subject.findUnique({
      where: { id },
    });
  }

  async findByIdWithSections(id: number) {
    return prisma.subject.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });
  }
}
