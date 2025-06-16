import api from '@/lib/api';
import { Roles } from '@/lib/types/evaluacionInsitu';

export const rolesService = {
  getAll: async (): Promise<Roles[]> => {
    const response = await api.get('/roles');
    return response.data.data;
  },

  getById: async (id: number): Promise<Roles> => {
    const response = await api.get(`/roles/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<Roles, 'ID'>): Promise<Roles> => {
    const response = await api.post('/roles', data);
    return response.data.data;
  },
  
  update: async (id: number, data: Partial<Roles>): Promise<Roles> => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/roles/${id}`);
  }
}; 