// Error handling middleware

import { Request, Response, NextFunction } from 'express';
import { AppError, handleError } from '../utils/errors';

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { statusCode, message } = handleError(error);
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

/**
 * Middleware to handle 404 errors
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new AppError(404, `Route not found: ${req.originalUrl}`);
  next(error);
}
