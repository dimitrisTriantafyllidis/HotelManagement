import axios from 'axios';
import { AuthResponseDto, LoginDto } from '../models/types';

const API_BASE = 'https://localhost:7210/api';

export const login = async (credentials: LoginDto): Promise<AuthResponseDto> => {
  const response = await axios.post<AuthResponseDto>(`${API_BASE}/Auth/login`, credentials);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};