import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { rateLimitMiddleware } from '../middleware/rateLimiter.middleware';
import { validateBody, validateParams } from '../middleware/validation.middleware';
import { createUserSchema, getUserByIdSchema } from '../validation/user.validation';

const router = Router();

router.get('/', userController.getAllUsers.bind(userController));
router.get(
  '/:id',
  validateParams(getUserByIdSchema),
  rateLimitMiddleware,
  asyncHandler(userController.getUserById.bind(userController))
);
router.post(
  '/',
  validateBody(createUserSchema),
  rateLimitMiddleware,
  userController.createUser.bind(userController)
);

export default router;
