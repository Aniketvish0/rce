import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      
      register: async (username, email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
            username,
            email,
            password,
          });
          set({ 
            token: response.data.token,
            user: response.data.user,
            loading: false,
          });
        } catch (error) {
          const errorMessage = 
            axios.isAxiosError(error) && error.response 
              ? error.response.data.message 
              : 'Registration failed';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },
      
      login: async (email, password) => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
            email,
            password,
          });
          set({ 
            token: response.data.token,
            user: response.data.user,
            loading: false,
          });
        } catch (error) {
          const errorMessage = 
            axios.isAxiosError(error) && error.response 
              ? error.response.data.message 
              : 'Login failed';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },
      
      logout: () => {
        set({ token: null, user: null });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);