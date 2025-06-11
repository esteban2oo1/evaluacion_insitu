// Importamos la configuración de axios y las interfaces
import api from '@/lib/api';
import { SemestresResponse, PeriodosResponse, ProgramasResponse, GruposResponse, SedesResponse } from '@/lib/types/vista/vistaAcademicaInsitu';

export const getSedes = async (): Promise<SedesResponse> => {
  try {
    const response = await api.get<SedesResponse>('/academica/sedes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los semestres:', error);
    throw error;
  }
};

export const getSemestres = async (): Promise<SemestresResponse> => {
  try {
    const response = await api.get<SemestresResponse>('/academica/semestres');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los semestres:', error);
    throw error;
  }
};

export const getPeriodos = async (): Promise<PeriodosResponse> => {
  try {
    const response = await api.get<PeriodosResponse>('/academica/periodos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los periodos:', error);
    throw error;
  }
};

export const getProgramas = async (): Promise<ProgramasResponse> => {
  try {
    const response = await api.get<ProgramasResponse>('/academica/programas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los programas académicos:', error);
    throw error;
  }
};

export const getGrupos = async (): Promise<GruposResponse> => {
  try {
    const response = await api.get<GruposResponse>('/academica/grupos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los grupos:', error);
    throw error;
  }
};
