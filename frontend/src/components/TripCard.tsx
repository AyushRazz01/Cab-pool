// Trip card component for listing trips

import { Trip } from '@/types';
import Card from './Card';
import { formatDate, formatPrice, getStatusBadgeClass } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  onBook?: () => void;
  showBookButton?: boolean;
}

export default function TripCard({ trip, onBook, showBookButton = true }: TripCardProps) {
  const seatsRemaining = trip.seatsAvailable - trip.seatsBooked;
  
  return (
    <Card onClick={onBook} className="hover:shadow-lg">
      <div className="space-y-3">
        {/* Route */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {trip.origin} → {trip.destination}
          </h3>
          <p className="text-sm text-gray-500">{formatDate(trip.departureTime)}</p>
        </div>

        {/* Driver info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
            {trip.driver.name[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{trip.driver.name}</p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-xs text-gray-600">{trip.driver.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-primary">{formatPrice(trip.pricePerSeat)}</p>
            <p className="text-xs text-gray-500">per seat</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {seatsRemaining} seats left
            </p>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(trip.seatsBooked / trip.seatsAvailable) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Book button */}
        {showBookButton && seatsRemaining > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook?.();
            }}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Book Now
          </button>
        )}

        {seatsRemaining === 0 && (
          <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-medium cursor-not-allowed">
            No Seats Available
          </button>
        )}
      </div>
    </Card>
  );
}
