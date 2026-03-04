import { Router } from 'express';
import { VideoController } from './video.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const videoController = new VideoController();

router.get('/:videoId', authMiddleware, (req, res) => 
  videoController.getVideoById(req, res)
);

export default router;
