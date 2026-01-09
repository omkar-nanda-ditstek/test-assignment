import { DEFAULT_VALUES } from '../constants';
import { Environment, LogLevel } from '../enums';

interface EnvConfig {
  NODE_ENV: Environment;
  PORT: number;
  CACHE_TTL: number;
  CACHE_MAX_SIZE: number;
  LOG_LEVEL: LogLevel;
  RATE_LIMIT_WINDOW?: number;
  RATE_LIMIT_MAX?: number;
  BURST_WINDOW?: number;
  BURST_CAPACITY?: number;
  DATABASE_DELAY?: number;
}

const parseEnv = (): EnvConfig => {
  const env = process.env.NODE_ENV ?? 'development';
  const nodeEnv = Object.values(Environment).includes(env as Environment)
    ? (env as Environment)
    : Environment.DEVELOPMENT;

  const logLevel = process.env.LOG_LEVEL ?? 'info';
  const validLogLevel = Object.values(LogLevel).includes(logLevel as LogLevel)
    ? (logLevel as LogLevel)
    : LogLevel.INFO;

  return {
    NODE_ENV: nodeEnv,
    PORT: parseInt(process.env.PORT ?? '3000', 10),
    CACHE_TTL: parseInt(process.env.CACHE_TTL ?? String(DEFAULT_VALUES.CACHE_TTL), 10),
    CACHE_MAX_SIZE: parseInt(
      process.env.CACHE_MAX_SIZE ?? String(DEFAULT_VALUES.CACHE_MAX_SIZE),
      10
    ),
    LOG_LEVEL: validLogLevel,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW
      ? parseInt(process.env.RATE_LIMIT_WINDOW, 10)
      : undefined,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX
      ? parseInt(process.env.RATE_LIMIT_MAX, 10)
      : undefined,
    BURST_WINDOW: process.env.BURST_WINDOW ? parseInt(process.env.BURST_WINDOW, 10) : undefined,
    BURST_CAPACITY: process.env.BURST_CAPACITY
      ? parseInt(process.env.BURST_CAPACITY, 10)
      : undefined,
    DATABASE_DELAY: process.env.DATABASE_DELAY
      ? parseInt(process.env.DATABASE_DELAY, 10)
      : undefined,
  };
};

const validateEnv = (envConfig: EnvConfig): void => {
  const errors: string[] = [];

  if (isNaN(envConfig.PORT) || envConfig.PORT < 1 || envConfig.PORT > 65535) {
    errors.push('PORT must be a valid port number between 1 and 65535');
  }

  if (isNaN(envConfig.CACHE_TTL) || envConfig.CACHE_TTL < 1) {
    errors.push('CACHE_TTL must be a positive number');
  }

  if (isNaN(envConfig.CACHE_MAX_SIZE) || envConfig.CACHE_MAX_SIZE < 1) {
    errors.push('CACHE_MAX_SIZE must be a positive number');
  }

  if (envConfig.RATE_LIMIT_WINDOW !== undefined) {
    if (isNaN(envConfig.RATE_LIMIT_WINDOW) || envConfig.RATE_LIMIT_WINDOW < 1) {
      errors.push('RATE_LIMIT_WINDOW must be a positive number');
    }
  }

  if (envConfig.RATE_LIMIT_MAX !== undefined) {
    if (isNaN(envConfig.RATE_LIMIT_MAX) || envConfig.RATE_LIMIT_MAX < 1) {
      errors.push('RATE_LIMIT_MAX must be a positive number');
    }
  }

  if (envConfig.BURST_WINDOW !== undefined) {
    if (isNaN(envConfig.BURST_WINDOW) || envConfig.BURST_WINDOW < 1) {
      errors.push('BURST_WINDOW must be a positive number');
    }
  }

  if (envConfig.BURST_CAPACITY !== undefined) {
    if (isNaN(envConfig.BURST_CAPACITY) || envConfig.BURST_CAPACITY < 1) {
      errors.push('BURST_CAPACITY must be a positive number');
    }
  }

  if (envConfig.DATABASE_DELAY !== undefined) {
    if (isNaN(envConfig.DATABASE_DELAY) || envConfig.DATABASE_DELAY < 0) {
      errors.push('DATABASE_DELAY must be a non-negative number');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
};

export const loadEnv = (): EnvConfig => {
  const envConfig = parseEnv();
  validateEnv(envConfig);
  return envConfig;
};

export type { EnvConfig };
