import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validator';
import { securityConfig } from '../../config/security';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await authService.register(
        validated.email,
        validated.password,
        validated.name
      );

      res.cookie(
        securityConfig.refreshTokenCookie.name,
        result.refreshToken,
        securityConfig.refreshTokenCookie
      );

      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated.email, validated.password);

      res.cookie(
        securityConfig.refreshTokenCookie.name,
        result.refreshToken,
        securityConfig.refreshTokenCookie
      );

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[securityConfig.refreshTokenCookie.name];
      
      if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
      }

      const result = await authService.refresh(refreshToken);

      res.cookie(
        securityConfig.refreshTokenCookie.name,
        result.refreshToken,
        securityConfig.refreshTokenCookie
      );

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies[securityConfig.refreshTokenCookie.name];
      
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie(securityConfig.refreshTokenCookie.name);
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
