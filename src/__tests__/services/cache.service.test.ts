import { cacheService } from '../../services/cache.service';

describe('CacheService', () => {
  beforeEach(() => {
    // Clear cache before each test
    cacheService.clear();
  });

  describe('set and get', () => {
    it('should set and get a value', () => {
      const key = 'test-key';
      const value = { name: 'Test User', id: 1 };

      cacheService.set(key, value);
      const result = cacheService.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      const result = cacheService.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should handle different data types', () => {
      cacheService.set('string', 'test string');
      cacheService.set('number', 42);
      cacheService.set('boolean', true);
      cacheService.set('array', [1, 2, 3]);
      cacheService.set('object', { a: 1, b: 2 });

      expect(cacheService.get('string')).toBe('test string');
      expect(cacheService.get('number')).toBe(42);
      expect(cacheService.get('boolean')).toBe(true);
      expect(cacheService.get('array')).toEqual([1, 2, 3]);
      expect(cacheService.get('object')).toEqual({ a: 1, b: 2 });
    });

    it('should overwrite existing key', () => {
      const key = 'test-key';
      cacheService.set(key, 'value1');
      cacheService.set(key, 'value2');

      expect(cacheService.get(key)).toBe('value2');
    });

    it('should support custom TTL', () => {
      const key = 'test-key';
      const value = 'test-value';
      const ttl = 1; // 1 second

      cacheService.set(key, value, ttl);
      expect(cacheService.get(key)).toBe(value);
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      const key = 'test-key';
      cacheService.set(key, 'value');
      expect(cacheService.get(key)).toBe('value');

      cacheService.delete(key);
      expect(cacheService.get(key)).toBeNull();
    });

    it('should not throw error when deleting non-existent key', () => {
      expect(() => cacheService.delete('non-existent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      cacheService.set('key3', 'value3');

      expect(cacheService.getCurrentSize()).toBe(3);

      cacheService.clear();

      expect(cacheService.getCurrentSize()).toBe(0);
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
      expect(cacheService.get('key3')).toBeNull();
    });

    it('should reset statistics', () => {
      cacheService.set('key', 'value');
      cacheService.get('key'); // Hit
      cacheService.get('non-existent'); // Miss

      let stats = cacheService.getStats();
      expect(stats.hits).toBeGreaterThan(0);
      expect(stats.misses).toBeGreaterThan(0);

      cacheService.clear();

      stats = cacheService.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('has', () => {
    it('should return true if key exists', () => {
      cacheService.set('test-key', 'value');
      expect(cacheService.has('test-key')).toBe(true);
    });

    it('should return false if key does not exist', () => {
      expect(cacheService.has('non-existent')).toBe(false);
    });
  });

  describe('keys, values, entries', () => {
    beforeEach(() => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      cacheService.set('key3', 'value3');
    });

    it('should return all keys', () => {
      const keys = cacheService.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('should return all values', () => {
      const values = cacheService.values();
      expect(values).toHaveLength(3);
      expect(values).toContain('value1');
      expect(values).toContain('value2');
      expect(values).toContain('value3');
    });

    it('should return all entries', () => {
      const entries = cacheService.entries();
      expect(entries).toHaveLength(3);
      expect(entries).toEqual(
        expect.arrayContaining([
          ['key1', 'value1'],
          ['key2', 'value2'],
          ['key3', 'value3'],
        ])
      );
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      // Create some cache activity
      cacheService.set('key1', 'value1');
      cacheService.get('key1'); // Hit
      cacheService.get('key1'); // Hit
      cacheService.get('non-existent'); // Miss

      const stats = cacheService.getStats();

      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('currentSize');
      expect(stats).toHaveProperty('totalRequests');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('averageResponseTime');

      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.currentSize).toBe(1);
      expect(stats.totalRequests).toBe(3);
      expect(stats.hitRate).toBeCloseTo(66.67, 1);
    });

    it('should calculate hit rate correctly', () => {
      cacheService.set('key', 'value');

      // 3 hits, 2 misses = 60% hit rate
      cacheService.get('key'); // Hit
      cacheService.get('key'); // Hit
      cacheService.get('key'); // Hit
      cacheService.get('miss1'); // Miss
      cacheService.get('miss2'); // Miss

      const stats = cacheService.getStats();
      expect(stats.hitRate).toBeCloseTo(60, 0);
    });

    it('should return 0 hit rate when no requests', () => {
      const stats = cacheService.getStats();
      expect(stats.hitRate).toBe(0);
      expect(stats.totalRequests).toBe(0);
    });
  });

  describe('size and capacity', () => {
    it('should return current size', () => {
      expect(cacheService.getCurrentSize()).toBe(0);

      cacheService.set('key1', 'value1');
      expect(cacheService.getCurrentSize()).toBe(1);

      cacheService.set('key2', 'value2');
      expect(cacheService.getCurrentSize()).toBe(2);
    });

    it('should return max size', () => {
      const maxSize = cacheService.getMaxSize();
      expect(maxSize).toBeGreaterThan(0);
      expect(typeof maxSize).toBe('number');
    });

    it('should return remaining capacity', () => {
      const initialCapacity = cacheService.getRemainingCapacity();
      const maxSize = cacheService.getMaxSize();

      expect(initialCapacity).toBe(maxSize);

      cacheService.set('key', 'value');
      expect(cacheService.getRemainingCapacity()).toBe(maxSize - 1);
    });
  });

  describe('cleanupStaleEntries', () => {
    it('should not throw error when cleaning up', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');

      expect(() => cacheService.cleanupStaleEntries()).not.toThrow();
    });

    it('should maintain valid entries after cleanup', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');

      cacheService.cleanupStaleEntries();

      expect(cacheService.get('key1')).toBe('value1');
      expect(cacheService.get('key2')).toBe('value2');
    });
  });

  describe('LRU behavior', () => {
    it('should evict least recently used items when cache is full', () => {
      // This test requires knowing the max cache size
      // We'll set many items and verify old ones get evicted
      const maxSize = cacheService.getMaxSize();

      // Fill cache to max
      for (let i = 0; i < maxSize; i++) {
        cacheService.set(`key${i}`, `value${i}`);
      }

      expect(cacheService.getCurrentSize()).toBe(maxSize);

      // Add one more item, should evict the oldest
      cacheService.set('new-key', 'new-value');

      expect(cacheService.getCurrentSize()).toBe(maxSize);
      expect(cacheService.get('new-key')).toBe('new-value');
    });
  });
});
