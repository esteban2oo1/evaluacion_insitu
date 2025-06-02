import api from '@/lib/api';
import { Evaluacion, BulkEvaluciones, BulkEvaluacionesResponse } from '@/lib/types/evaluacionInsitu';

export const evaluacionService = {
  getAll: async (): Promise<Evaluacion[]> => {
    const response = await api.get('/evaluaciones');
    return response.data.data;
  },

  getById: async (id: number): Promise<Evaluacion> => {
    const response = await api.get(`/evaluaciones/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Evaluacion>): Promise<Evaluacion> => {
    const response = await api.post('/evaluaciones', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Evaluacion>): Promise<Evaluacion> => {
    const response = await api.put(`/evaluaciones/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/evaluaciones/${id}`);
  },

  createInsitu: async (data: Partial<BulkEvaluciones>): Promise<BulkEvaluacionesResponse> => {
    const response = await api.post('/evaluaciones/insitu/crear', data);
    return response.data.data;
  },

  getByDocente: async (documento: string): Promise<Evaluacion[]> => {
    const response = await api.get(`/evaluaciones/insitu/${documento}`);
    return response.data.data;
  },

  getByEstudiante: async (documento: string): Promise<Evaluacion[]> => {
    const response = await api.get(`/evaluaciones/estudiante/${documento}`);
    return response.data.data;
  },

  getByEstudianteByConfiguracion: async (documento: string, configuracionId: number): Promise<Evaluacion[]> => {
    const response = await api.get(`/evaluaciones/estudiante/${documento}/configuracion/${configuracionId}`);
    return response.data.data;
  }
};
