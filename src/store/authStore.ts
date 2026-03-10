import { create } from 'zustand';
import type { Profile } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: Profile | null;
  setAuthenticated: (profile: Profile) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  profile: null,
  setAuthenticated: (profile) =>
    set({ isAuthenticated: true, isLoading: false, profile }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({ isAuthenticated: false, isLoading: false, profile: null }),
}));
