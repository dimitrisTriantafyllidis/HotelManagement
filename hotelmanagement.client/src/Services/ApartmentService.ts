import axios from 'axios';

const API_BASE = 'https://localhost:7210/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getApartments = async () => {
  const response = await axios.get(`${API_BASE}/Apartments`, { headers: authHeader() });
  return response.data;
};

export const getApartment = async (id: string) => {
  const response = await axios.get(`${API_BASE}/Apartments/${id}`, { headers: authHeader() });
  return response.data;
};

export const createApartment = async (data: any) => {
  const response = await axios.post(`${API_BASE}/Apartments`, data, { headers: authHeader() });
  return response.data;
};

export const updateApartment = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE}/Apartments/${id}`, data, { headers: authHeader() });
  return response.data;
};

export const deleteApartment = async (id: string) => {
  const response = await axios.delete(`${API_BASE}/Apartments/${id}`, { headers: authHeader() });
  return response.data;
};
