import api from '../../api';
import { Evaluacion } from '../../types/evaluacionInsitu';

export const getEvaluaciones = async (): Promise<Evaluacion[]> => {
  const response = await api.get('/evaluaciones');
  return response.data;
};

export const getEvaluacionById = async (id: number): Promise<Evaluacion> => {
  const response = await api.get(`/evaluaciones/${id}`);
  return response.data;
};

export const createEvaluacion = async (data: Partial<Evaluacion>): Promise<Evaluacion> => {
  const response = await api.post('/evaluaciones', data);
  return response.data;
};

export const updateEvaluacion = async (id: number, data: Partial<Evaluacion>): Promise<Evaluacion> => {
  const response = await api.put(`/evaluaciones/${id}`, data);
  return response.data;
};

export const deleteEvaluacion = async (id: number): Promise<void> => {
  await api.delete(`/evaluaciones/${id}`);
};

export const createEvaluacionU = async (data: Partial<Evaluacion>): Promise<Evaluacion> => {
  const response = await api.post('/evaluaciones/insitu/crear', data);
  return response.data;
};

export const getEvaluacionByDocente = async (documento: string): Promise<Evaluacion[]> => {
  const response = await api.get(`/evaluaciones/insitu/${documento}`);
  return response.data;
};

export const getEvaluacionByEstudiante = async (documento: string): Promise<Evaluacion[]> => {
  const response = await api.get(`/evaluaciones/insitu/estudiante/${documento}`);
  return response.data;
};