import api from '@/lib/api';
import { ConfiguracionEvaluacion, EstadoActivo } from '@/lib/types/evaluacionInsitu';

export const configuracionEvaluacionService = {
  getAll: async (): Promise<ConfiguracionEvaluacion[]> => {
    const response = await api.get('/configuracion-evaluacion');
    return response.data.data;
  },

  getById: async (id: number): Promise<ConfiguracionEvaluacion> => {
    const response = await api.get(`/configuracion-evaluacion/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<ConfiguracionEvaluacion, 'ID'>): Promise<ConfiguracionEvaluacion> => {
    const response = await api.post('/configuracion-evaluacion', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ConfiguracionEvaluacion>): Promise<ConfiguracionEvaluacion> => {
    const response = await api.put(`/configuracion-evaluacion/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/configuracion-evaluacion/${id}`);
  },

  updateEstado: async (estado: EstadoActivo): Promise<EstadoActivo> => {
    const response = await api.patch(`/configuracion-evaluacion/${estado.id}/estado`, estado);
    return response.data.data;
  }
}; 