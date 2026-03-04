import { Router } from 'express';
import { SubjectController } from './subject.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();
const subjectController = new SubjectController();

router.get('/', (req, res) => subjectController.getSubjects(req, res));
router.get('/:subjectId', (req, res) => subjectController.getSubjectById(req, res));
router.get('/:subjectId/tree', authMiddleware, (req, res) => 
  subjectController.getSubjectTree(req, res)
);
router.get('/:subjectId/first-video', authMiddleware, (req, res) => 
  subjectController.getFirstVideo(req, res)
);

export default router;
