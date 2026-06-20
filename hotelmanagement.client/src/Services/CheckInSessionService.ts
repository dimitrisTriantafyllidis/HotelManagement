import api from './api';
import { CheckInSessionDto, CreateCheckInSessionDto, DoorCodeResponseDto } from '../models/types';

export const getCheckInSession = async (id: string): Promise<CheckInSessionDto> => {
  const response = await api.get(`/CheckInSessions/${id}`);
  return response.data;
};

export const getCheckInSessionByBooking = async (bookingId: string): Promise<CheckInSessionDto> => {
  const response = await api.get(`/CheckInSessions/by-booking/${bookingId}`);
  return response.data;
};

export const createCheckInSession = async (data: CreateCheckInSessionDto): Promise<CheckInSessionDto> => {
  const response = await api.post('/CheckInSessions', data);
  return response.data;
};

export const signCheckInSession = async (id: string, signatureData: string): Promise<CheckInSessionDto> => {
  const response = await api.put(`/CheckInSessions/${id}/sign`, { signatureData });
  return response.data;
};

export const verifyCheckInSession = async (id: string): Promise<CheckInSessionDto> => {
  const response = await api.put(`/CheckInSessions/${id}/verify`, {});
  return response.data;
};

export const getDoorCode = async (sessionId: string): Promise<DoorCodeResponseDto> => {
  const response = await api.get(`/CheckInSessions/${sessionId}/door-code`);
  return response.data;
};

// Admin endpoints
export const getPendingCheckIns = async (): Promise<CheckInSessionDto[]> => {
  const response = await api.get('/CheckInSessions/pending');
  return response.data;
};

export const getAllCheckIns = async (): Promise<CheckInSessionDto[]> => {
  const response = await api.get('/CheckInSessions');
  return response.data;
};

export const approveCheckIn = async (id: string, notes?: string): Promise<CheckInSessionDto> => {
  const response = await api.put(`/CheckInSessions/${id}/approve`, { notes });
  return response.data;
};

export const rejectCheckIn = async (id: string, notes?: string): Promise<CheckInSessionDto> => {
  const response = await api.put(`/CheckInSessions/${id}/reject`, { notes });
  return response.data;
};

export const downloadCheckInPdf = async (id: string, language: string = 'en'): Promise<Blob> => {
  const response = await api.get(`/CheckInSessions/${id}/pdf`, {
    responseType: 'blob',
    params: { language },
  });
  return response.data;
};

// File upload endpoints
export const uploadIdDocument = async (sessionId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await api.post(`/CheckInSessions/${sessionId}/id-document`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadSelfie = async (sessionId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await api.post(`/CheckInSessions/${sessionId}/selfie`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getIdDocumentUrl = (sessionId: string): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/CheckInSessions/${sessionId}/id-document`;
};

export const getSelfieUrl = (sessionId: string): string => {
  return `${import.meta.env.VITE_API_BASE_URL}/CheckInSessions/${sessionId}/selfie`;
};
