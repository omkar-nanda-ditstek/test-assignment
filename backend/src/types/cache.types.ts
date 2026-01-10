export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  currentSize: number;
  totalRequests: number;
  hitRate: number;
  averageResponseTime: number;
}

export interface LRUCache<T = unknown> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): Promise<CacheStats>;
}
