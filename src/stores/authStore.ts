import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure isAuthenticated is properly set based on token presence
        if (state && state.token && !state.isAuthenticated) {
          state.isAuthenticated = true;
        }
        // If we have a token but no user, we should still consider it authenticated
        // This handles cases where the user data might be missing but token exists
        if (state && state.token && state.isAuthenticated && !state.user) {
          // Try to get user data from token or set a minimal user object
          // For now, we'll keep the current behavior but log a warning
          console.warn(
            "Token exists but no user data found during rehydration"
          );
        }
      },
    }
  )
);
