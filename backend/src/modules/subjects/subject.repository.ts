import prisma from '@/config/db';

export class SubjectRepository {
  static async findAllPublished(page: number = 1, pageSize: number = 10, query?: string) {
    const skip = (page - 1) * pageSize;
    
    const where = {
      isPublished: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { description: { contains: query, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [subjects, total] = await Promise.all([
      prisma.subject.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          createdAt: true,
          _count: {
            select: {
              sections: {
                where: {
                  videos: {
                    some: {}
                  }
                }
              }
            }
          }
        },
      }),
      prisma.subject.count({ where }),
    ]);

    return {
      subjects,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async findById(id: bigint) {
    return prisma.subject.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.subject.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async findSubjectTree(subjectId: bigint, userId: bigint) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId, isPublished: true },
      select: {
        id: true,
        title: true,
        sections: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            orderIndex: true,
            videos: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                orderIndex: true,
                videoProgress: {
                  where: { userId },
                  select: {
                    isCompleted: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) {
      return null;
    }

    // Flatten videos to determine lock status
    const allVideos: any[] = [];
    subject.sections.forEach(section => {
      section.videos.forEach(video => {
        allVideos.push({
          ...video,
          sectionId: section.id,
          sectionTitle: section.title,
          sectionOrderIndex: section.orderIndex,
        });
      });
    });

    // Sort by section order then video order
    allVideos.sort((a, b) => {
      if (a.sectionOrderIndex !== b.sectionOrderIndex) {
        return a.sectionOrderIndex - b.sectionOrderIndex;
      }
      return a.orderIndex - b.orderIndex;
    });

    // Determine lock status
    const flattenedVideos = allVideos.map((video, index) => {
      const isCompleted = video.videoProgress?.[0]?.isCompleted || false;
      const previousVideo = index > 0 ? allVideos[index - 1] : null;
      const isLocked = previousVideo && !previousVideo.videoProgress?.[0]?.isCompleted;

      return {
        id: video.id,
        title: video.title,
        order_index: video.orderIndex,
        is_completed: isCompleted,
        locked: isLocked,
      };
    });

    // Map back to sections structure
    const sectionsWithVideos = subject.sections.map(section => {
      const sectionVideos = flattenedVideos.filter(video => {
        const originalVideo = allVideos.find(v => v.id === video.id);
        return originalVideo?.sectionId === section.id;
      });

      return {
        id: section.id,
        title: section.title,
        order_index: section.orderIndex,
        videos: sectionVideos,
      };
    });

    return {
      id: subject.id,
      title: subject.title,
      sections: sectionsWithVideos,
    };
  }

  static async getFirstUnlockedVideo(subjectId: bigint, userId: bigint) {
    const tree = await this.findSubjectTree(subjectId, userId);
    
    if (!tree) {
      return null;
    }

    // Find first video that is not locked
    for (const section of tree.sections) {
      for (const video of section.videos) {
        if (!video.locked) {
          return video.id;
        }
      }
    }

    return null;
  }
}
