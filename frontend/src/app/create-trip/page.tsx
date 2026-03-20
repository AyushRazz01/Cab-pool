'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';
import { useTrips } from '@/hooks/useApi';
import { useStore } from '@/store/appStore';

export default function CreateTripPage() {
  const router = useRouter();
  const { user } = useStore();
  const { createTrip } = useTrips();
  const { isLoading, error, setError } = useStore();

  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    seatsAvailable: 4,
    pricePerSeat: 100,
    description: '',
  });

  // Redirect non-drivers
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (user?.role !== 'DRIVER') {
      router.push('/search');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'seatsAvailable' || name === 'pricePerSeat' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.origin || !formData.destination || !formData.departureTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await createTrip({
        ...formData,
        originLat: Math.random() * 180 - 90, // Mock coordinates
        originLng: Math.random() * 360 - 180,
        destLat: Math.random() * 180 - 90,
        destLng: Math.random() * 360 - 180,
      });

      alert('Trip created successfully!');
      router.push('/trips');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip');
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Trip</h2>

          {error && <Alert message={error} onClose={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Origin and Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="e.g., Mumbai"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                label="Pickup Location"
                required
              />
              <Input
                placeholder="e.g., Pune"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                label="Destination"
                required
              />
            </div>

            {/* Date and Time */}
            <Input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              label="Departure Time"
              required
            />

            {/* Seats and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Seats: {formData.seatsAvailable}
                </label>
                <input
                  type="range"
                  name="seatsAvailable"
                  min="1"
                  max="6"
                  value={formData.seatsAvailable}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <Input
                type="number"
                placeholder="Price per seat in ₹"
                name="pricePerSeat"
                value={formData.pricePerSeat.toString()}
                onChange={handleChange}
                label="Price Per Seat"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trip Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Non-smoking vehicle, AC available..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                full
                loading={isLoading}
              >
                Create Trip
              </Button>
              <Button
                type="button"
                variant="secondary"
                full
                onClick={() => router.push('/trips')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
