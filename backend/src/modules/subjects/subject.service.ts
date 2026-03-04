import { SubjectRepository } from './subject.repository';
import { createError } from '@/middleware/errorHandler';

export class SubjectService {
  static async getSubjects(page: number = 1, pageSize: number = 10, query?: string) {
    return SubjectRepository.findAllPublished(page, pageSize, query);
  }

  static async getSubjectById(id: bigint) {
    const subject = await SubjectRepository.findById(id);
    
    if (!subject) {
      throw createError('Subject not found', 404);
    }

    if (!subject.isPublished) {
      throw createError('Subject not available', 403);
    }

    return subject;
  }

  static async getSubjectTree(subjectId: bigint, userId: bigint) {
    const tree = await SubjectRepository.findSubjectTree(subjectId, userId);
    
    if (!tree) {
      throw createError('Subject not found or not available', 404);
    }

    return tree;
  }

  static async getFirstUnlockedVideo(subjectId: bigint, userId: bigint) {
    const videoId = await SubjectRepository.getFirstUnlockedVideo(subjectId, userId);
    
    if (!videoId) {
      throw createError('No unlocked video found', 404);
    }

    return { videoId };
  }
}
