import { Request, Response } from 'express';
import { ProgressService } from './progress.service';

const progressService = new ProgressService();

export class ProgressController {
  async getVideoProgress(req: Request, res: Response) {
    try {
      const videoId = parseInt(req.params.videoId);
      const userId = req.user!.id;

      const progress = await progressService.getVideoProgress(userId, videoId);
      res.json(progress);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateVideoProgress(req: Request, res: Response) {
    try {
      const videoId = parseInt(req.params.videoId);
      const userId = req.user!.id;
      const { lastPositionSeconds, isCompleted } = req.body;

      const progress = await progressService.updateVideoProgress(
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted
      );

      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSubjectProgress(req: Request, res: Response) {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const userId = req.user!.id;

      const progress = await progressService.getSubjectProgress(userId, subjectId);
      res.json(progress);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
