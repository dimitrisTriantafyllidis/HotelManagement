import axios from 'axios';

const API_BASE = 'https://your-api-url.com/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUsers = async () => {
  const response = await axios.get(`${API_BASE}/Users`, { headers: authHeader() });
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await axios.get(`${API_BASE}/Users/${id}`, { headers: authHeader() });
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await axios.post(`${API_BASE}/Users/register`, data, { headers: authHeader() });
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE}/Users/${id}`, data, { headers: authHeader() });
  return response.data;
};