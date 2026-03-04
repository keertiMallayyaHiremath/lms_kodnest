import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: bigint;
        email: string;
        name: string;
      };
    }
  }
}
