import axios from 'axios';
import { ApartmentPhotoDto } from '../models/types';

const API_BASE = 'http://localhost:5037/api';

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

// Photo endpoints
export const uploadApartmentPhotos = async (apartmentId: string, files: File[]): Promise<ApartmentPhotoDto[]> => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const response = await axios.post(`${API_BASE}/Apartments/${apartmentId}/photos`, formData, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getApartmentPhotos = async (apartmentId: string): Promise<ApartmentPhotoDto[]> => {
  const response = await axios.get(`${API_BASE}/Apartments/${apartmentId}/photos`, { headers: authHeader() });
  return response.data;
};

export const deleteApartmentPhoto = async (apartmentId: string, photoId: string): Promise<void> => {
  await axios.delete(`${API_BASE}/Apartments/${apartmentId}/photos/${photoId}`, { headers: authHeader() });
};

export const getApartmentPhotoUrl = (apartmentId: string, photoId: string): string => {
  return `${API_BASE}/Apartments/${apartmentId}/photos/${photoId}`;
};
