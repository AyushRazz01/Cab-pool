// Trip controller

import { Request, Response, NextFunction } from 'express';
import { 
  createTrip, 
  getTrips, 
  getTripById, 
  getTripsByDriver,
  cancelTrip 
} from '../services/tripService';
import { handleError } from '../utils/errors';

/**
 * Create a new trip
 */
export async function handleCreateTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const {
      origin,
      destination,
      originLat,
      originLng,
      destLat,
      destLng,
      departureTime,
      seatsAvailable,
      pricePerSeat,
      description,
    } = req.body;
    
    // Validate required fields
    if (!origin || !destination || !departureTime || !seatsAvailable || !pricePerSeat) {
      return res.status(400).json({ 
        message: 'Missing required fields: origin, destination, departureTime, seatsAvailable, pricePerSeat' 
      });
    }
    
    const trip = await createTrip(userId, {
      origin,
      destination,
      originLat: originLat || 0,
      originLng: originLng || 0,
      destLat: destLat || 0,
      destLng: destLng || 0,
      departureTime: new Date(departureTime),
      seatsAvailable: parseInt(seatsAvailable),
      pricePerSeat: parseFloat(pricePerSeat),
      description,
    });
    
    res.status(201).json(trip);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Search trips
 */
export async function handleSearchTrips(req: Request, res: Response, next: NextFunction) {
  try {
    const { origin, destination, date, minPrice, maxPrice } = req.query;
    
    const filters: any = {};
    if (origin) filters.origin = String(origin);
    if (destination) filters.destination = String(destination);
    if (date) filters.date = new Date(String(date));
    if (minPrice) filters.minPrice = parseFloat(String(minPrice));
    if (maxPrice) filters.maxPrice = parseFloat(String(maxPrice));
    
    const trips = await getTrips(filters);
    res.json(trips);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get trip by ID
 */
export async function handleGetTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const { tripId } = req.params;
    
    const trip = await getTripById(tripId);
    res.json(trip);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get driver's trips
 */
export async function handleGetDriverTrips(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const trips = await getTripsByDriver(userId);
    res.json(trips);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Cancel trip
 */
export async function handleCancelTrip(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { tripId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const trip = await cancelTrip(tripId, userId);
    res.json(trip);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}
