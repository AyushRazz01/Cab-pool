// Authentication service

import { PrismaClient } from '@prisma/client';
import { generateOTP, verifyOTP, generateToken } from '../utils/auth';
import { isValidPhone } from '../utils/validation';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Send OTP to phone number
 */
export async function sendOTP(phone: string) {
  if (!isValidPhone(phone)) {
    throw new AppError(400, 'Invalid phone number');
  }
  
  const otp = generateOTP(phone);
  
  // In production, send via SMS gateway (Twilio, AWS SNS, etc.)
  console.log(`[MOCK SMS] Sent OTP ${otp} to ${phone}`);
  
  return {
    success: true,
    message: 'OTP sent successfully',
    // Remove in production - only for testing
    mockOTP: process.env.NODE_ENV === 'development' ? otp : undefined,
  };
}

/**
 * Check if user exists and return their status
 */
export async function checkUserExists(phone: string) {
  if (!isValidPhone(phone)) {
    throw new AppError(400, 'Invalid phone number');
  }
  
  const user = await prisma.user.findUnique({
    where: { phone },
  });
  
  return {
    exists: !!user,
    user: user ? {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    } : null,
  };
}

/**
 * Verify OTP and authenticate user
 */
export async function verifyOTPAndLogin(phone: string, otp: string, name?: string, role: string = 'RIDER') {
  if (!isValidPhone(phone)) {
    throw new AppError(400, 'Invalid phone number');
  }
  
  if (!verifyOTP(phone, otp)) {
    throw new AppError(400, 'Invalid or expired OTP');
  }
  
  // Find or create user
  let user = await prisma.user.findUnique({
    where: { phone },
  });
  
  if (!user) {
    if (!name) {
      throw new AppError(400, 'Name is required for new users');
    }
    
    user = await prisma.user.create({
      data: {
        phone,
        name,
        role,
      },
    });
  }
  
  // Generate token
  const token = generateToken(user.id);
  
  return {
    token,
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  
  return user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: { name?: string; role?: string; avatar?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  
  return user;
}
