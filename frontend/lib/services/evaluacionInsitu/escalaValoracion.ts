import api from '@/lib/api';
import { EscalaValoracion } from '@/lib/types/evaluacionInsitu';

export const escalaValoracionService = {
  getAll: async (): Promise<EscalaValoracion[]> => {
    const response = await api.get('/escala-valoracion');
    return response.data.data;
  },

  getById: async (id: number): Promise<EscalaValoracion> => {
    const response = await api.get(`/escala-valoracion/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<EscalaValoracion, 'ID'>): Promise<EscalaValoracion> => {
    const response = await api.post('/escala-valoracion', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<EscalaValoracion>): Promise<EscalaValoracion> => {
    const response = await api.put(`/escala-valoracion/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/escala-valoracion/${id}`);
  }
}; 