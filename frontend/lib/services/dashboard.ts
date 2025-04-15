import api from "@/lib/api"
import { DashboardResponse, DocenteRanking, AspectoEvaluacion } from "@/lib/types/dashboard"

export const dashboardService = {
  async getDashboardData(): Promise<DashboardResponse> {
    try {
      const [statsResponse, aspectosResponse, podioResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/aspectos'),
        api.get('/dashboard/podio')
      ])

      // Convertir strings a números donde sea necesario
      const stats = statsResponse.data[0] || {
        total_estudiantes: 0,
        total_evaluaciones: 0,
        evaluaciones_completadas: 0,
        evaluaciones_pendientes: 0,
        porcentaje_completado: 0,
        docentes_evaluados: 0,
        total_docentes: 0,
        porcentaje_docentes_evaluados: 0
      }

      // Convertir strings a números en las estadísticas
      const processedStats = {
        ...stats,
        porcentaje_completado: parseFloat(stats.porcentaje_completado) || 0,
        porcentaje_docentes_evaluados: parseFloat(stats.porcentaje_docentes_evaluados) || 0
      }

      // Procesar aspectos
      const aspectos: AspectoEvaluacion[] = aspectosResponse.data.map((aspecto: any) => ({
        ASPECTO: aspecto.ASPECTO,
        PROMEDIO_GENERAL: parseFloat(aspecto.PROMEDIO_GENERAL) || 0
      }))

      // Procesar podio
      const podio: DocenteRanking[] = podioResponse.data.map((docente: any) => ({
        ID_DOCENTE: docente.ID_DOCENTE,
        DOCENTE: docente.DOCENTE,
        TOTAL_PUNTAJE: parseFloat(docente.TOTAL_PUNTAJE) || 0,
        PROMEDIO_GENERAL: parseFloat(docente.PROMEDIO_GENERAL) || 0,
        TOTAL_RESPUESTAS: docente.TOTAL_RESPUESTAS || 0,
        evaluaciones_esperadas: docente.evaluaciones_esperadas || 0,
        evaluaciones_realizadas: docente.evaluaciones_realizadas || 0,
        evaluaciones_pendientes: docente.evaluaciones_pendientes || 0,
        POSICION: docente.POSICION || ''
      }))

      return {
        stats: processedStats,
        aspectos,
        podio
      }
    } catch (error) {
      console.error('Error al cargar el dashboard:', error)
      throw error
    }
  }
} 