import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateToken } from '@/middleware/authMiddleware';
import cookieParser from 'cookie-parser';

const router = Router();

// Middleware for parsing cookies
router.use(cookieParser());

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);

// Protected routes
router.post('/logout', authenticateToken, AuthController.logout);

export default router;
