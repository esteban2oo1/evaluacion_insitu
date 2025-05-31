export interface AspectoEvaluacion {
  ID: number;
  ETIQUETA: string;
  DESCRIPCION: string;
}

export interface ConfiguracionAspecto {
  ID: number;
  CONFIGURACION_EVALUACION_ID: number;
  ASPECTO_ID: number;
  ORDEN: number;
  ACTIVO: boolean;
}

export interface ConfiguracionEvaluacion {
  ID: number;
  TIPO_EVALUACION_ID: number;
  FECHA_INICIO: string;
  FECHA_FIN: string;
  ACTIVO: boolean;
}

export interface ConfiguracionValoracion {
  ID: number;
  CONFIGURACION_EVALUACION_ID: number;
  VALORACION_ID: number;
  PUNTAJE: number;
  ORDEN: number;
  ACTIVO: boolean;
}

export interface EscalaValoracion {
  ID: number;
  VALOR: string;
  ETIQUETA: string;
  DESCRIPCION: string;
}

export interface TipoEvaluacion {
  ID: number;
  NOMBRE: string;
  DESCRIPCION: string;
  ACTIVO: boolean;
} 

export interface ConfiguracionResponse {
  configuracion: ConfiguracionEvaluacion;
  aspectos: AspectoEvaluacion[];
  valoraciones: EscalaValoracion[];
}

export interface Evaluacion {
  ID: number;
  DOCUMENTO_ESTUDIANTE: string;
  DOCENTE: string;
  ASIGNATURA: string;
  DOCUMENTO_DOCENTE: string;
  CODIGO_MATERIA: string;
  ID_CONFIGURACION: number;
  SEMESTRE_PREDOMINANTE: string;
  PROGRAMA_PREDOMINANTE: string;
}

export interface DetalleEvaluacionRequest {
  EVALUACION_ID: number;
  ASPECTO_ID: number;
  VALORACION_ID: number;
  COMENTARIO: string;
}

export interface BulkEvaluacionRequest {
  evaluacionId: number;
  comentarioGeneral: string;
  detalles: {
    aspectoId: number;
    valoracionId: number;
    comentario: string;
  }[];
}

export interface EstadoActivo {
  id: number;
  activo: number;
}