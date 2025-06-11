import api from '@/lib/api';
import { 
  ApiResponse,
  DashboardStatsResponse, 
  DashboardAspectosResponse, 
  DashboardRankingResponse, 
  DashboardPodioResponse, 
  DashboardParams 
} from '@/lib/types/dashboard/dashboard';

/**
 * Obtiene las estadísticas principales del dashboard.
 */
export const getDashboardStats = async (
  params: DashboardParams
): Promise<DashboardStatsResponse> => {
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('idConfiguracion', params.idConfiguracion.toString());

    if (params.periodo) urlParams.append('periodo', params.periodo);
    if (params.nombreSede) urlParams.append('nombreSede', params.nombreSede);
    if (params.nomPrograma) urlParams.append('nomPrograma', params.nomPrograma);
    if (params.semestre) urlParams.append('semestre', params.semestre);
    if (params.grupo) urlParams.append('grupo', params.grupo);

    const response = await api.get<ApiResponse<DashboardStatsResponse>>(
      `/dashboard/stats?${urlParams.toString()}`
    );

    if (!response.data.success) {
      throw new Error('Error en la respuesta del servidor');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener las estadísticas del dashboard:', error);
    throw error;
  }
};

/**
 * Obtiene los aspectos promedio del dashboard.
 */
export const getDashboardAspectos = async (
  params: DashboardParams
): Promise<DashboardAspectosResponse[]> => {
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('idConfiguracion', params.idConfiguracion.toString());

    if (params.periodo) urlParams.append('periodo', params.periodo);
    if (params.nombreSede) urlParams.append('nombreSede', params.nombreSede);
    if (params.nomPrograma) urlParams.append('nomPrograma', params.nomPrograma);
    if (params.semestre) urlParams.append('semestre', params.semestre);
    if (params.grupo) urlParams.append('grupo', params.grupo);

    const response = await api.get<ApiResponse<DashboardAspectosResponse[]>>(
      `/dashboard/aspectos?${urlParams.toString()}`
    );

    if (!response.data.success) {
      throw new Error('Error en la respuesta del servidor');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener los aspectos del dashboard:', error);
    throw error;
  }
};

/**
 * Obtiene el ranking de docentes.
 */
export const getDashboardRanking = async (
  params: DashboardParams
): Promise<DashboardRankingResponse[]> => {
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('idConfiguracion', params.idConfiguracion.toString());

    if (params.periodo) urlParams.append('periodo', params.periodo);
    if (params.nombreSede) urlParams.append('nombreSede', params.nombreSede);
    if (params.nomPrograma) urlParams.append('nomPrograma', params.nomPrograma);
    if (params.semestre) urlParams.append('semestre', params.semestre);
    if (params.grupo) urlParams.append('grupo', params.grupo);

    const response = await api.get<ApiResponse<DashboardRankingResponse[]>>(
      `/dashboard/ranking?${urlParams.toString()}`
    );

    if (!response.data.success) {
      throw new Error('Error en la respuesta del servidor');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener el ranking del dashboard:', error);
    throw error;
  }
};

/**
 * Obtiene el podio de docentes destacados.
 */
export const getDashboardPodio = async (
  params: DashboardParams
): Promise<DashboardPodioResponse[]> => {
  try {
    const urlParams = new URLSearchParams();
    urlParams.append('idConfiguracion', params.idConfiguracion.toString());
    
    if (params.periodo) urlParams.append('periodo', params.periodo);
    if (params.nombreSede) urlParams.append('nombreSede', params.nombreSede);
    if (params.nomPrograma) urlParams.append('nomPrograma', params.nomPrograma);
    if (params.semestre) urlParams.append('semestre', params.semestre);
    if (params.grupo) urlParams.append('grupo', params.grupo);

    const response = await api.get<ApiResponse<DashboardPodioResponse[]>>(
      `/dashboard/podio?${urlParams.toString()}`
    );

    if (!response.data.success) {
      throw new Error('Error en la respuesta del servidor');
    }

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener el podio del dashboard:', error);
    throw error;
  }
};