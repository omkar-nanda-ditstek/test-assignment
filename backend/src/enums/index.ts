export enum CacheStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  UNHEALTHY = 'unhealthy',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export enum RateLimitType {
  MAIN = 'main',
  BURST = 'burst',
}
