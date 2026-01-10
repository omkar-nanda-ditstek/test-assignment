import { logger } from '../utils/logger';
import { DEFAULT_VALUES } from '../constants';

class MetricsService {
  private responseTimes: number[] = [];
  private readonly maxSamples = DEFAULT_VALUES.MAX_METRICS_SAMPLES;

  recordResponseTime(responseTime: number): void {
    try {
      this.responseTimes.push(responseTime);

      // Keep only the last N samples
      if (this.responseTimes.length > this.maxSamples) {
        this.responseTimes.shift();
      }
    } catch (error) {
      logger.error('Error recording response time:', error);
    }
  }

  recordCacheHit(responseTime: number): void {
    this.recordResponseTime(responseTime);
  }

  recordCacheMiss(responseTime: number): void {
    this.recordResponseTime(responseTime);
  }

  getAverageResponseTime(): number {
    try {
      if (this.responseTimes.length === 0) {
        return 0;
      }

      const sum = this.responseTimes.reduce((acc, time) => acc + time, 0);
      return sum / this.responseTimes.length;
    } catch (error) {
      logger.error('Error calculating average response time:', error);
      return 0;
    }
  }

  getMetricsSummary() {
    return {
      totalSamples: this.responseTimes.length,
      maxSamples: this.maxSamples,
      averageResponseTime:
        this.responseTimes.length > 0
          ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
          : 0,
      minResponseTime: this.responseTimes.length > 0 ? Math.min(...this.responseTimes) : 0,
      maxResponseTime: this.responseTimes.length > 0 ? Math.max(...this.responseTimes) : 0,
    };
  }

  reset(): void {
    this.responseTimes = [];
    logger.info('Metrics reset');
  }
}

export const metricsService = new MetricsService();
