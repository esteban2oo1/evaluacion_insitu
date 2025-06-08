import api from '@/lib/api';
import { AspectoEvaluacion } from '@/lib/types/evaluacionInsitu';

export const aspectosEvaluacionService = {
  getAll: async (): Promise<AspectoEvaluacion[]> => {
    const response = await api.get('/aspectos-evaluacion');
    return response.data.data;
  },

  getById: async (id: number): Promise<AspectoEvaluacion> => {
    const response = await api.get(`/aspectos-evaluacion/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<AspectoEvaluacion, 'ID'>): Promise<AspectoEvaluacion> => {
    const response = await api.post('/aspectos-evaluacion', data);
    return response.data.data;
  },
  
  update: async (id: number, data: Partial<AspectoEvaluacion>): Promise<AspectoEvaluacion> => {
    const response = await api.put(`/aspectos-evaluacion/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/aspectos-evaluacion/${id}`);
  }
}; 