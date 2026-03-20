// Review controller

import { Request, Response, NextFunction } from 'express';
import { createReview, getUserReviews, getReviewById } from '../services/reviewService';
import { handleError } from '../utils/errors';

/**
 * Create a review
 */
export async function handleCreateReview(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const { bookingId, rating, comment } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!bookingId || !rating) {
      return res.status(400).json({ message: 'Booking ID and rating are required' });
    }
    
    const review = await createReview(userId, bookingId, rating, comment);
    res.status(201).json(review);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get reviews for a user
 */
export async function handleGetUserReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    
    const reviews = await getUserReviews(userId);
    res.json(reviews);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}

/**
 * Get review by ID
 */
export async function handleGetReview(req: Request, res: Response, next: NextFunction) {
  try {
    const { reviewId } = req.params;
    
    const review = await getReviewById(reviewId);
    res.json(review);
  } catch (error) {
    const { statusCode, message } = handleError(error);
    res.status(statusCode).json({ message });
  }
}
