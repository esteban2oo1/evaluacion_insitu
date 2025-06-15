import api from "@/lib/api"
import { 
  ProfesoresParams,
  AsignaturaDocente, 
  EvaluacionesEstudiantes, 
  AspectoPuntaje, 
  AsignaturasResponse,
  ProfesorDetalle 
} from "@/lib/types/profesores"

export const profesoresService = {
  async getAsignaturas(params?: ProfesoresParams): Promise<AsignaturaDocente[]> {
    try {
      const response = await api.get<AsignaturasResponse>('/reportes/docentes/asignaturas', {
        params,
      })
      return response.data.data
    } catch (error) {
      console.error('Error al obtener asignaturas:', error)
      throw error
    }
  },

  async getEvaluacionesEstudiantes(idDocente: string, codAsignatura: number, grupo: string): Promise<EvaluacionesEstudiantes> {
    try {
      const response = await api.get<EvaluacionesEstudiantes>(
        `/reportes/docentes/estudiantes-evaluados/${idDocente}/${codAsignatura}/${grupo}`
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener evaluaciones de estudiantes:', error)
      throw error
    }
  },

  async getAspectosPuntaje(idDocente: string): Promise<AspectoPuntaje[]> {
    try {
      const response = await api.get<AspectoPuntaje[]>(`/reportes/docentes/aspectos-puntaje/${idDocente}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener aspectos y puntajes:', error)
      throw error
    }
  },

  async getProfesorDetalle(idDocente: string): Promise<ProfesorDetalle> {
    try {
      const [asignaturas, aspectos] = await Promise.all([
        this.getAsignaturas(),
        this.getAspectosPuntaje(idDocente)
      ])

      // Filtrar asignaturas por el docente específico
      const asignaturasDocente = asignaturas.filter(asig => asig.ID_DOCENTE === idDocente)

      // Obtener evaluaciones para cada asignatura
      const evaluacionesPromises = asignaturasDocente.map(asig => 
        this.getEvaluacionesEstudiantes(idDocente, asig.COD_ASIGNATURA, asig.SEMESTRE_PREDOMINANTE)
      )
      const evaluaciones = await Promise.all(evaluacionesPromises)

      return {
        asignaturas: asignaturasDocente,
        evaluaciones: evaluaciones[0], // Tomamos la primera evaluación como ejemplo
        aspectos
      }
    } catch (error) {
      console.error('Error al obtener detalles del profesor:', error)
      throw error
    }
  }
} 