// Auth routes

import { Router } from 'express';
import {
  handleSendOTP,
  handleCheckUser,
  handleVerifyOTP,
  handleGetProfile,
  handleUpdateProfile,
} from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /auth/send-otp
 * Send OTP to phone number
 */
router.post('/send-otp', handleSendOTP);

/**
 * POST /auth/check-user
 * Check if user exists with this phone
 */
router.post('/check-user', handleCheckUser);

/**
 * POST /auth/verify-otp
 * Verify OTP and login
 */
router.post('/verify-otp', handleVerifyOTP);

/**
 * GET /auth/profile
 * Get current user profile
 */
router.get('/profile', authMiddleware, handleGetProfile);

/**
 * PUT /auth/profile
 * Update user profile
 */
router.put('/profile', authMiddleware, handleUpdateProfile);

export default router;
