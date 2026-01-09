import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { logger } from './utils/logger';

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  app.use(cors());

  // Compression
  app.use(compression());

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
