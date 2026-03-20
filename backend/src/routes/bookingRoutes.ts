// Booking routes

import { Router } from 'express';
import {
  handleCreateBooking,
  handleGetBooking,
  handleGetMyBookings,
  handleGetTripBookings,
  handleConfirmBooking,
  handleCancelBooking,
  handleCompleteBooking,
  handleProcessPayment,
} from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /bookings
 * Create a booking
 */
router.post('/', authMiddleware, handleCreateBooking);

/**
 * GET /bookings/my-bookings
 * Get rider's bookings
 */
router.get('/my-bookings', authMiddleware, handleGetMyBookings);

/**
 * GET /bookings/:bookingId
 * Get booking by ID
 */
router.get('/:bookingId', handleGetBooking);

/**
 * GET /bookings/trip/:tripId
 * Get bookings for a trip (driver view)
 */
router.get('/trip/:tripId', authMiddleware, handleGetTripBookings);

/**
 * PATCH /bookings/:bookingId/confirm
 * Confirm a booking (driver only)
 */
router.patch('/:bookingId/confirm', authMiddleware, handleConfirmBooking);

/**
 * PATCH /bookings/:bookingId/cancel
 * Cancel a booking
 */
router.patch('/:bookingId/cancel', authMiddleware, handleCancelBooking);

/**
 * PATCH /bookings/:bookingId/complete
 * Complete a booking (driver only)
 */
router.patch('/:bookingId/complete', authMiddleware, handleCompleteBooking);

/**
 * POST /bookings/:bookingId/payment
 * Process payment
 */
router.post('/:bookingId/payment', authMiddleware, handleProcessPayment);

export default router;
