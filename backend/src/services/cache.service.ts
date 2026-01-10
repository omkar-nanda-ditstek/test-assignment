import { LRUCache } from 'lru-cache';
import { type CacheStats } from '../types/cache.types';
import { logger } from '../utils/logger';
import { config } from '../config/app.config';
import { metricsService } from './metrics.service';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheService {
  private cache: LRUCache<string, CacheEntry<unknown>>;
  private stats = {
    hits: 0,
    misses: 0,
  };

  constructor() {
    this.cache = new LRUCache<string, CacheEntry<unknown>>({
      max: config.cacheMaxSize ?? 500, // Maximum number of items
      ttl: config.cacheTTL * 1000, // TTL in milliseconds
      updateAgeOnGet: true, // Update age on access (true LRU behavior)
      updateAgeOnHas: false,
    });

    logger.info('LRU Cache initialized', {
      maxSize: config.cacheMaxSize ?? 500,
      ttl: `${config.cacheTTL}s`,
    });
  }

  get<T = unknown>(key: string): T | null {
    const startTime = Date.now();
    try {
      const entry = this.cache.get(key);

      if (entry) {
        this.stats.hits++;
        metricsService.recordCacheHit(Date.now() - startTime);
        logger.debug(`Cache HIT for key: ${key}`);
        return entry.data as T;
      }

      this.stats.misses++;
      metricsService.recordCacheMiss(Date.now() - startTime);
      logger.debug(`Cache MISS for key: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  set<T = unknown>(key: string, value: T, ttl?: number): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
      };

      const options = ttl ? { ttl: ttl * 1000 } : undefined;
      this.cache.set(key, entry as CacheEntry<unknown>, options);

      logger.debug(`Cache SET for key: ${key} with TTL: ${ttl ?? config.cacheTTL}s`);
    } catch (error) {
      logger.error('Cache set error:', error);
      throw error;
    }
  }

  delete(key: string): void {
    try {
      this.cache.delete(key);
      logger.debug(`Cache DELETE for key: ${key}`);
    } catch (error) {
      logger.error('Cache delete error:', error);
      throw error;
    }
  }

  clear(): void {
    try {
      const sizeBefore = this.cache.size;
      this.cache.clear();
      this.stats.hits = 0;
      this.stats.misses = 0;
      logger.info(`Cache cleared: ${sizeBefore} keys deleted`);
    } catch (error) {
      logger.error('Cache clear error:', error);
      throw error;
    }
  }

  getStats(): CacheStats {
    try {
      const totalRequests = this.stats.hits + this.stats.misses;
      const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
      const averageResponseTime = metricsService.getAverageResponseTime();

      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        currentSize: this.cache.size,
        totalRequests,
        hitRate: parseFloat(hitRate.toFixed(2)),
        averageResponseTime: parseFloat(averageResponseTime.toFixed(2)),
      };
    } catch (error) {
      logger.error('Error getting cache stats:', error);
      throw error;
    }
  }

  cleanupStaleEntries(): void {
    logger.info('Running cache cleanup task...');
    // lru-cache handles TTL automatically, but we can manually purge stale entries
    this.cache.purgeStale();
    logger.info(`Cache cleanup complete. Current size: ${this.cache.size}`);
  }

  // Additional utility methods
  has(key: string): boolean {
    return this.cache.has(key);
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  values<T = unknown>(): T[] {
    return Array.from(this.cache.values()).map((entry) => entry.data as T);
  }

  entries<T = unknown>(): Array<[string, T]> {
    return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.data as T]);
  }

  getMaxSize(): number {
    return this.cache.max;
  }

  getCurrentSize(): number {
    return this.cache.size;
  }

  getRemainingCapacity(): number {
    return this.cache.max - this.cache.size;
  }
}

export const cacheService = new CacheService();
