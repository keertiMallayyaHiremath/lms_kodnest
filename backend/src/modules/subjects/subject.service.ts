import { SubjectRepository } from './subject.repository';
import prisma from '../../config/db';
import { flattenVideos } from '../../utils/ordering';

export class SubjectService {
  private repository = new SubjectRepository();

  async getSubjects(page: number = 1, pageSize: number = 10, query?: string) {
    const { subjects, total } = await this.repository.findPublished(
      page,
      pageSize,
      query
    );

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

  async getSubjectById(id: number) {
    const subject = await this.repository.findById(id);
    
    if (!subject) {
      throw new Error('Subject not found');
    }

    return subject;
  }

  async getSubjectTree(subjectId: number, userId: bigint) {
    const subject = await this.repository.findByIdWithSections(subjectId);
    
    if (!subject) {
      throw new Error('Subject not found');
    }

    // Get all video progress for this user
    const videoIds = subject.sections.flatMap(s => s.videos.map(v => v.id));
    const progressMap = await this.getProgressMap(userId, videoIds);

    // Flatten videos to determine ordering
    const flattened = flattenVideos(subject.sections);

    // Build tree with completion and lock status
    const sections = subject.sections.map(section => ({
      id: section.id,
      title: section.title,
      orderIndex: section.orderIndex,
      videos: section.videos.map(video => {
        const progress = progressMap.get(video.id);
        const flatVideo = flattened.find(f => f.videoId === video.id);
        
        // Check if video is locked
        const isLocked = this.isVideoLocked(
          flatVideo?.previousVideoId || null,
          progressMap
        );

        return {
          id: video.id,
          title: video.title,
          orderIndex: video.orderIndex,
          durationSeconds: video.durationSeconds,
          isCompleted: progress?.isCompleted || false,
          locked: isLocked,
        };
      }),
    }));

    return {
      id: subject.id,
      title: subject.title,
      description: subject.description,
      sections,
    };
  }

  async getFirstVideo(subjectId: number, userId: bigint) {
    const subject = await this.repository.findByIdWithSections(subjectId);
    
    if (!subject || subject.sections.length === 0) {
      throw new Error('No videos found');
    }

    const flattened = flattenVideos(subject.sections);
    
    if (flattened.length === 0) {
      throw new Error('No videos found');
    }

    // Get progress for all videos
    const videoIds = flattened.map(f => f.videoId);
    const progressMap = await this.getProgressMap(userId, videoIds);

    // Find first unlocked video
    for (const flatVideo of flattened) {
      const isLocked = this.isVideoLocked(flatVideo.previousVideoId, progressMap);
      if (!isLocked) {
        return { videoId: flatVideo.videoId };
      }
    }

    // If all locked, return first video
    return { videoId: flattened[0].videoId };
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
