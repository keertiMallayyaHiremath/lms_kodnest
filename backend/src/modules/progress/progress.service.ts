import { ProgressRepository } from './progress.repository';
import { VideoRepository } from '../videos/video.repository';

export class ProgressService {
  private repository = new ProgressRepository();
  private videoRepository = new VideoRepository();

  async getVideoProgress(userId: bigint, videoId: number) {
    const progress = await this.repository.getVideoProgress(userId, videoId);
    
    return {
      lastPositionSeconds: progress?.lastPositionSeconds || 0,
      isCompleted: progress?.isCompleted || false,
    };
  }

  async updateVideoProgress(
    userId: bigint,
    videoId: number,
    lastPositionSeconds: number,
    isCompleted: boolean
  ) {
    // Validate video exists
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    // Validate position
    if (lastPositionSeconds < 0 || lastPositionSeconds > video.durationSeconds) {
      throw new Error('Invalid position');
    }

    const progress = await this.repository.upsertVideoProgress(
      userId,
      videoId,
      lastPositionSeconds,
      isCompleted
    );

    return {
      lastPositionSeconds: progress.lastPositionSeconds,
      isCompleted: progress.isCompleted,
    };
  }

  async getSubjectProgress(userId: bigint, subjectId: number) {
    const progress = await this.repository.getSubjectProgress(userId, subjectId);
    
    if (!progress) {
      throw new Error('Subject not found');
    }

    return progress;
  }
}
