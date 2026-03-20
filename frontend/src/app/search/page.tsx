'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import { useTrips, useBookings } from '@/hooks/useApi';
import { useStore } from '@/store/appStore';
import { Trip } from '@/types';

export default function SearchPage() {
  const router = useRouter();
  const { user } = useStore();
  const { searchTrips, getTripById } = useTrips();
  const { createBooking } = useBookings();
  const { isLoading, error, setError } = useStore();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  // Redirect non-logged-in users
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }

    if (user?.role === 'DRIVER') {
      router.push('/trips');
    }
  }, [user, router]);

  // Search trips
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const filters: any = {};
      if (origin) filters.origin = origin;
      if (destination) filters.destination = destination;
      if (date) filters.date = date;

      const results = await searchTrips(filters);
      setTrips(results);
    } catch (err) {
      setError('Failed to search trips. Please try again.');
    }
  };

  // Handle booking
  const handleBook = async (tripId: string) => {
    try {
      setIsBooking(true);
      setError(null);
      await createBooking(tripId);
      setSelectedTrip(null);
      setError('');
      // Show success message and refresh
      alert('Booking successful! Redirecting to bookings...');
      router.push('/bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book trip');
    } finally {
      setIsBooking(false);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Rides</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="From (e.g., Mumbai)"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                label="Origin"
              />
              <Input
                placeholder="To (e.g., Pune)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                label="Destination"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                label="Date"
              />
              <div className="flex items-end">
                <Button type="submit" variant="primary" full loading={isLoading}>
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && <Alert message={error} onClose={() => setError(null)} />}

        {/* Results */}
        <div>
          {isLoading && <LoadingSpinner />}

          {!isLoading && trips.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {origin || destination ? 'No trips found. Try different filters.' : 'Search for trips to get started'}
              </p>
            </div>
          )}

          {!isLoading && trips.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {trips.length} trip{trips.length !== 1 ? 's' : ''} found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onBook={() => handleBook(trip.id)}
                    showBookButton={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
