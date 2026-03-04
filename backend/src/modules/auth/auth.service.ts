import crypto from 'crypto';
import prisma from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';

export class AuthService {
  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hashPassword(password);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = 
      await this.generateTokens(storedToken.userId);

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return {
      user: {
        id: storedToken.user.id.toString(),
        email: storedToken.user.email,
        name: storedToken.user.name,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async generateTokens(userId: bigint) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const tokenId = crypto.randomBytes(32).toString('hex');
    const accessToken = generateAccessToken(userId, user.email);
    const refreshToken = generateRefreshToken(userId, tokenId);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
