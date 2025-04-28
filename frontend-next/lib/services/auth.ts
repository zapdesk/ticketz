import axios from 'axios';
import { User, LoginCredentials, AuthResponse } from '../types/user';
import { toast } from 'react-toastify';
import { usersService } from '@/lib/services/users';
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Only try to get token in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Only attempt token refresh in browser environment
    if (typeof window !== 'undefined' && error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post('/auth/refresh_token');
        if (data) {
          localStorage.setItem('token', data.token);
          api.defaults.headers.Authorization = `Bearer ${data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }

    // Handle unauthorized in browser environment
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('companyId');
      localStorage.removeItem('userId');
      localStorage.removeItem('cshow');
      api.defaults.headers.Authorization = null;
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', credentials);

      
      // Only store auth data in browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('companyId', data.user.companyId);
        localStorage.setItem('userId', data.user.id);
       
        // Set default auth header
        api.defaults.headers.Authorization = `Bearer ${data.token}`;

        // Show success message
        toast.success('Login successful');
      }

      return data;
    } catch (error: any) {
      // Show error message
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.delete('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Only clear auth data in browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('companyId');
        localStorage.removeItem('userId');
        localStorage.removeItem('cshow');
        localStorage.removeItem('name');
        api.defaults.headers.Authorization = null;
      }
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // Only attempt to get token in browser environment
      if (typeof window === 'undefined') return null;
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        return null;
      }

      // Set the token in headers before making the request
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      const { data } = await api.get<User>('/auth/me');
     
      if (!data) {
        console.log('No user data returned from /auth/me');
        return null;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching current user:', error.response?.data || error.message);
      // If unauthorized, clear storage
      if (error.response?.status === 401) {
        this.logout();
      }
      return null;
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const { data } = await api.post('/auth/refresh_token');
      if (data && typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        api.defaults.headers.Authorization = `Bearer ${data.token}`;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();

// Export the api instance to be used by other services
export { api }; 