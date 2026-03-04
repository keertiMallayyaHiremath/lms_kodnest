import prisma from '../../config/db';

export class ProgressRepository {
  async getVideoProgress(userId: bigint, videoId: number) {
    return prisma.videoProgress.findUnique({
      where: {
        userId_videoId: { userId, videoId },
      },
    });
  }

  async upsertVideoProgress(
    userId: bigint,
    videoId: number,
    lastPositionSeconds: number,
    isCompleted: boolean
  ) {
    return prisma.videoProgress.upsert({
      where: {
        userId_videoId: { userId, videoId },
      },
      update: {
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });
  }

  async getSubjectProgress(userId: bigint, subjectId: number) {
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        sections: {
          include: {
            videos: {
              include: {
                progress: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) return null;

    const allVideos = subject.sections.flatMap(s => s.videos);
    const totalVideos = allVideos.length;
    const completedVideos = allVideos.filter(
      v => v.progress[0]?.isCompleted
    ).length;

    // Find last watched video
    let lastVideo = null;
    let lastPosition = 0;
    
    for (const video of allVideos) {
      const progress = video.progress[0];
      if (progress && progress.updatedAt > new Date(lastPosition)) {
        lastVideo = video.id;
        lastPosition = progress.lastPositionSeconds;
      }
    }

    return {
      totalVideos,
      completedVideos,
      percentComplete: totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0,
      lastVideoId: lastVideo,
      lastPositionSeconds: lastPosition,
    };
  }
}
