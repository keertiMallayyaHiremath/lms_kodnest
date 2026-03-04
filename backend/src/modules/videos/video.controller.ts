import { Request, Response, NextFunction } from 'express';
import { VideoService } from './video.service';
import { errorHandler } from '@/middleware/errorHandler';

export class VideoController {
  static async getVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const videoId = BigInt(req.params.videoId);
      const userId = req.user!.id; // Authenticated user
      
      const video = await VideoService.getVideo(videoId, userId);
      res.json(video);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getVideosBySubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id; // Authenticated user
      
      const videos = await VideoService.getVideosBySubject(subjectId, userId);
      res.json(videos);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }
}
