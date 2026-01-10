import type { Application } from 'express';
import request from 'supertest';
import { createApp } from '../../app';

/**
 * Create a test application instance
 */
export const createTestApp = (): Application => {
  return createApp();
};

/**
 * Make a GET request to the test app
 */
export const makeGetRequest = (app: Application, url: string) => {
  return request(app).get(url);
};

/**
 * Make a POST request to the test app
 */
export const makePostRequest = (app: Application, url: string, body: Record<string, unknown>) => {
  return request(app).post(url).send(body);
};

/**
 * Make a DELETE request to the test app
 */
export const makeDeleteRequest = (app: Application, url: string) => {
  return request(app).delete(url);
};

/**
 * Test user data
 */
export const mockUsers = {
  valid: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  validAlternate: {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
  },
  invalidEmail: {
    name: 'Invalid User',
    email: 'invalid-email',
  },
  missingName: {
    email: 'test@example.com',
  },
  missingEmail: {
    name: 'Test User',
  },
  nameTooShort: {
    name: 'J',
    email: 'test@example.com',
  },
  nameTooLong: {
    name: 'a'.repeat(101),
    email: 'test@example.com',
  },
};
