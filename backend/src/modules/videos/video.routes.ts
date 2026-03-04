import { Router } from 'express';
import { VideoController } from './video.controller';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// Protected routes (all video routes require authentication)
router.get('/:videoId', authenticateToken, VideoController.getVideo);
router.get('/subject/:subjectId', authenticateToken, VideoController.getVideosBySubject);

export default router;
