// Review service

import { PrismaClient } from '@prisma/client';
import { isValidRating } from '../utils/validation';
import { AppError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a review
 */
export async function createReview(
  reviewerId: string,
  bookingId: string,
  rating: number,
  comment?: string,
) {
  if (!isValidRating(rating)) {
    throw new AppError(400, 'Rating must be between 1 and 5');
  }
  
  // Get booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });
  
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }
  
  // Check if reviewer is part of the booking
  const isRevieweeDriver = booking.riderId === reviewerId;
  if (!isRevieweeDriver && booking.riderId !== reviewerId) {
    // Get trip to check if reviewer is driver
    const trip = await prisma.trip.findUnique({
      where: { id: booking.tripId },
    });
    
    if (!trip || trip.driverId !== reviewerId) {
      throw new AppError(403, 'You can only review users from your bookings');
    }
  }
  
  // Determine reviewee
  const trip = await prisma.trip.findUnique({
    where: { id: booking.tripId },
  });
  
  if (!trip) {
    throw new AppError(404, 'Trip not found');
  }
  
  const revieweeId = trip.driverId === reviewerId ? booking.riderId : trip.driverId;
  
  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });
  
  if (existingReview) {
    throw new AppError(400, 'Review already exists for this booking');
  }
  
  // Create review
  const review = await prisma.review.create({
    data: {
      bookingId,
      reviewerId,
      revieweeId,
      rating,
      comment,
    },
  });
  
  // Update reviewee's average rating
  const allReviews = await prisma.review.findMany({
    where: { revieweeId },
  });
  
  const avgRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
  
  await prisma.user.update({
    where: { id: revieweeId },
    data: { rating: avgRating },
  });
  
  return review;
}

/**
 * Get reviews for a user
 */
export async function getUserReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { revieweeId: userId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  return reviews;
}

/**
 * Get review by ID
 */
export async function getReviewById(reviewId: string) {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      reviewer: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      reviewee: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  
  if (!review) {
    throw new AppError(404, 'Review not found');
  }
  
  return review;
}
