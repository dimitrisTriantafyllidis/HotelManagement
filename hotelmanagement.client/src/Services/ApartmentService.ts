import api from './api';
import { ApartmentPhotoDto } from '../models/types';

export const getApartments = async () => {
  const response = await api.get('/Apartments');
  return response.data;
};

export const getApartment = async (id: string) => {
  const response = await api.get(`/Apartments/${id}`);
  return response.data;
};

export const createApartment = async (data: any) => {
  const response = await api.post('/Apartments', data);
  return response.data;
};

export const updateApartment = async (id: string, data: any) => {
  const response = await api.put(`/Apartments/${id}`, data);
  return response.data;
};

export const deleteApartment = async (id: string) => {
  const response = await api.delete(`/Apartments/${id}`);
  return response.data;
};

// Photo endpoints
export const uploadApartmentPhotos = async (apartmentId: string, files: File[]): Promise<ApartmentPhotoDto[]> => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  const response = await api.post(`/Apartments/${apartmentId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getApartmentPhotos = async (apartmentId: string): Promise<ApartmentPhotoDto[]> => {
  const response = await api.get(`/Apartments/${apartmentId}/photos`);
  return response.data;
};

export const deleteApartmentPhoto = async (apartmentId: string, photoId: string): Promise<void> => {
  await api.delete(`/Apartments/${apartmentId}/photos/${photoId}`);
};

export const getApartmentPhotoUrl = (apartmentId: string, photoId: string): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/Apartments/${apartmentId}/photos/${photoId}`;
};
