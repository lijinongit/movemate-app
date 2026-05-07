import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { User, AuthToken } from '../types/models';

interface AuthStoreState {
  user: User | null;
  tokens: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthToken | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

const authStorage = createJSONStorage<AuthStoreState['user'] | AuthStoreState['tokens']>(
  () => ({
    getItem: async (key: string): Promise<string | null> => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error(`SecureStore getItem error for ${key}:`, error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.error(`SecureStore setItem error for ${key}:`, error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error(`SecureStore removeItem error for ${key}:`, error);
      }
    },
  })
);

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => {
        set({ user, isAuthenticated: user !== null });
      },

      setTokens: (tokens) => {
        set({ tokens });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync('auth_tokens');
          await SecureStore.deleteItemAsync('auth_user');
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: 'Failed to logout' });
        }
      },

      initialize: async () => {
        try {
          set({ isLoading: true });
          const storedUser = await SecureStore.getItemAsync('auth_user');
          const storedTokens = await SecureStore.getItemAsync('auth_tokens');

          if (storedUser && storedTokens) {
            set({
              user: JSON.parse(storedUser),
              tokens: JSON.parse(storedTokens),
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: authStorage,
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
