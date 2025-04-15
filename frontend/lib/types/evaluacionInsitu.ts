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
  FECHA_CREACION: string;
  FECHA_ACTUALIZACION: string;
} 