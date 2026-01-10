import type { Request, Response } from 'express';
import { queueService } from '../services/queue.service';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../constants';

export class QueueController {
  async getQueueStatus(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await queueService.getQueueStats();

      res.json({
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error getting queue status:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: 'Internal server error',
        message: 'An error occurred while fetching queue status',
      });
    }
  }
}

export const queueController = new QueueController();
