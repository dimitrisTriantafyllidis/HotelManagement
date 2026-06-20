import api from './api';
import { LoginDto, RegisterUserDto } from '../models/types';

export interface AuthResponse {
  token: string;
  expiresIn: number;
  roles: string[];
  fullName: string;
  email: string;
}

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/Auth/login', credentials);
  return response.data;
};

export const register = async (data: RegisterUserDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/Auth/register', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('roles');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');
};
