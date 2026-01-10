import type { Request, Response } from 'express';
import { cacheService } from '../services/cache.service';
import { logger } from '../utils/logger';

export class CacheController {
  clearCache(_req: Request, res: Response): void {
    try {
      cacheService.clear();

      res.json({
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error in clearCache:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while clearing cache',
      });
    }
  }

  getCacheStatus(_req: Request, res: Response): void {
    try {
      const stats = cacheService.getStats();

      res.json({
        status: 'active',
        statistics: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Error in getCacheStatus:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'An error occurred while fetching cache status',
      });
    }
  }
}

export const cacheController = new CacheController();
