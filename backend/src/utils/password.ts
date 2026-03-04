import bcrypt from 'bcrypt';
import { securityConfig } from '../config/security';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, securityConfig.bcryptRounds);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
