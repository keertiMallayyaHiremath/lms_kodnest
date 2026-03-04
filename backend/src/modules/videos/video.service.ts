import { VideoRepository } from './video.repository';
import { SubjectRepository } from '../subjects/subject.repository';
import prisma from '../../config/db';
import { flattenVideos, getVideoPosition } from '../../utils/ordering';

export class VideoService {
  private repository = new VideoRepository();
  private subjectRepository = new SubjectRepository();

  async getVideoById(videoId: number, userId: bigint) {
    const video = await this.repository.findById(videoId);
    
    if (!video) {
      throw new Error('Video not found');
    }

    const subject = await this.subjectRepository.findByIdWithSections(
      video.section.subjectId
    );

    if (!subject) {
      throw new Error('Subject not found');
    }

    // Flatten videos to get ordering
    const flattened = flattenVideos(subject.sections);
    const position = getVideoPosition(videoId, flattened);

    if (!position) {
      throw new Error('Video position not found');
    }

    // Check if video is locked
    const videoIds = flattened.map(f => f.videoId);
    const progressMap = await this.getProgressMap(userId, videoIds);
    
    const isLocked = this.isVideoLocked(position.previousVideoId, progressMap);
    const unlockReason = isLocked
      ? 'Complete the previous video to unlock this one'
      : null;

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      youtubeVideoId: video.youtubeVideoId,
      orderIndex: video.orderIndex,
      durationSeconds: video.durationSeconds,
      sectionId: video.sectionId,
      sectionTitle: video.section.title,
      subjectId: video.section.subjectId,
      subjectTitle: video.section.subject.title,
      previousVideoId: position.previousVideoId,
      nextVideoId: position.nextVideoId,
      locked: isLocked,
      unlockReason,
    };
  }

  private async getProgressMap(userId: bigint, videoIds: number[]) {
    const progress = await prisma.videoProgress.findMany({
      where: {
        userId,
        videoId: { in: videoIds },
      },
    });

    return new Map(progress.map(p => [p.videoId, p]));
  }

  private isVideoLocked(
    previousVideoId: number | null,
    progressMap: Map<number, any>
  ): boolean {
    if (!previousVideoId) return false;
    
    const prevProgress = progressMap.get(previousVideoId);
    return !prevProgress || !prevProgress.isCompleted;
  }
}
