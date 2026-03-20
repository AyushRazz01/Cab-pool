// Validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/\D/g, ''));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate OTP format (6 digits)
 */
export function isValidOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate rating (1-5)
 */
export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

/**
 * Validate trip seats
 */
export function isValidSeats(seats: number): boolean {
  return seats >= 1 && seats <= 6 && Number.isInteger(seats);
}
