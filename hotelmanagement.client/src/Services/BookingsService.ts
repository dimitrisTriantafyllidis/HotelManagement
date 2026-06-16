import axios from 'axios';

const API_BASE = 'http://localhost:5037/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBookings = async () => {
  const response = await axios.get(`${API_BASE}/Bookings`, { headers: authHeader() });
  return response.data;
};

export const getBooking = async (id: string) => {
  const response = await axios.get(`${API_BASE}/Bookings/${id}`, { headers: authHeader() });
  return response.data;
};

export const createBooking = async (data: any) => {
  const response = await axios.post(`${API_BASE}/Bookings`, data, { headers: authHeader() });
  return response.data;
};

export const updateBooking = async (id: string, data: any) => {
  const response = await axios.put(`${API_BASE}/Bookings/${id}`, data, { headers: authHeader() });
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await axios.delete(`${API_BASE}/Bookings/${id}`, { headers: authHeader() });
  return response.data;
};

export const downloadBookingCheckInPdf = async (id: string): Promise<Blob> => {
  const response = await axios.get(`${API_BASE}/Bookings/${id}/checkin-pdf`, {
    headers: authHeader(),
    responseType: 'blob',
  });
  return response.data;
};

export const sendBookingNotification = async (id: string, data: { subject: string; message: string; sendEmail: boolean; sendSms: boolean }) => {
  const response = await axios.post(`${API_BASE}/Bookings/${id}/notify`, data, { headers: authHeader() });
  return response.data;
};
