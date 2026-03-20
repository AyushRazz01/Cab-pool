// Custom hooks for API calls

import { useCallback } from 'react';
import apiClient from '@/lib/api';
import { useStore } from '@/store/appStore';

/**
 * Hook for OTP authentication
 */
export function useAuth() {
  const { setUser, setToken, setError, setLoading } = useStore();

  const sendOTP = useCallback(
    async (phone: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/send-otp', { phone });
        setLoading(false);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error sending OTP';
        setError(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading],
  );

  const checkUser = useCallback(
    async (phone: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/check-user', { phone });
        setLoading(false);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error checking user';
        setError(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading],
  );

  const verifyOTP = useCallback(
    async (phone: string, otp: string, name?: string, role?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/auth/verify-otp', {
          phone,
          otp,
          name,
          role: role || 'RIDER',
        });

        const { token, user } = response.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        setLoading(false);

        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error verifying OTP';
        setError(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading, setToken, setUser],
  );

  return { sendOTP, checkUser, verifyOTP };
}

/**
 * Hook for trip operations
 */
export function useTrips() {
  const { setError, setLoading } = useStore();

  const createTrip = useCallback(
    async (tripData: any) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/trips', tripData);
        setLoading(false);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error creating trip';
        setError(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading],
  );

  const searchTrips = useCallback(
    async (filters?: any) => {
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters?.origin) params.append('origin', filters.origin);
        if (filters?.destination) params.append('destination', filters.destination);
        if (filters?.date) params.append('date', filters.date);

        const response = await apiClient.get(`/trips/search?${params.toString()}`);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error searching trips';
        setError(message);
        throw error;
      }
    },
    [setError],
  );

  const getTripById = useCallback(async (tripId: string) => {
    try {
      const response = await apiClient.get(`/trips/${tripId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching trip';
      setError(message);
      throw error;
    }
  }, [setError]);

  const getMyTrips = useCallback(async () => {
    setError(null);
    try {
      const response = await apiClient.get('/trips/my-trips');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching your trips';
      setError(message);
      throw error;
    }
  }, [setError]);

  return { createTrip, searchTrips, getTripById, getMyTrips };
}

/**
 * Hook for booking operations
 */
export function useBookings() {
  const { setError, setLoading } = useStore();

  const createBooking = useCallback(
    async (tripId: string, seatsBooked: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post('/bookings', {
          tripId,
          seatsBooked,
        });
        setLoading(false);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error booking trip';
        setError(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading],
  );

  const getMyBookings = useCallback(async () => {
    setError(null);
    try {
      const response = await apiClient.get('/bookings/my-bookings');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error fetching bookings';
      setError(message);
      throw error;
    }
  }, [setError]);

  const cancelBooking = useCallback(
    async (bookingId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.patch(`/bookings/${bookingId}/cancel`, {
          userRole: 'RIDER',
        });
        setLoading(false);
        return response.data;
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error cancelling booking';
        setError(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading],
  );

  return { createBooking, getMyBookings, cancelBooking };
}
