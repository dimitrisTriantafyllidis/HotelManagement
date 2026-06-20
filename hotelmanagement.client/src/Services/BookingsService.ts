import api from './api';

export const getBookings = async () => {
  const response = await api.get('/Bookings');
  return response.data;
};

export const getBooking = async (id: string) => {
  const response = await api.get(`/Bookings/${id}`);
  return response.data;
};

export const createBooking = async (data: any) => {
  const response = await api.post('/Bookings', data);
  return response.data;
};

export const updateBooking = async (id: string, data: any) => {
  const response = await api.put(`/Bookings/${id}`, data);
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await api.delete(`/Bookings/${id}`);
  return response.data;
};

export const downloadBookingCheckInPdf = async (id: string): Promise<Blob> => {
  const response = await api.get(`/Bookings/${id}/checkin-pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

export const sendBookingNotification = async (id: string, data: { subject: string; message: string; sendEmail: boolean; sendSms: boolean }) => {
  const response = await api.post(`/Bookings/${id}/notify`, data);
  return response.data;
};
