export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page?: number;
  totalPages?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  stack?: string;
  path?: string;
}

export interface CachedResponse<T> {
  data: T;
  cached: boolean;
  responseTime: string;
}

export interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Burst-Limit': string;
  'X-RateLimit-Burst-Remaining': string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}
