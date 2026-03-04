import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import healthRoutes from './modules/health/health.routes';

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);

// Error handler
app.use(errorHandler);

export default app;
