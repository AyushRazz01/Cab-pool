// Review routes

import { Router } from 'express';
import {
  handleCreateReview,
  handleGetUserReviews,
  handleGetReview,
} from '../controllers/reviewController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * POST /reviews
 * Create a review
 */
router.post('/', authMiddleware, handleCreateReview);

/**
 * GET /reviews/:reviewId
 * Get review by ID
 */
router.get('/:reviewId', handleGetReview);

/**
 * GET /reviews/user/:userId
 * Get reviews for a user
 */
router.get('/user/:userId', handleGetUserReviews);

export default router;
