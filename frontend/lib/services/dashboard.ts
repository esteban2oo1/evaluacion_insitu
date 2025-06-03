import api from "@/lib/api"
import {
  DashboardResponse,
  DocenteRanking,
  DocentePodio,
  AspectoEvaluacion,
  DashboardStats
} from "@/lib/types/dashboard"

export const dashboardService = {
  async getDashboardData(configuracionId?: number): Promise<DashboardResponse> {
    try {
      const [statsResponse, aspectosResponse, rankingResponse, podioResponse] = await Promise.all([
        api.get(`/dashboard/stats/configuracion/${configuracionId}`),
        api.get(`/dashboard/aspectos/configuracion/${configuracionId}`),
        api.get(`/dashboard/ranking`),
        api.get(`/dashboard/podio`)
      ]);

      const statsRaw = statsResponse.data[0] || {
        idConfiguracion: configuracionId ?? 0,
        total_estudiantes: 0,
        total_evaluaciones: 0,
        evaluaciones_completadas: 0,
        evaluaciones_pendientes: 0,
        porcentaje_completado: "0.00",
        docentes_evaluados: 0,
        total_docentes: 0,
        porcentaje_docentes_evaluados: "0.00"
      };

      const stats: DashboardStats = {
        ...statsRaw,
        porcentaje_completado: parseFloat(statsRaw.porcentaje_completado) || 0,
        porcentaje_docentes_evaluados: parseFloat(statsRaw.porcentaje_docentes_evaluados) || 0
      };

      const aspectos: AspectoEvaluacion[] = aspectosResponse.data.map((aspecto: any) => ({
        ASPECTO: aspecto.ASPECTO,
        PROMEDIO_GENERAL: parseFloat(aspecto.PROMEDIO_GENERAL) || 0
      }));

      const ranking: DocenteRanking[] = rankingResponse.data.map((docente: any) => ({
        ID_DOCENTE: docente.ID_DOCENTE,
        DOCENTE: docente.DOCENTE,
        TOTAL_PUNTAJE: parseFloat(docente.TOTAL_PUNTAJE) || 0,
        PROMEDIO_GENERAL: parseFloat(docente.PROMEDIO_GENERAL) || 0,
        TOTAL_RESPUESTAS: docente.TOTAL_RESPUESTAS || 0,
        evaluaciones_esperadas: docente.evaluaciones_esperadas || 0,
        evaluaciones_realizadas: docente.evaluaciones_realizadas || 0,
        evaluaciones_pendientes: docente.evaluaciones_pendientes || 0,
        POSICION: docente.POSICION // puede ser undefined en ranking
      }));

      const podio: DocentePodio[] = podioResponse.data.map((docente: any) => ({
        ID_DOCENTE: docente.ID_DOCENTE,
        DOCENTE: docente.DOCENTE,
        TOTAL_PUNTAJE: parseFloat(docente.TOTAL_PUNTAJE) || 0,
        PROMEDIO_GENERAL: parseFloat(docente.PROMEDIO_GENERAL) || 0,
        TOTAL_RESPUESTAS: docente.TOTAL_RESPUESTAS || 0,
        evaluaciones_esperadas: docente.evaluaciones_esperadas || 0,
        evaluaciones_realizadas: docente.evaluaciones_realizadas || 0,
        evaluaciones_pendientes: docente.evaluaciones_pendientes || 0,
        POSICION: docente.POSICION || '' // <- aseguramos que sea string
      }));

      return {
        stats,
        aspectos,
        ranking,
        podio
      };
    } catch (error) {
      console.error('Error al cargar el dashboard:', error);
      throw error;
    }
  }
};
