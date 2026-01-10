import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { config } from './config/app.config';
import { logger } from './utils/logger';
import { cacheService } from './services/cache.service';

const app = createApp();

const startServer = (): void => {
  try {
    logger.info('Starting server...');

    // Start background task for cache cleanup
    const cleanupInterval = setInterval(() => {
      cacheService.cleanupStaleEntries();
    }, 60000); // Run every minute

    // Store cleanup interval for graceful shutdown
    process.on('beforeExit', () => {
      clearInterval(cleanupInterval);
    });

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.env} mode`);
      logger.info(`Cache TTL: ${config.cacheTTL} seconds`);
      logger.info(`Cache Max Size: ${config.cacheMaxSize} items`);
      logger.info(`Rate limit: ${config.rateLimit.maxRequests} requests per minute`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
