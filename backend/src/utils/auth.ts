// Utility functions for authentication and OTP
import { Response } from 'express';

// Mock OTP storage (in production, use Redis or database)
const otpStore: { [key: string]: { code: string; expiresAt: number } } = {};

/**
 * Generate a mock OTP for the phone number
 */
export function generateOTP(phone: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore[phone] = { code, expiresAt };
  
  console.log(`[MOCK OTP] Phone: ${phone}, Code: ${code}`); // Log for testing
  return code;
}

/**
 * Verify OTP for the phone number
 */
export function verifyOTP(phone: string, code: string): boolean {
  const stored = otpStore[phone];
  
  console.log(`[OTP Verification] Phone: ${phone}, Provided: ${code}, Stored: ${stored?.code || 'NOT_FOUND'}`);
  
  if (!stored) {
    console.log(`[OTP Error] No OTP found for phone: ${phone}`);
    return false;
  }
  
  if (Date.now() > stored.expiresAt) {
    console.log(`[OTP Error] OTP expired for phone: ${phone}`);
    delete otpStore[phone];
    return false;
  }
  
  if (stored.code !== code) {
    console.log(`[OTP Error] OTP mismatch for phone: ${phone}. Expected: ${stored.code}, Got: ${code}`);
    return false;
  }
  
  console.log(`[OTP Success] OTP verified for phone: ${phone}`);
  delete otpStore[phone];
  return true;
}

/**
 * Generate JWT token (mock implementation)
 */
export function generateToken(userId: string): string {
  // In production, use jsonwebtoken package
  const payload = {
    userId,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Verify JWT token (mock implementation)
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    
    if (payload.exp < Date.now()) {
      return null;
    }
    
    return { userId: payload.userId };
  } catch (error) {
    return null;
  }
}
