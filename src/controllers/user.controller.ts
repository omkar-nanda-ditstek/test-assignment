import type { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { cacheService } from '../services/cache.service';
import { metricsService } from '../services/metrics.service';
import { queueService } from '../services/queue.service';
import { logger } from '../utils/logger';
import type { CreateUserDto, User } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES, CACHE_KEYS } from '../constants';

export class UserController {
  async getUserById(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    // Validation middleware ensures params.id is a valid number
    const userId = req.params.id as unknown as number;

    try {
      const cacheKey = `${CACHE_KEYS.USER_PREFIX}${userId}`;

      // Check cache first
      const cachedUser = cacheService.get<User>(cacheKey);
      if (cachedUser) {
        const responseTime = Date.now() - startTime;
        metricsService.recordResponseTime(responseTime);

        res.json({
          data: cachedUser,
          cached: true,
          responseTime: `${responseTime}ms`,
        });
        return;
      }

      // Fetch from database (optionally via queue if enabled)
      let user: User | null;
      let fromQueue = false;

      if (queueService.isEnabled()) {
        // Use queue service for async processing (BullMQ)
        const result = await queueService.fetchUser(userId);
        user = result.user;
        fromQueue = result.fromQueue;
        logger.debug(`User ${userId} fetched via queue: ${fromQueue}`);
      } else {
        // Fallback to direct service call
        user = await userService.findById(userId);
      }

      if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.USER_NOT_FOUND,
          message: `${ERROR_MESSAGES.USER_NOT_FOUND} with ID: ${userId}`,
        });
        return;
      }

      // Cache the result
      cacheService.set<User>(cacheKey, user);

      const responseTime = Date.now() - startTime;
      metricsService.recordResponseTime(responseTime);

      res.json({
        data: user,
        cached: false,
        fromQueue,
        responseTime: `${responseTime}ms`,
      });
    } catch (error) {
      logger.error('Error in getUserById:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'An error occurred while fetching user data',
      });
    }
  }

  createUser(req: Request, res: Response): void {
    try {
      // Validation middleware ensures body is valid and sanitized
      const userData: CreateUserDto = req.body;

      const newUser = userService.create(userData);

      // Cache the new user
      const cacheKey = `${CACHE_KEYS.USER_PREFIX}${newUser.id}`;
      cacheService.set<User>(cacheKey, newUser);

      res.status(HTTP_STATUS.CREATED).json({
        data: newUser,
        message: SUCCESS_MESSAGES.USER_CREATED,
      });
    } catch (error) {
      logger.error('Error in createUser:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'An error occurred while creating user',
      });
    }
  }

  getAllUsers(_req: Request, res: Response): void {
    try {
      const users = userService.getAllUsers();
      res.json({
        data: users,
        count: users.length,
      });
    } catch (error) {
      logger.error('Error in getAllUsers:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        message: 'An error occurred while fetching users',
      });
    }
  }
}

export const userController = new UserController();
