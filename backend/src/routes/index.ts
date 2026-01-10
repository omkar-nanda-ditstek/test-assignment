import { Router } from 'express';
import userRoutes from './user.routes';
import cacheRoutes from './cache.routes';
import queueRoutes from './queue.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/cache', cacheRoutes);
router.use('/queue', queueRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
