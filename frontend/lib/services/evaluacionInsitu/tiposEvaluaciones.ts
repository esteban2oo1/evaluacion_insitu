import api from '@/lib/api';
import { TipoEvaluacion } from '@/lib/types/evaluacionInsitu';

export const tiposEvaluacionesService = {
  getAll: async (): Promise<TipoEvaluacion[]> => {
    const response = await api.get('/tipos-evaluaciones');
    return response.data.data;
  },

  getById: async (id: number): Promise<TipoEvaluacion> => {
    const response = await api.get(`/tipos-evaluaciones/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<TipoEvaluacion, 'ID' | 'FECHA_CREACION' | 'FECHA_ACTUALIZACION'>): Promise<TipoEvaluacion> => {
    const response = await api.post('/tipos-evaluaciones', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<TipoEvaluacion>): Promise<TipoEvaluacion> => {
    const response = await api.put(`/tipos-evaluaciones/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tipos-evaluaciones/${id}`);
  },

  getConfiguracion: async (id: number): Promise<TipoEvaluacion> => {
    const response = await api.get(`/tipos-evaluaciones/configuracion/${id}`);
    return response.data.data;
  }
}; 