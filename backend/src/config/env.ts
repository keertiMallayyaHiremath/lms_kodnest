import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
  };
  cors: {
    origin: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

// Validate required environment variables
if (!config.database.url) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!config.jwt.secret || config.jwt.secret === 'fallback-secret-change-in-production') {
  throw new Error('JWT_SECRET environment variable is required and should be set in production');
}

if (!config.jwt.refreshSecret || config.jwt.refreshSecret === 'fallback-refresh-secret-change-in-production') {
  throw new Error('JWT_REFRESH_SECRET environment variable is required and should be set in production');
}

export default config;
