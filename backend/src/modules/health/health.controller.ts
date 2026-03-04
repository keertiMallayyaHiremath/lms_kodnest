import { Request, Response } from 'express';

export class HealthController {
  static async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      // Basic health check
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
      };

      res.json(health);
    } catch (error) {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        message: 'Service unavailable',
      });
    }
  }
}
