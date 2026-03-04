import { Router } from 'express';
import { SubjectController } from './subject.controller';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', SubjectController.getSubjects);
router.get('/:subjectId', SubjectController.getSubjectById);

// Protected routes
router.get('/:subjectId/tree', authenticateToken, SubjectController.getSubjectTree);
router.get('/:subjectId/first-video', authenticateToken, SubjectController.getFirstUnlockedVideo);

export default router;
