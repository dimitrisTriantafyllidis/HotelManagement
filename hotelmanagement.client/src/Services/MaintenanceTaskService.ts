import axios from 'axios';
import { MaintenanceTaskDto } from '../models/types';

const API_BASE = 'http://localhost:5037/api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMaintenanceTasks = async (params?: {
  status?: string;
  apartmentId?: string;
  assignedTo?: string;
}): Promise<MaintenanceTaskDto[]> => {
  const response = await axios.get(`${API_BASE}/MaintenanceTasks`, {
    headers: authHeader(),
    params,
  });
  return response.data;
};

export const getMaintenanceTask = async (id: string): Promise<MaintenanceTaskDto> => {
  const response = await axios.get(`${API_BASE}/MaintenanceTasks/${id}`, { headers: authHeader() });
  return response.data;
};

export const createMaintenanceTask = async (data: any): Promise<MaintenanceTaskDto> => {
  const response = await axios.post(`${API_BASE}/MaintenanceTasks`, data, { headers: authHeader() });
  return response.data;
};

export const updateMaintenanceTask = async (id: string, data: any): Promise<void> => {
  await axios.put(`${API_BASE}/MaintenanceTasks/${id}`, data, { headers: authHeader() });
};

export const deleteMaintenanceTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/MaintenanceTasks/${id}`, { headers: authHeader() });
};

export const generateCheckoutTasks = async (): Promise<MaintenanceTaskDto[]> => {
  const response = await axios.post(`${API_BASE}/MaintenanceTasks/generate-checkout-tasks`, {}, { headers: authHeader() });
  return response.data;
};
