import { Request, Response } from 'express';
import { VideoService } from './video.service';

const videoService = new VideoService();

export class VideoController {
  async getVideoById(req: Request, res: Response) {
    try {
      const videoId = parseInt(req.params.videoId);
      const userId = req.user!.id;

      const video = await videoService.getVideoById(videoId, userId);
      res.json(video);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
