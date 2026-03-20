'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import TripCard from '@/components/TripCard';
import { useTrips } from '@/hooks/useApi';
import { useStore } from '@/store/appStore';
import { Trip } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';

export default function TripsPage() {
  const router = useRouter();
  const { user } = useStore();
  const { getMyTrips } = useTrips();
  const { isLoading, error, setError } = useStore();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Redirect non-drivers
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role !== 'DRIVER') {
      router.push('/search');
    }
  }, [user, router]);

  // Load trips
  useEffect(() => {
    if (user?.role === 'DRIVER') {
      loadTrips();
    }
  }, [user]);

  const loadTrips = async () => {
    try {
      setError(null);
      const data = await getMyTrips();
      setTrips(data);
    } catch (err) {
      setError('Failed to load trips');
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Trips</h2>
          <Button variant="primary" onClick={() => router.push('/create-trip')}>
            + Create Trip
          </Button>
        </div>

        {error && <Alert message={error} onClose={() => setError(null)} />}

        {isLoading && <LoadingSpinner />}

        {!isLoading && trips.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">You haven't created any trips yet.</p>
              <Button variant="primary" onClick={() => router.push('/create-trip')}>
                Create Your First Trip
              </Button>
            </div>
          </Card>
        )}

        {!isLoading && trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onBook={() => setSelectedTrip(trip)}
                showBookButton={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedTrip.origin} → {selectedTrip.destination}
                </h3>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Departure</p>
                    <p className="text-lg font-semibold text-gray-800">{formatDate(selectedTrip.departureTime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Price per seat</p>
                    <p className="text-lg font-semibold text-primary">{formatPrice(selectedTrip.pricePerSeat)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Total seats</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedTrip.seatsAvailable}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Booked</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {selectedTrip.seatsBooked}/{selectedTrip.seatsAvailable}
                    </p>
                  </div>
                </div>

                {selectedTrip.description && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 uppercase">Description</p>
                    <p className="text-gray-800">{selectedTrip.description}</p>
                  </div>
                )}

                {/* Bookings List */}
                {selectedTrip.bookings.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-800 mb-4">Bookings ({selectedTrip.bookings.length})</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedTrip.bookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-100 p-3 rounded-lg">
                          <p className="font-medium text-gray-800">{booking.rider.name}</p>
                          <div className="flex items-center justify-between mt-1 text-sm text-gray-600">
                            <span>{booking.seatsBooked} seats</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button variant="primary" full onClick={() => setSelectedTrip(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
