import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = {
      id: BigInt(payload.userId),
      email: payload.email,
      name: '', // Will be populated if needed
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
