export interface AspectoEvaluacion {
  ASPECTO: string;
  PROMEDIO_GENERAL: number;
}

export interface DocenteRanking {
  ID_DOCENTE: string;
  DOCENTE: string;
  TOTAL_PUNTAJE: number;
  PROMEDIO_GENERAL: number;
  TOTAL_RESPUESTAS: number;
  evaluaciones_esperadas: number;
  evaluaciones_realizadas: number;
  evaluaciones_pendientes: number;
  POSICION?: string;
}

export interface DashboardStats {
  total_estudiantes: number;
  total_evaluaciones: number;
  evaluaciones_completadas: number;
  evaluaciones_pendientes: number;
  porcentaje_completado: number;
  docentes_evaluados: number;
  total_docentes: number;
  porcentaje_docentes_evaluados: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  aspectos: AspectoEvaluacion[];
  podio: DocenteRanking[];
} 