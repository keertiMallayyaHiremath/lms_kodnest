import { Response } from 'express';
import prisma from '@/config/db';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { createError } from '@/middleware/errorHandler';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: bigint;
    email: string;
    name: string;
  };
  accessToken: string;
}

export class AuthService {
  static async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    
    return {
      user,
      accessToken,
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw createError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    };
  }

  static async refreshToken(req: AuthenticatedRequest, res: Response): Promise<AuthResponse> {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createError('Refresh token required', 401);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        tokenHash: refreshToken,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!storedToken || storedToken.userId !== decoded.id) {
      throw createError('Invalid refresh token', 401);
    }

    // Generate new access token
    const accessToken = generateAccessToken(storedToken.user);

    return {
      user: storedToken.user,
      accessToken,
    };
  }

  static async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      // Revoke refresh token
      await prisma.refreshToken.updateMany({
        where: {
          tokenHash: refreshToken,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });

      // Clear cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  }

  static async setRefreshToken(userId: bigint, res: Response): Promise<void> {
    // Get user info for token
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    // Generate refresh token
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: refreshToken,
        expiresAt,
      },
    });

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
}
