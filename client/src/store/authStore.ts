import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  displayName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  level: number;
  xp: number;
  totalImpact: number;
  location: string;
  website: string;
  github: string;
  twitter: string;
  linkedin: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  profile: UserProfile | null;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'dh-auth' }
  )
);
