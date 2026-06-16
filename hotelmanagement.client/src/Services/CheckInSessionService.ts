import axios from 'axios';
import { CheckInSessionDto, CreateCheckInSessionDto, DoorCodeResponseDto } from '../models/types';

const API_BASE = 'http://localhost:5037/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCheckInSession = async (id: string): Promise<CheckInSessionDto> => {
  const response = await axios.get(`${API_BASE}/CheckInSessions/${id}`, { headers: authHeader() });
  return response.data;
};

export const getCheckInSessionByBooking = async (bookingId: string): Promise<CheckInSessionDto> => {
  const response = await axios.get(`${API_BASE}/CheckInSessions/by-booking/${bookingId}`, { headers: authHeader() });
  return response.data;
};

export const createCheckInSession = async (data: CreateCheckInSessionDto): Promise<CheckInSessionDto> => {
  const response = await axios.post(`${API_BASE}/CheckInSessions`, data);
  return response.data;
};

export const signCheckInSession = async (id: string, signatureData: string): Promise<CheckInSessionDto> => {
  const response = await axios.put(`${API_BASE}/CheckInSessions/${id}/sign`, { signatureData });
  return response.data;
};

export const verifyCheckInSession = async (id: string): Promise<CheckInSessionDto> => {
  const response = await axios.put(`${API_BASE}/CheckInSessions/${id}/verify`, {}, { headers: authHeader() });
  return response.data;
};

export const getDoorCode = async (sessionId: string): Promise<DoorCodeResponseDto> => {
  const response = await axios.get(`${API_BASE}/CheckInSessions/${sessionId}/door-code`, { headers: authHeader() });
  return response.data;
};

// Admin endpoints
export const getPendingCheckIns = async (): Promise<CheckInSessionDto[]> => {
  const response = await axios.get(`${API_BASE}/CheckInSessions/pending`, { headers: authHeader() });
  return response.data;
};

export const getAllCheckIns = async (): Promise<CheckInSessionDto[]> => {
  const response = await axios.get(`${API_BASE}/CheckInSessions`, { headers: authHeader() });
  return response.data;
};

export const approveCheckIn = async (id: string, notes?: string): Promise<CheckInSessionDto> => {
  const response = await axios.put(`${API_BASE}/CheckInSessions/${id}/approve`, { notes }, { headers: authHeader() });
  return response.data;
};

export const rejectCheckIn = async (id: string, notes?: string): Promise<CheckInSessionDto> => {
  const response = await axios.put(`${API_BASE}/CheckInSessions/${id}/reject`, { notes }, { headers: authHeader() });
  return response.data;
};

export const downloadCheckInPdf = async (id: string, language: string = 'en'): Promise<Blob> => {
  const response = await axios.get(`${API_BASE}/CheckInSessions/${id}/pdf`, {
    headers: authHeader(),
    responseType: 'blob',
    params: { language },
  });
  return response.data;
};

// File upload endpoints
export const uploadIdDocument = async (sessionId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await axios.post(`${API_BASE}/CheckInSessions/${sessionId}/id-document`, formData, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadSelfie = async (sessionId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);
  await axios.post(`${API_BASE}/CheckInSessions/${sessionId}/selfie`, formData, {
    headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
  });
};

export const getIdDocumentUrl = (sessionId: string): string => {
  return `${API_BASE}/CheckInSessions/${sessionId}/id-document`;
};

export const getSelfieUrl = (sessionId: string): string => {
  return `${API_BASE}/CheckInSessions/${sessionId}/selfie`;
};
