import type { Request, Response, NextFunction } from 'express';
import type { Schema } from 'joi';
import { logger } from '../utils/logger';
import { HTTP_STATUS } from '../constants';

type ValidationTarget = 'body' | 'params' | 'query';

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation middleware factory
 * @param schema - Joi validation schema
 * @param target - Which part of the request to validate (body, params, or query)
 */
export const validate = (schema: Schema, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Get the data to validate based on target
    const dataToValidate = req[target];

    // Validate the data
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Collect all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
      convert: true, // Convert types (e.g., string "123" to number 123)
    });

    if (error) {
      // Format validation errors
      const errors: ValidationError[] = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation failed', {
        target,
        errors,
        data: dataToValidate,
      });

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Validation error',
        message: 'Request validation failed',
        details: errors,
      });
      return;
    }

    // Replace the request data with the validated and sanitized value
    req[target] = value;

    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema: Schema) => validate(schema, 'body');

/**
 * Validate request params
 */
export const validateParams = (schema: Schema) => validate(schema, 'params');

/**
 * Validate request query
 */
export const validateQuery = (schema: Schema) => validate(schema, 'query');
