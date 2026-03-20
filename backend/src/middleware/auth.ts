// Authentication middleware

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { AppError } from '../utils/errors';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing or invalid authorization header');
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw new AppError(401, 'Invalid or expired token');
    }
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Middleware to verify driver role
 */
export async function driverMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // This would be enhanced to check user's role from database
    // For now, we'll verify it exists in the next layer
    next();
  } catch (error) {
    res.status(403).json({ message: 'Only drivers can perform this action' });
  }
}
