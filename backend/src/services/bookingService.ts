// Booking service

import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a booking
 */
export async function createBooking(riderId: string, tripId: string, seatsBooked: number = 1) {
  // Validate trip exists and has available seats
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });
  
  if (!trip) {
    throw new AppError(404, 'Trip not found');
  }
  
  if (trip.seatsBooked + seatsBooked > trip.seatsAvailable) {
    throw new AppError(400, 'Not enough seats available');
  }
  
  // Check if rider already booked this trip
  const existingBooking = await prisma.booking.findUnique({
    where: {
      tripId_riderId: {
        tripId,
        riderId,
      },
    },
  });
  
  if (existingBooking) {
    throw new AppError(400, 'You have already booked this trip');
  }
  
  // Create booking
  const booking = await prisma.booking.create({
    data: {
      tripId,
      riderId,
      seatsBooked,
      totalPrice: seatsBooked * trip.pricePerSeat,
      status: 'PENDING',
    },
  });
  
  // Update trip seats
  await prisma.trip.update({
    where: { id: tripId },
    data: { seatsBooked: { increment: seatsBooked } },
  });
  
  return booking;
}

/**
 * Get booking by ID
 */
export async function getBookingById(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      trip: {
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
              rating: true,
            },
          },
        },
      },
      rider: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  
  return booking;
}

/**
 * Get bookings by rider
 */
export async function getBookingsByRider(riderId: string) {
  const bookings = await prisma.booking.findMany({
    where: { riderId },
    include: {
      trip: {
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
              rating: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return bookings;
}

/**
 * Get bookings for a trip (for driver)
 */
export async function getBookingsForTrip(tripId: string) {
  const bookings = await prisma.booking.findMany({
    where: { tripId },
    include: {
      rider: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
          rating: true,
        },
      },
    },
  });
  
  return bookings;
}

/**
 * Confirm a booking (driver action)
 */
export async function confirmBooking(bookingId: string, driverId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: true },
  });
  
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  
  if (booking.trip.driverId !== driverId) {
    throw new AppError(403, 'Only the driver can confirm this booking');
  }
  
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' },
  });
  
  return updated;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string, userId: string, userRole: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: true },
  });
  
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  
  // Check permissions
  if (userRole === 'DRIVER') {
    if (booking.trip.driverId !== userId) {
      throw new AppError(403, 'Unauthorized');
    }
  } else {
    if (booking.riderId !== userId) {
      throw new AppError(403, 'Unauthorized');
    }
  }
  
  // Update booking
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  });
  
  // Refund seats
  await prisma.trip.update({
    where: { id: booking.tripId },
    data: { seatsBooked: { decrement: booking.seatsBooked } },
  });
  
  return updated;
}

/**
 * Complete a booking
 */
export async function completeBooking(bookingId: string, driverId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: true },
  });
  
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  
  if (booking.trip.driverId !== driverId) {
    throw new AppError(403, 'Only the driver can complete this booking');
  }
  
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'COMPLETED' },
  });
  
  return updated;
}

/**
 * Process payment (mock)
 */
export async function processPayment(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  
  // Simulate payment processing
  const success = Math.random() > 0.05; // 95% success rate for mock
  
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: success ? 'COMPLETED' : 'FAILED',
    },
  });
  
  return updated;
}
