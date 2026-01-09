import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncFunction): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
