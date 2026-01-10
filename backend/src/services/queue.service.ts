import { Queue, Worker, QueueEvents, type Job } from 'bullmq';
import { logger } from '../utils/logger';
import type { User } from '../types/user.types';

// Redis connection configuration
const connection = {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379'),
  maxRetriesPerRequest: null,
};

interface UserFetchJob {
  userId: number;
  timestamp: number;
}

interface UserFetchResult {
  user: User | null;
  fromQueue: boolean;
}

/**
 * Queue Service for asynchronous user data fetching
 * Demonstrates the use of BullMQ for async processing as per requirements
 */
class QueueService {
  private queue!: Queue<UserFetchJob>;
  private worker!: Worker<UserFetchJob, UserFetchResult>;
  private queueEvents!: QueueEvents;
  private pendingRequests: Map<number, Promise<UserFetchResult>> = new Map();
  private enabled: boolean;

  constructor() {
    // Check if Redis is available
    this.enabled = process.env.ENABLE_QUEUE === 'true';

    if (!this.enabled) {
      logger.info('Queue service disabled - using direct fetching');
      // Return early, don't initialize queue/worker
      return;
    }

    try {
      // Initialize the queue
      this.queue = new Queue<UserFetchJob>('user-fetch', {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      });

      // Initialize queue events listener
      this.queueEvents = new QueueEvents('user-fetch', { connection });

      // Initialize the worker
      this.worker = new Worker<UserFetchJob, UserFetchResult>(
        'user-fetch',
        async (job: Job<UserFetchJob>) => {
          return await this.processUserFetch(job);
        },
        {
          connection,
          concurrency: 10, // Process up to 10 jobs concurrently
        }
      );

      // Worker event listeners
      this.worker.on('completed', (job: Job) => {
        logger.debug(`Job ${job.id} completed for user ID: ${job.data.userId}`);
      });

      this.worker.on('failed', (job: Job | undefined, err: Error) => {
        logger.error(`Job ${job?.id} failed:`, err);
      });

      this.worker.on('error', (err: Error) => {
        logger.error('Worker error:', err);
      });

      logger.info('Queue service initialized with BullMQ', {
        redis: `${connection.host}:${connection.port}`,
        concurrency: 10,
      });
    } catch (error) {
      logger.warn('Failed to initialize queue service, falling back to direct fetching', error);
      this.enabled = false;
    }
  }

  /**
   * Process a user fetch job
   */
  private async processUserFetch(job: Job<UserFetchJob>): Promise<UserFetchResult> {
    const { userId } = job.data;
    logger.debug(`Processing user fetch job for user ID: ${userId}`);

    // Import here to avoid circular dependency
    const { userService } = await import('./user.service');

    try {
      const user = await userService.findById(userId);
      return {
        user,
        fromQueue: true,
      };
    } catch (error) {
      logger.error(`Error fetching user ${userId} in queue:`, error);
      throw error;
    }
  }

  /**
   * Add a user fetch job to the queue
   * Implements concurrent request deduplication
   */
  async fetchUser(userId: number): Promise<UserFetchResult> {
    // If queue is disabled, use direct fetching
    if (!this.enabled) {
      const { userService } = await import('./user.service');
      const user = await userService.findById(userId);
      return {
        user,
        fromQueue: false,
      };
    }

    // Check if there's already a pending request for this user
    const pending = this.pendingRequests.get(userId);
    if (pending) {
      logger.debug(`Reusing pending request for user ID: ${userId}`);
      return pending;
    }

    // Create new request promise
    const requestPromise = this.addJobAndWait(userId);
    this.pendingRequests.set(userId, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(userId);
    }
  }

  /**
   * Add job to queue and wait for result
   */
  private async addJobAndWait(userId: number): Promise<UserFetchResult> {
    const job = await this.queue.add(
      'fetch-user',
      {
        userId,
        timestamp: Date.now(),
      },
      {
        priority: 1,
      }
    );

    logger.debug(`Added job ${job.id} to queue for user ID: ${userId}`);

    // Wait for the job to complete
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    if (!this.enabled) {
      return {
        enabled: false,
        message: 'Queue service is disabled',
      };
    }

    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        this.queue.getWaitingCount(),
        this.queue.getActiveCount(),
        this.queue.getCompletedCount(),
        this.queue.getFailedCount(),
        this.queue.getDelayedCount(),
      ]);

      return {
        enabled: true,
        waiting,
        active,
        completed,
        failed,
        delayed,
        pendingRequests: this.pendingRequests.size,
      };
    } catch (error) {
      logger.error('Error getting queue stats:', error);
      return {
        enabled: true,
        error: 'Failed to retrieve queue statistics',
      };
    }
  }

  /**
   * Clean up resources
   */
  async close() {
    if (!this.enabled) return;

    try {
      await this.queueEvents.close();
      await this.worker.close();
      await this.queue.close();
      logger.info('Queue service closed');
    } catch (error) {
      logger.error('Error closing queue service:', error);
    }
  }

  /**
   * Check if queue is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const queueService = new QueueService();

// Graceful shutdown
process.on('SIGTERM', () => {
  void queueService.close();
});

process.on('SIGINT', () => {
  void queueService.close();
});
