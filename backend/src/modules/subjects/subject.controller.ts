import { Request, Response, NextFunction } from 'express';
import { SubjectService } from './subject.service';
import { errorHandler } from '@/middleware/errorHandler';

export class SubjectController {
  static async getSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const query = req.query.q as string;

      const result = await SubjectService.getSubjects(page, pageSize, query);
      res.json(result);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const subject = await SubjectService.getSubjectById(subjectId);
      res.json(subject);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getSubjectTree(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id; // Authenticated user
      
      const tree = await SubjectService.getSubjectTree(subjectId, userId);
      res.json(tree);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }

  static async getFirstUnlockedVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id; // Authenticated user
      
      const result = await SubjectService.getFirstUnlockedVideo(subjectId, userId);
      res.json(result);
    } catch (error) {
      errorHandler(error as any, req, res, next);
    }
  }
}
