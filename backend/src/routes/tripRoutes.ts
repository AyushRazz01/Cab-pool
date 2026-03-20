// Trip routes

import { Router } from 'express';
import {
  handleCreateTrip,
  handleSearchTrips,
  handleGetTrip,
  handleGetDriverTrips,
  handleCancelTrip,
} from '../controllers/tripController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /trips
 * Create a new trip (driver only)
 */
router.post('/', authMiddleware, handleCreateTrip);

/**
 * GET /trips/search
 * Search trips with filters
 */
router.get('/search', handleSearchTrips);

/**
 * GET /trips/my-trips
 * Get driver's trips
 */
router.get('/my-trips', authMiddleware, handleGetDriverTrips);

/**
 * GET /trips/:tripId
 * Get trip by ID
 */
router.get('/:tripId', handleGetTrip);

/**
 * DELETE /trips/:tripId
 * Cancel trip (driver only)
 */
router.delete('/:tripId', authMiddleware, handleCancelTrip);

export default router;
