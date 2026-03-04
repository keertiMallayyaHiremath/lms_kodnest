import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validator';
import { errorHandler } from '@/middleware/errorHandler';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message),
        });
        return;
      }

      const result = await AuthService.register(value);
      
      // Set refresh token cookie
      await AuthService.setRefreshToken(result.user.id, res);

      res.status(201).json({
        message: 'User registered successfully',
        ...result,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.details.map(detail => detail.message),
        });
        return;
      }

      const result = await AuthService.login(value);
      
      // Set refresh token cookie
      await AuthService.setRefreshToken(result.user.id, res);

      res.json({
        message: 'Login successful',
        ...result,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.refreshToken(req, res);
      res.json({
        message: 'Token refreshed successfully',
        ...result,
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.logout(req, res);
      res.json({
        message: 'Logout successful',
      });
    } catch (error) {
      errorHandler(error, req, res, next);
    }
  }
}
