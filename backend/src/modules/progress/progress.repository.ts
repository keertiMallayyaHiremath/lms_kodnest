import prisma from '@/config/db';

export class ProgressRepository {
  static async upsertVideoProgress(
    userId: bigint,
    videoId: bigint,
    lastPositionSec: number,
    isCompleted: boolean
  ) {
    return prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      update: {
        lastPositionSec,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        videoId,
        lastPositionSec,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      },
      select: {
        id: true,
        lastPositionSec: true,
        isCompleted: true,
        completedAt: true,
      },
    });
  }

  static async getVideoProgress(userId: bigint, videoId: bigint) {
    return prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId,
        },
      },
      select: {
        lastPositionSec: true,
        isCompleted: true,
        completedAt: true,
      },
    });
  }

  static async getSubjectProgress(userId: bigint, subjectId: bigint) {
    // Get all videos in the subject
    const videos = await prisma.video.findMany({
      where: {
        section: {
          subjectId,
        },
      },
      select: {
        id: true,
      },
    });

    const videoIds = videos.map(v => v.id);

    if (videoIds.length === 0) {
      return {
        total_videos: 0,
        completed_videos: 0,
        percent_complete: 0,
        last_video_id: null,
        last_position_seconds: 0,
      };
    }

    // Get progress for all videos
    const progress = await prisma.videoProgress.findMany({
      where: {
        userId,
        videoId: {
          in: videoIds,
        },
      },
      select: {
        videoId: true,
        lastPositionSec: true,
        isCompleted: true,
        updatedAt: true,
      },
    });

    const completedVideos = progress.filter(p => p.isCompleted).length;
    const percentComplete = Math.round((completedVideos / videoIds.length) * 100);

    // Find the last video the user watched
    const lastProgress = progress
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

    return {
      total_videos: videoIds.length,
      completed_videos: completedVideos,
      percent_complete: percentComplete,
      last_video_id: lastProgress?.videoId || null,
      last_position_seconds: lastProgress?.lastPositionSec || 0,
    };
  }

  static async getUserProgressSummary(userId: bigint) {
    const subjects = await prisma.subject.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        videos: {
          select: {
            id: true,
          },
        },
      },
    });

    const summary = await Promise.all(
      subjects.map(async (subject) => {
        const progress = await this.getSubjectProgress(userId, subject.id);
        return {
          subject_id: subject.id,
          subject_title: subject.title,
          ...progress,
        };
      })
    );

    return summary;
  }
}
