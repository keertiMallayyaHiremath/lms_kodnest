import { Request, Response } from 'express';
import { SubjectService } from './subject.service';

const subjectService = new SubjectService();

export class SubjectController {
  async getSubjects(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const query = req.query.q as string;

      const result = await subjectService.getSubjects(page, pageSize, query);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSubjectById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.subjectId);
      const subject = await subjectService.getSubjectById(id);
      res.json(subject);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getSubjectTree(req: Request, res: Response) {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const userId = req.user!.id;

      const tree = await subjectService.getSubjectTree(subjectId, userId);
      res.json(tree);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getFirstVideo(req: Request, res: Response) {
    try {
      const subjectId = parseInt(req.params.subjectId);
      const userId = req.user!.id;

      const result = await subjectService.getFirstVideo(subjectId, userId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
