export interface AsignaturaDocente {
  COD_ASIGNATURA: number
  ASIGNATURA: string
  ID_DOCENTE: string
  DOCENTE: string
  SEMESTRE_PREDOMINANTE: string
  PROGRAMA_PREDOMINANTE: string
  total_evaluaciones_esperadas: number
  evaluaciones_completadas: number
  evaluaciones_pendientes: number
  porcentaje_completado: string
  estado_evaluacion: string
}

export interface EvaluacionesEstudiantes {
  total_estudiantes: number
  evaluaciones_realizadas: number
  evaluaciones_sin_realizar: number
}

export interface AspectoPuntaje {
  ID_DOCENTE: string
  DOCENTE: string
  ASPECTO: string
  descripcion: string
  PUNTAJE_PROMEDIO: string
}

export interface AsignaturasResponse {
  success: boolean
  data: AsignaturaDocente[]
}

export interface ProfesorDetalle {
  asignaturas: AsignaturaDocente[]
  evaluaciones: EvaluacionesEstudiantes
  aspectos: AspectoPuntaje[]
} 