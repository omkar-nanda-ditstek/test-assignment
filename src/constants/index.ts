export const CACHE_KEYS = {
  USER_PREFIX: 'user:',
  STATS: 'cache:stats',
  KEYS_SET: 'cache:keys',
  METRICS: 'metrics:response_times',
} as const;

export const RATE_LIMIT_KEYS = {
  MAIN_PREFIX: 'ratelimit:main:',
  BURST_PREFIX: 'ratelimit:burst:',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_USER_ID: 'Invalid user ID',
  VALIDATION_ERROR: 'Validation error',
  NAME_EMAIL_REQUIRED: 'Name and email are required',
  RATE_LIMIT_EXCEEDED: 'Too many requests',
  BURST_LIMIT_EXCEEDED: 'Burst limit exceeded',
  INTERNAL_ERROR: 'Internal server error',
  ROUTE_NOT_FOUND: 'Route not found',
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  CACHE_CLEARED: 'Cache cleared successfully',
} as const;

export const DEFAULT_VALUES = {
  CACHE_TTL: 60, // seconds
  CACHE_MAX_SIZE: 500, // maximum items in cache
  DATABASE_DELAY: 200, // milliseconds
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX: 10, // requests
  BURST_WINDOW: 10 * 1000, // 10 seconds
  BURST_CAPACITY: 5, // requests
  MAX_METRICS_SAMPLES: 1000,
} as const;

export const CACHE_CONFIG = {
  MAX_SIZE: 500, // Maximum number of items in cache
  TTL: 60, // Time to live in seconds
  UPDATE_AGE_ON_GET: true, // LRU behavior
} as const;
