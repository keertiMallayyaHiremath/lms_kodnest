import { Request, Response, NextFunction } from 'express';
import { ProgressService } from './progress.service';
import { errorHandler } from '@/middleware/errorHandler';

export class ProgressController {
  static async updateVideoProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoId = BigInt(req.params.videoId);
      const userId = req.user!.id; // Authenticated user
      const { last_position_seconds, is_completed } = req.body;

      const progress = await ProgressService.updateVideoProgress(userId, videoId, {
        last_position_seconds,
        is_completed,
      });

      res.json({
        message: 'Progress updated successfully',
        progress,
      });
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getVideoProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoId = BigInt(req.params.videoId);
      const userId = req.user!.id; // Authenticated user

      const progress = await ProgressService.getVideoProgress(userId, videoId);
      res.json(progress);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getSubjectProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id; // Authenticated user

      const progress = await ProgressService.getSubjectProgress(userId, subjectId);
      res.json(progress);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getUserProgressSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id; // Authenticated user

      const summary = await ProgressService.getUserProgressSummary(userId);
      res.json(summary);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }
}
