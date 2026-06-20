import api from './api';
import { MaintenanceTaskDto } from '../models/types';

export const getMaintenanceTasks = async (params?: {
  status?: string;
  apartmentId?: string;
  assignedTo?: string;
}): Promise<MaintenanceTaskDto[]> => {
  const response = await api.get('/MaintenanceTasks', { params });
  return response.data;
};

export const getMaintenanceTask = async (id: string): Promise<MaintenanceTaskDto> => {
  const response = await api.get(`/MaintenanceTasks/${id}`);
  return response.data;
};

export const createMaintenanceTask = async (data: any): Promise<MaintenanceTaskDto> => {
  const response = await api.post('/MaintenanceTasks', data);
  return response.data;
};

export const updateMaintenanceTask = async (id: string, data: any): Promise<void> => {
  await api.put(`/MaintenanceTasks/${id}`, data);
};

export const deleteMaintenanceTask = async (id: string): Promise<void> => {
  await api.delete(`/MaintenanceTasks/${id}`);
};

export const generateCheckoutTasks = async (): Promise<MaintenanceTaskDto[]> => {
  const response = await api.post('/MaintenanceTasks/generate-checkout-tasks', {});
  return response.data;
};
