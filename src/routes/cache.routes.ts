import { Router } from 'express';
import { cacheController } from '../controllers/cache.controller';

const router = Router();

router.delete('/', cacheController.clearCache.bind(cacheController));
router.get('/status', cacheController.getCacheStatus.bind(cacheController));

export default router;
