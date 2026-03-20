// Type definitions

export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'DRIVER' | 'RIDER';
  avatar?: string;
  rating: number;
}

export interface Trip {
  id: string;
  driverId: string;
  driver: User;
  origin: string;
  destination: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  departureTime: string | Date;
  seatsAvailable: number;
  seatsBooked: number;
  pricePerSeat: number;
  description?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  bookings: Booking[];
}

export interface Booking {
  id: string;
  tripId: string;
  trip: Trip;
  riderId: string;
  rider: User;
  seatsBooked: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: number;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string | Date;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  rating: number;
  comment?: string;
  createdAt: string | Date;
}
