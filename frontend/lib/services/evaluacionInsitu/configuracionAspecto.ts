import api from '@/lib/api';
import { ConfiguracionAspecto } from '@/lib/types/evaluacionInsitu';

export const configuracionAspectoService = {
  getAll: async (): Promise<ConfiguracionAspecto[]> => {
    const response = await api.get('/configuracion-aspecto');
    return response.data.data;
  },

  getById: async (id: number): Promise<ConfiguracionAspecto> => {
    const response = await api.get(`/configuracion-aspecto/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<ConfiguracionAspecto, 'ID'>): Promise<ConfiguracionAspecto> => {
    const response = await api.post('/configuracion-aspecto', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ConfiguracionAspecto>): Promise<ConfiguracionAspecto> => {
    const response = await api.put(`/configuracion-aspecto/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuracion-aspecto/${id}`);
  }
}; 