import api from './api';

export const getCheckIn = async (id: string) => {
  const response = await api.get(`/CheckIn/${id}`);
  return response.data;
};

export const createCheckIn = async (data: any) => {
  const response = await api.post('/CheckIn', data);
  return response.data;
};

export const updateCheckIn = async (id: string, data: any) => {
  const response = await api.put(`/CheckIn/${id}`, data);
  return response.data;
};

export const deleteCheckIn = async (id: string) => {
  const response = await api.delete(`/CheckIn/${id}`);
  return response.data;
};
