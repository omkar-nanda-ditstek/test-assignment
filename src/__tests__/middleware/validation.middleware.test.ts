import type { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import {
  validate,
  validateBody,
  validateParams,
  validateQuery,
} from '../../middleware/validation.middleware';
import { HTTP_STATUS } from '../../constants';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('validate function', () => {
    const testSchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().integer().min(0),
    });

    it('should pass validation with valid data', () => {
      mockRequest.body = { name: 'John Doe', age: 30 };

      const middleware = validate(testSchema, 'body');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should fail validation with invalid data', () => {
      mockRequest.body = { age: 'invalid' };

      const middleware = validate(testSchema, 'body');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Validation error',
          message: 'Request validation failed',
          details: expect.any(Array),
        })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should strip unknown fields', () => {
      mockRequest.body = { name: 'John Doe', age: 30, extra: 'field' };

      const middleware = validate(testSchema, 'body');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.body).toEqual({ name: 'John Doe', age: 30 });
      expect(mockRequest.body).not.toHaveProperty('extra');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should convert types automatically', () => {
      mockRequest.body = { name: 'John Doe', age: '30' };

      const middleware = validate(testSchema, 'body');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.body.age).toBe(30);
      expect(typeof mockRequest.body.age).toBe('number');
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should collect all validation errors', () => {
      mockRequest.body = { age: 'invalid' };

      const middleware = validate(testSchema, 'body');
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(jsonCall.details).toHaveLength(2); // Missing name + invalid age
    });
  });

  describe('validateBody', () => {
    const testSchema = Joi.object({ field: Joi.string().required() });

    it('should validate request body', () => {
      mockRequest.body = { field: 'value' };

      const middleware = validateBody(testSchema);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('validateParams', () => {
    const testSchema = Joi.object({ id: Joi.number().required() });

    it('should validate request params', () => {
      mockRequest.params = { id: '123' };

      const middleware = validateParams(testSchema);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.params.id).toBe(123);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('validateQuery', () => {
    const testSchema = Joi.object({ search: Joi.string().required() });

    it('should validate request query', () => {
      mockRequest.query = { search: 'test' };

      const middleware = validateQuery(testSchema);
      middleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
