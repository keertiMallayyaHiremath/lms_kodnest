import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const progressController = new ProgressController();

router.get('/videos/:videoId', authMiddleware, (req, res) => 
  progressController.getVideoProgress(req, res)
);

router.post('/videos/:videoId', authMiddleware, (req, res) => 
  progressController.updateVideoProgress(req, res)
);

router.get('/subjects/:subjectId', authMiddleware, (req, res) => 
  progressController.getSubjectProgress(req, res)
);

export default router;
