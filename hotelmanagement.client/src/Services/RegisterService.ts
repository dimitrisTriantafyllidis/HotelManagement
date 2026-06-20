import api from './api';

export const getUsers = async () => {
  const response = await api.get('/Users');
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/Users/${id}`);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await api.post('/Users/register', data);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/Users/${id}`, data);
  return response.data;
};
