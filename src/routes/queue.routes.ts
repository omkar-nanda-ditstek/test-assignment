import { Router } from 'express';
import { queueController } from '../controllers/queue.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/status', asyncHandler(queueController.getQueueStatus.bind(queueController)));

export default router;
