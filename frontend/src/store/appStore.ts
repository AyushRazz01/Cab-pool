// Zustand store for authentication and app state

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: 'DRIVER' | 'RIDER';
  avatar?: string;
  rating?: number;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
);
