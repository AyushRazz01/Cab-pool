// Trip service

import { PrismaClient } from '@prisma/client';
import { isValidSeats } from '../utils/validation';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a new trip
 */
export async function createTrip(driverId: string, tripData: {
  origin: string;
  destination: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  departureTime: Date;
  seatsAvailable: number;
  pricePerSeat: number;
  description?: string;
}) {
  if (!isValidSeats(tripData.seatsAvailable)) {
    throw new AppError(400, 'Seats must be between 1 and 6');
  }
  
  const trip = await prisma.trip.create({
    data: {
      ...tripData,
      driverId,
      seatsBooked: 0,
    },
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
  });
  
  return trip;
}

/**
 * Get all trips (with optional filters)
 */
export async function getTrips(filters?: {
  origin?: string;
  destination?: string;
  date?: Date;
  minPrice?: number;
  maxPrice?: number;
}) {
  const where: any = {
    status: 'ACTIVE',
    seatsBooked: { lt: prisma.trip.fields.seatsAvailable },
  };
  
  if (filters?.origin) {
    where.origin = {
      contains: filters.origin,
      mode: 'insensitive',
    };
  }
  
  if (filters?.destination) {
    where.destination = {
      contains: filters.destination,
      mode: 'insensitive',
    };
  }
  
  if (filters?.date) {
    const dayStart = new Date(filters.date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(filters.date);
    dayEnd.setHours(23, 59, 59, 999);
    
    where.departureTime = {
      gte: dayStart,
      lte: dayEnd,
    };
  }
  
  if (filters?.minPrice !== undefined) {
    where.pricePerSeat = { gte: filters.minPrice };
  }
  
  if (filters?.maxPrice !== undefined) {
    where.pricePerSeat = { ...where.pricePerSeat, lte: filters.maxPrice };
  }
  
  const trips = await prisma.trip.findMany({
    where,
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
      bookings: {
        select: { id: true, status: true },
      },
    },
    orderBy: { departureTime: 'asc' },
  });
  
  return trips;
}

/**
 * Get trip by ID
 */
export async function getTripById(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
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
      bookings: {
        select: {
          id: true,
          rider: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          status: true,
          seatsBooked: true,
        },
      },
    },
  });
  
  if (!trip) {
    throw new AppError(404, 'Trip not found');
  }
  
  return trip;
}

/**
 * Get trips by driver
 */
export async function getTripsByDriver(driverId: string) {
  const trips = await prisma.trip.findMany({
    where: { driverId },
    include: {
      bookings: {
        select: {
          id: true,
          rider: {
            select: {
              id: true,
              name: true,
              phone: true,
              avatar: true,
            },
          },
          status: true,
          seatsBooked: true,
        },
      },
    },
    orderBy: { departureTime: 'desc' },
  });
  
  return trips;
}

/**
 * Cancel a trip
 */
export async function cancelTrip(tripId: string, driverId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });
  
  if (!trip) {
    throw new AppError(404, 'Trip not found');
  }
  
  if (trip.driverId !== driverId) {
    throw new AppError(403, 'Only the driver can cancel this trip');
  }
  
  const updatedTrip = await prisma.trip.update({
    where: { id: tripId },
    data: { status: 'CANCELLED' },
  });
  
  return updatedTrip;
}
