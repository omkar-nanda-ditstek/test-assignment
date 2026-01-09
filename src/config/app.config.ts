import { DEFAULT_VALUES } from '../constants';
import { loadEnv } from './env.config';

const env = loadEnv();

export const config = {
  port: env.PORT,
  env: env.NODE_ENV,
  cacheTTL: env.CACHE_TTL,
  cacheMaxSize: env.CACHE_MAX_SIZE,
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW ?? DEFAULT_VALUES.RATE_LIMIT_WINDOW,
    maxRequests: env.RATE_LIMIT_MAX ?? DEFAULT_VALUES.RATE_LIMIT_MAX,
    burstWindowMs: env.BURST_WINDOW ?? DEFAULT_VALUES.BURST_WINDOW,
    burstCapacity: env.BURST_CAPACITY ?? DEFAULT_VALUES.BURST_CAPACITY,
  },
  database: {
    mockDelay: env.DATABASE_DELAY ?? DEFAULT_VALUES.DATABASE_DELAY,
  },
  logLevel: env.LOG_LEVEL,
};
