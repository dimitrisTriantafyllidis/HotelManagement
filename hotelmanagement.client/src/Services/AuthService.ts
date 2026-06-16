import axios from 'axios';
import { LoginDto, RegisterUserDto } from '../models/types';

const API_BASE = 'http://localhost:5037/api';

// Global 401 interceptor: clear stale token and redirect to login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/Auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
      localStorage.removeItem('fullName');
      localStorage.removeItem('email');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  token: string;
  expiresIn: number;
  roles: string[];
  fullName: string;
  email: string;
}

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE}/Auth/login`, credentials);
  return response.data;
};

export const register = async (data: RegisterUserDto): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_BASE}/Auth/register`, data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');
};
