'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import { useBookings } from '@/hooks/useApi';
import { useStore } from '@/store/appStore';
import { Booking } from '@/types';
import { formatDate, formatPrice, getStatusBadgeClass } from '@/lib/utils';

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useStore();
  const { getMyBookings, cancelBooking } = useBookings();
  const { isLoading, error, setError } = useStore();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);

  // Redirect non-logged-in users
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Load bookings
  useEffect(() => {
    if (user?.role === 'RIDER') {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setError(null);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setLoadingBookingId(bookingId);
      setError(null);
      await cancelBooking(bookingId);
      setBookings(bookings.filter((b: Booking) => b.id !== bookingId));
      alert('Booking cancelled successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoadingBookingId(null);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Bookings</h2>
          <Button variant="primary" onClick={() => router.push('/search')}>
            Book a Ride
          </Button>
        </div>

        {error && <Alert message={error} onClose={() => setError(null)} />}

        {isLoading && <LoadingSpinner />}

        {!isLoading && bookings.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">You haven't booked any rides yet.</p>
              <Button variant="primary" onClick={() => router.push('/search')}>
                Search and Book a Ride
              </Button>
            </div>
          </Card>
        )}

        {!isLoading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking: Booking) => (
              <Card key={booking.id}>
                <div className="space-y-4">
                  {/* Trip Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.trip.origin} → {booking.trip.destination}
                    </h3>
                    <p className="text-sm text-gray-500">{formatDate(booking.trip.departureTime)}</p>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Seats</p>
                      <p className="text-lg font-semibold text-gray-800">{booking.seatsBooked}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Price</p>
                      <p className="text-lg font-semibold text-primary">{formatPrice(booking.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Status</p>
                      <p className={`mt-1 ${getStatusBadgeClass(booking.status)}`}>{booking.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Payment</p>
                      <p className={`mt-1 ${getStatusBadgeClass(booking.paymentStatus)}`}>{booking.paymentStatus}</p>
                    </div>
                  </div>

                  {/* Driver Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {booking.trip.driver.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{booking.trip.driver.name}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">
                          {booking.trip.driver.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (
                    <div className="pt-4 border-t">
                      <Button
                        variant="danger"
                        onClick={() => handleCancelBooking(booking.id)}
                        loading={loadingBookingId === booking.id}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  ) : booking.status === 'COMPLETED' ? (
                    <div className="pt-4 border-t">
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/review/${booking.id}`)}
                      >
                        Leave Review
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
