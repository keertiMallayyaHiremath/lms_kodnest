import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// All progress routes require authentication
router.post('/videos/:videoId', authenticateToken, ProgressController.updateVideoProgress);
router.get('/videos/:videoId', authenticateToken, ProgressController.getVideoProgress);
router.get('/subjects/:subjectId', authenticateToken, ProgressController.getSubjectProgress);
router.get('/summary', authenticateToken, ProgressController.getUserProgressSummary);

export default router;
