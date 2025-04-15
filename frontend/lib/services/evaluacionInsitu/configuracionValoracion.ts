import api from '@/lib/api';
import { ConfiguracionValoracion } from '@/lib/types/evaluacionInsitu';

export const configuracionValoracionService = {
  getAll: async (): Promise<ConfiguracionValoracion[]> => {
    const response = await api.get('/configuracion-valoracion');
    return response.data.data;
  },

  getById: async (id: number): Promise<ConfiguracionValoracion> => {
    const response = await api.get(`/configuracion-valoracion/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<ConfiguracionValoracion, 'ID'>): Promise<ConfiguracionValoracion> => {
    const response = await api.post('/configuracion-valoracion', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ConfiguracionValoracion>): Promise<ConfiguracionValoracion> => {
    const response = await api.put(`/configuracion-valoracion/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuracion-valoracion/${id}`);
  }
}; 