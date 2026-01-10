import Joi from 'joi';

// Create User Validation Schema
export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
});

// Get User by ID Validation Schema (for params)
export const getUserByIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be a positive number',
    'any.required': 'User ID is required',
  }),
});

// Update User Validation Schema (optional fields for partial updates)
export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must not exceed 100 characters',
  }),
  email: Joi.string().email().lowercase().trim().optional().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field (name or email) must be provided for update',
  });
