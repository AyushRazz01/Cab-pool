// Booking controller

import { Request, Response, NextFunction } from 'express';
import {
  createBooking,
  getBookingById,
  getBookingsByRider,
  getBookingsForTrip,
  confirmBooking,
  cancelBooking,
  completeBooking,
  processPayment,
} from '../services/bookingService';
import { handleError } from '../utils/errors';

/**
 * Create a booking
 */
export async function handleCreateBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { tripId, seatsBooked } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!tripId) {
      return res.status(400).json({ message: 'Trip ID is required' });
    }
    
    const booking = await createBooking(userId, tripId, seatsBooked || 1);
    res.status(201).json(booking);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get booking by ID
 */
export async function handleGetBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId } = req.params;
    
    const booking = await getBookingById(bookingId);
    res.json(booking);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get rider's bookings
 */
export async function handleGetMyBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const bookings = await getBookingsByRider(userId);
    res.json(bookings);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get bookings for a trip (driver view)
 */
export async function handleGetTripBookings(req: Request, res: Response, next: NextFunction) {
  try {
    const { tripId } = req.params;
    
    const bookings = await getBookingsForTrip(tripId);
    res.json(bookings);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Confirm a booking (driver action)
 */
export async function handleConfirmBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const booking = await confirmBooking(bookingId, userId);
    res.json(booking);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Cancel a booking
 */
export async function handleCancelBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    const { userRole } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const booking = await cancelBooking(bookingId, userId, userRole || 'RIDER');
    res.json(booking);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Complete a booking (driver action)
 */
export async function handleCompleteBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const booking = await completeBooking(bookingId, userId);
    res.json(booking);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Process payment
 */
export async function handleProcessPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const booking = await processPayment(bookingId);
    res.json(booking);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}
