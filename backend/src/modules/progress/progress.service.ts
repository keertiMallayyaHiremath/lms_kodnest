import { ProgressRepository } from './progress.repository';
import { createError } from '@/middleware/errorHandler';

interface UpdateVideoProgressData {
  last_position_seconds: number;
  is_completed: boolean;
}

export class ProgressService {
  static async updateVideoProgress(
    userId: bigint,
    videoId: bigint,
    data: UpdateVideoProgressData
  ) {
    const { last_position_seconds, is_completed } = data;

    // Validate position is non-negative
    if (last_position_seconds < 0) {
      throw createError('Position cannot be negative', 400);
    }

    return ProgressRepository.upsertVideoProgress(
      userId,
      videoId,
      last_position_seconds,
      is_completed
    );
  }

  static async getVideoProgress(userId: bigint, videoId: bigint) {
    const progress = await ProgressRepository.getVideoProgress(userId, videoId);
    
    if (!progress) {
      return {
        last_position_seconds: 0,
        is_completed: false,
      };
    }

    return {
      last_position_seconds: progress.lastPositionSec || 0,
      is_completed: progress.isCompleted,
    };
  }

  static async getSubjectProgress(userId: bigint, subjectId: bigint) {
    return ProgressRepository.getSubjectProgress(userId, subjectId);
  }

  static async getUserProgressSummary(userId: bigint) {
    return ProgressRepository.getUserProgressSummary(userId);
  }
}
