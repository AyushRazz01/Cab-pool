// Socket.io event handlers for real-time updates

import { Server } from 'socket.io';


export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: any) => {
    console.log(`User connected: ${socket.id}`);
    
    // Join user's personal room for notifications
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined their room`);
    });
    
    // Join trip room to receive updates
    socket.on('join-trip-room', (tripId: string) => {
      socket.join(`trip-${tripId}`);
      console.log(`User joined trip room: ${tripId}`);
    });
    
    // Leave trip room
    socket.on('leave-trip-room', (tripId: string) => {
      socket.leave(`trip-${tripId}`);
      console.log(`User left trip room: ${tripId}`);
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}

/**
 * Emit event when a new trip is created
 */
export function emitTripCreated(io: Server, trip: any) {
  io.emit('trip-created', {
    id: trip.id,
    origin: trip.origin,
    destination: trip.destination,
    departureTime: trip.departureTime,
    pricePerSeat: trip.pricePerSeat,
  });
}

/**
 * Emit event when booking status changes
 */
export function emitBookingStatusChanged(
  io: Server,
  tripId: string,
  booking: any,
) {
  io.to(`trip-${tripId}`).emit('booking-status-changed', {
    bookingId: booking.id,
    tripId: booking.tripId,
    status: booking.status,
    seatsBooked: booking.seatsBooked,
  });
}

/**
 * Emit seat availability update
 */
export function emitSeatsUpdated(
  io: Server,
  tripId: string,
  seatsBooked: number,
  seatsAvailable: number,
) {
  io.to(`trip-${tripId}`).emit('seats-updated', {
    tripId,
    seatsBooked,
    seatsAvailable,
    seatsRemaining: seatsAvailable - seatsBooked,
  });
}

/**
 * Send notification to a specific user
 */
export function sendUserNotification(
  io: Server,
  userId: string,
  notification: any,
) {
  io.to(`user-${userId}`).emit('notification', notification);
}
