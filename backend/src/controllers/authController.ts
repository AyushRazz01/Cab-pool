// Auth controller

import { Request, Response, NextFunction } from 'express';
import { sendOTP, checkUserExists, verifyOTPAndLogin, getUserById, updateUserProfile } from '../services/authService';
import { handleError } from '../utils/errors';

/**
 * Send OTP to phone
 */
export async function handleSendOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    const result = await sendOTP(phone);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Check if user exists with this phone
 */
export async function handleCheckUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    const result = await checkUserExists(phone);
    res.json(result);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Verify OTP and login
 */
export async function handleVerifyOTP(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone, otp, name, role } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }
    
    const userRole = role && (role === 'DRIVER' || role === 'RIDER') ? role : 'RIDER';
    const result = await verifyOTPAndLogin(phone, otp, name, userRole);
    
    res.json(result);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get current user profile
 */
export async function handleGetProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await getUserById(userId);
    res.json(user);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Update user profile
 */
export async function handleUpdateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { name, role, avatar } = req.body;
    const user = await updateUserProfile(userId, { name, role, avatar });
    
    res.json(user);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}
