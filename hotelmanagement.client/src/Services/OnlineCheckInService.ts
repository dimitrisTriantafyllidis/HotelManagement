import axios from 'axios';

const API_BASE = 'https://your-api-url.com/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCheckIn = async (id: string) => {
  const response = await axios.get(`${API_BASE}/CheckIn/${id}`, { headers: authHeader() });
  return response.data;
};

export const createCheckIn = async (data: any) => {
  const response = await axios.post(`${API_BASE}/CheckIn`, data);
  return response.data;
};

export const updateCheckIn = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE}/CheckIn/${id}`, data, { headers: authHeader() });
  return response.data;
};

export const deleteCheckIn = async (id: string) => {
  const response = await axios.delete(`${API_BASE}/CheckIn/${id}`, { headers: authHeader() });
  return response.data;
};