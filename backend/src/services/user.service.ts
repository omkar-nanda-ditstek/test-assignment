import type { User, CreateUserDto, UserRepository } from '../types/user.types';
import { config } from '../config/app.config';
import { logger } from '../utils/logger';

const mockUsers: Record<number, User> = {
  1: { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  2: { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() },
  3: { id: 3, name: 'Alice Johnson', email: 'alice@example.com', createdAt: new Date() },
};

let nextUserId = 4;

class UserService implements UserRepository {
  private pendingRequests: Map<number, Promise<User | null>> = new Map();

  async findById(id: number): Promise<User | null> {
    // Handle concurrent requests - if a request for this ID is already pending, return that promise
    const pending = this.pendingRequests.get(id);
    if (pending) {
      logger.debug(`Waiting for pending request for user ID: ${id}`);
      return pending;
    }

    // Create new request promise
    const requestPromise = this.fetchUser(id);
    this.pendingRequests.set(id, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(id);
    }
  }

  private async fetchUser(id: number): Promise<User | null> {
    logger.debug(`Simulating database call for user ID: ${id}`);

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, config.database.mockDelay));

    const user = mockUsers[id];
    if (!user) {
      logger.warn(`User not found: ${id}`);
      return null;
    }

    logger.info(`User fetched from database: ${id}`);
    return user;
  }

  create(userData: CreateUserDto): User {
    const newUser: User = {
      id: nextUserId++,
      name: userData.name,
      email: userData.email,
      createdAt: new Date(),
    };

    mockUsers[newUser.id] = newUser;
    logger.info(`User created: ${newUser.id}`);

    return newUser;
  }

  getAllUsers(): User[] {
    return Object.values(mockUsers);
  }
}

export const userService = new UserService();
