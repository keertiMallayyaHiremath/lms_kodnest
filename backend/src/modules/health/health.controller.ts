import { Request, Response } from 'express';
import prisma from '../../config/db';

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      });
    }
  }
}
