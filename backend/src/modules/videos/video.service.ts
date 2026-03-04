import { VideoRepository } from './video.repository';
import { createError } from '@/middleware/errorHandler';

export class VideoService {
  static async getVideo(videoId: bigint, userId: bigint) {
    const video = await VideoRepository.getVideoWithProgress(videoId, userId);
    
    if (!video) {
      throw createError('Video not found', 404);
    }

    return video;
  }

  static async getVideosBySubject(subjectId: bigint, userId: bigint) {
    const videos = await VideoRepository.getVideosBySubject(subjectId, userId);
    return videos;
  }
}
