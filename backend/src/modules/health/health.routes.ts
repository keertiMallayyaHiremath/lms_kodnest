import { Router } from 'express';
import { HealthController } from './health.controller';

const router = Router();

router.get('/health', HealthController.checkHealth);

export default router;
