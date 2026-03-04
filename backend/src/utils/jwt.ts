import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

export const generateAccessToken = (userId: bigint, email: string): string => {
  return jwt.sign(
    { userId: userId.toString(), email } as AccessTokenPayload,
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
};

export const generateRefreshToken = (userId: bigint, tokenId: string): string => {
  return jwt.sign(
    { userId: userId.toString(), tokenId } as RefreshTokenPayload,
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
};
