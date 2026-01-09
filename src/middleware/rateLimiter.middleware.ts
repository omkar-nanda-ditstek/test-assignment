import rateLimit from 'express-rate-limit';
import { type Request, type Response } from 'express';
import { config } from '../config/app.config';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

// Main rate limiter: 10 requests per minute
export const mainRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 1 minute
  max: config.rateLimit.maxRequests, // 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      message: 'Rate limit exceeded. Please wait before retrying.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    });
  },
  // Store in memory (default)
  // For production with multiple servers, consider using rate-limit-redis
});

// Burst rate limiter: 5 requests per 10 seconds
export const burstRateLimiter = rateLimit({
  windowMs: config.rateLimit.burstWindowMs, // 10 seconds
  max: config.rateLimit.burstCapacity, // 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all requests
  handler: (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      message: 'Burst limit exceeded. Please slow down your requests.',
      retryAfter: Math.ceil(config.rateLimit.burstWindowMs / 1000),
    });
  },
});

// Combined rate limiter middleware (applies both limits)
export const rateLimitMiddleware = [burstRateLimiter, mainRateLimiter];
