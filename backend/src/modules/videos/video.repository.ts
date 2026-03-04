import prisma from '@/config/db';
import { flattenVideos, getPrerequisiteVideo, FlattenedVideo } from '@/utils/ordering';

export class VideoRepository {
  static async findById(videoId: bigint) {
    return prisma.video.findUnique({
      where: { id: videoId },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
      },
    });
  }

  static async getVideoWithProgress(videoId: bigint, userId: bigint) {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
        videoProgress: {
          where: { userId },
          select: {
            lastPositionSec: true,
            isCompleted: true,
          },
        },
      },
    });

    if (!video) {
      return null;
    }

    // Get all videos in the subject to determine ordering
    const allVideos = await prisma.video.findMany({
      where: {
        section: {
          subjectId: video.section.subject.id,
        },
      },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            orderIndex: true,
          },
        },
        videoProgress: {
          where: { userId },
          select: {
            isCompleted: true,
          },
        },
      },
      orderBy: [
        { section: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    // Create flattened video list with order
    const videosWithOrder = allVideos.map(v => ({
      id: v.id,
      title: v.title,
      sectionId: v.sectionId,
      sectionTitle: v.section.title,
      orderIndex: v.orderIndex,
      sectionOrderIndex: v.section.orderIndex,
    }));

    const flattenedVideos = flattenVideos(videosWithOrder);
    const currentVideo = flattenedVideos.find(v => v.id === videoId);
    
    if (!currentVideo) {
      return null;
    }

    // Check if video is locked
    const prerequisiteVideo = getPrerequisiteVideo(videoId, flattenedVideos);
    let locked = false;
    let unlockReason = '';

    if (prerequisiteVideo) {
      const prerequisiteProgress = allVideos.find(v => v.id === prerequisiteVideo.id)?.videoProgress?.[0];
      if (!prerequisiteProgress?.isCompleted) {
        locked = true;
        unlockReason = `Complete "${prerequisiteVideo.title}" first`;
      }
    }

    // Get user progress for current video
    const progress = video.videoProgress[0];

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtube_url: video.youtubeUrl,
      youtube_video_id: video.youtubeVideoId,
      order_index: video.orderIndex,
      duration_seconds: video.durationSeconds,
      section_id: video.sectionId,
      section_title: video.section.title,
      subject_id: video.section.subject.id,
      subject_title: video.section.subject.title,
      previous_video_id: currentVideo.previousVideoId,
      next_video_id: currentVideo.nextVideoId,
      locked,
      unlock_reason: unlockReason,
      last_position_seconds: progress?.lastPositionSec || 0,
      is_completed: progress?.isCompleted || false,
    };
  }

  static async getVideosBySubject(subjectId: bigint, userId: bigint) {
    const videos = await prisma.video.findMany({
      where: {
        section: {
          subjectId,
        },
      },
      include: {
        section: {
          include: {
            subject: true,
          },
        },
        videoProgress: {
          where: { userId },
          select: {
            lastPositionSec: true,
            isCompleted: true,
          },
        },
      },
      orderBy: [
        { section: { orderIndex: 'asc' } },
        { orderIndex: 'asc' },
      ],
    });

    return videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      youtube_url: video.youtubeUrl,
      youtube_video_id: video.youtubeVideoId,
      order_index: video.orderIndex,
      duration_seconds: video.durationSeconds,
      section_id: video.sectionId,
      section_title: video.section.title,
      subject_id: video.section.subject.id,
      subject_title: video.section.subject.title,
      last_position_seconds: video.videoProgress[0]?.lastPositionSec || 0,
      is_completed: video.videoProgress[0]?.isCompleted || false,
    }));
  }
}
