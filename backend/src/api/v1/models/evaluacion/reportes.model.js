const { getPool } = require('../../../../db');

// Obtener progreso de un estudiante
const getProgresoEstudianteModel = async (documentoEstudiante, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      COUNT(DISTINCT va.CODIGO_MATERIA) as total_materias,
      COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.CODIGO_MATERIA END) as evaluaciones_completadas,
      GROUP_CONCAT(DISTINCT 
        CASE WHEN ed.ID IS NULL THEN 
          CONCAT(va.NOMBRE_MATERIA, ' - ', va.NOMBRE_DOCENTE)
        END
      ) as materias_pendientes
    FROM VISTA_ACADEMICA_INSITUS va
    LEFT JOIN EVALUACIONES e ON va.DOCUMENTO_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
      AND va.CODIGO_MATERIA = e.CODIGO_MATERIA
    LEFT JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    WHERE va.DOCUMENTO_ESTUDIANTE = ? AND va.SEMESTRE_MATRICULA = ?
  `, [documentoEstudiante, semestre]);

  return resultados[0];
};

// Obtener reporte general
const getReporteGeneralModel = async (semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      COUNT(DISTINCT ve.DOCUMENTO_ESTUDIANTE) as total_estudiantes,
      COUNT(DISTINCT va.CODIGO_MATERIA) as total_materias,
      COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(ve.DOCUMENTO_ESTUDIANTE, '-', va.CODIGO_MATERIA) END) as evaluaciones_completadas
    FROM VISTA_ESTUDIANTE ve
    INNER JOIN VISTA_ACADEMICA_INSITUS va ON ve.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    LEFT JOIN EVALUACIONES e ON ve.DOCUMENTO_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
      AND va.CODIGO_MATERIA = e.CODIGO_MATERIA
    LEFT JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    WHERE va.SEMESTRE_MATRICULA = ?
  `, [semestre]);

  return resultados[0];
};

// Obtener reporte de aspectos
const getReporteAspectosModel = async (semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      ae.ID as aspecto_id,
      ae.ETIQUETA,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio,
      COUNT(*) as total_evaluaciones,
      ROUND((COUNT(CASE WHEN cv.PUNTAJE >= 0.8 THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_positivo,
      ROUND((COUNT(CASE WHEN cv.PUNTAJE < 0.6 THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_negativo,
      COUNT(DISTINCT e.DOCUMENTO_DOCENTE) as total_docentes_evaluados,
      COUNT(DISTINCT e.DOCUMENTO_ESTUDIANTE) as total_estudiantes_evaluadores
    FROM EVALUACIONES e
    JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    JOIN ASPECTOS_EVALUACION ae ON ed.ASPECTO_ID = ae.ID
    JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    JOIN VISTA_ACADEMICA_INSITUS va ON e.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    WHERE va.SEMESTRE_MATRICULA = ?
    GROUP BY ae.ID, ae.ETIQUETA
    ORDER BY ae.ETIQUETA
  `, [semestre]);

  return resultados;
};

// Obtener detalle de un aspecto
const getDetalleAspectoModel = async (aspectoId, semestre) => {
  const pool = getPool();
  
  // Obtener estadísticas por docente
  const [resultados] = await pool.query(`
    SELECT 
      e.DOCUMENTO_DOCENTE,
      va.NOMBRE_DOCENTE,
      COUNT(*) as total_evaluaciones,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio,
      ROUND((COUNT(CASE WHEN cv.PUNTAJE >= 0.8 THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_positivo,
      ROUND((COUNT(CASE WHEN cv.PUNTAJE < 0.6 THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_negativo,
      COUNT(DISTINCT e.DOCUMENTO_ESTUDIANTE) as total_estudiantes_evaluadores,
      GROUP_CONCAT(DISTINCT va.NOMBRE_MATERIA) as materias_dictadas
    FROM EVALUACIONES e
    JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    JOIN ASPECTOS_EVALUACION ae ON ed.ASPECTO_ID = ae.ID
    JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    JOIN VISTA_ACADEMICA_INSITUS va ON e.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    WHERE ae.ID = ? AND va.SEMESTRE_MATRICULA = ?
    GROUP BY e.DOCUMENTO_DOCENTE, va.NOMBRE_DOCENTE
    ORDER BY promedio DESC
  `, [aspectoId, semestre]);

  // Obtener información del aspecto
  const [aspecto] = await pool.query(`
    SELECT ETIQUETA, DESCRIPCION 
    FROM ASPECTOS_EVALUACION 
    WHERE ID = ?
  `, [aspectoId]);

  return {
    aspecto: aspecto[0],
    resultados
  };
};

// Obtener detalle de un docente en un aspecto
const getDetalleDocenteAspectoModel = async (aspectoId, documentoDocente, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      e.DOCUMENTO_DOCENTE,
      va.NOMBRE_DOCENTE,
      e.DOCUMENTO_ESTUDIANTE,
      CONCAT(ve.PRIMER_NOMBRE, ' ', ve.SEGUNDO_NOMBRE, ' ', ve.PRIMER_APELLIDO, ' ', ve.SEGUNDO_APELLIDO) as nombre_estudiante,
      va.NOMBRE_MATERIA,
      cv.PUNTAJE,
      cv.DESCRIPCION as valoracion,
      ed.COMENTARIO
    FROM EVALUACIONES e
    JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    JOIN ASPECTOS_EVALUACION ae ON ed.ASPECTO_ID = ae.ID
    JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    JOIN VISTA_ACADEMICA_INSITUS va ON e.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    JOIN VISTA_ESTUDIANTE ve ON e.DOCUMENTO_ESTUDIANTE = ve.DOCUMENTO_ESTUDIANTE
    WHERE ae.ID = ? 
      AND e.DOCUMENTO_DOCENTE = ?
      AND va.SEMESTRE_MATRICULA = ?
    ORDER BY cv.PUNTAJE DESC
  `, [aspectoId, documentoDocente, semestre]);

  return resultados;
};

// Obtener reporte por facultad y programa
const getReporteFacultadProgramaModel = async (facultadId, programaId) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      vp.CODIGO_FACULTAD,
      vp.NOMBRE_FACULTAD,
      vp.CODIGO_PROGRAMA,
      vp.NOMBRE_PROGRAMA,
      COUNT(DISTINCT ve.DOCUMENTO_ESTUDIANTE) as total_estudiantes,
      COUNT(DISTINCT e.ID) as total_evaluaciones,
      COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN e.ID END) as evaluaciones_completadas,
      COUNT(DISTINCT CASE WHEN ed.ID IS NULL THEN e.ID END) as evaluaciones_pendientes,
      COUNT(DISTINCT va.DOCUMENTO_DOCENTE) as total_docentes
    FROM VISTA_PROGRAMAS vp
    JOIN VISTA_ESTUDIANTE ve ON vp.CODIGO_PROGRAMA = ve.COD_PROGRAMA
    LEFT JOIN EVALUACIONES e ON ve.DOCUMENTO_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE
    LEFT JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    LEFT JOIN VISTA_ACADEMICA_INSITUS va ON ve.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    WHERE vp.CODIGO_FACULTAD = ? AND vp.CODIGO_PROGRAMA = ?
    GROUP BY vp.CODIGO_FACULTAD, vp.NOMBRE_FACULTAD, vp.CODIGO_PROGRAMA, vp.NOMBRE_PROGRAMA
  `, [facultadId, programaId]);

  return resultados[0];
};

// Obtener estudiantes pendientes
const getEstudiantesPendientesModel = async (facultadId, programaId, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      ve.DOCUMENTO_ESTUDIANTE,
      CONCAT(ve.PRIMER_NOMBRE, ' ', ve.SEGUNDO_NOMBRE, ' ', ve.PRIMER_APELLIDO, ' ', ve.SEGUNDO_APELLIDO) as nombre_estudiante,
      ve.SEMESTRE_MATRICULA,
      COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN e.ID END) as evaluaciones_completadas,
      COUNT(DISTINCT va.CODIGO_MATERIA) as total_materias,
      GROUP_CONCAT(DISTINCT va.NOMBRE_MATERIA) as materias_pendientes
    FROM VISTA_ESTUDIANTE ve
    JOIN VISTA_ACADEMICA_INSITUS va ON ve.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    LEFT JOIN EVALUACIONES e ON ve.DOCUMENTO_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE
    LEFT JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    WHERE ve.COD_PROGRAMA = ? 
      AND ve.SEMESTRE_MATRICULA = ?
      AND (e.ID IS NULL OR ed.ID IS NULL)
    GROUP BY ve.DOCUMENTO_ESTUDIANTE, ve.PRIMER_NOMBRE, ve.SEGUNDO_NOMBRE, ve.PRIMER_APELLIDO, ve.SEGUNDO_APELLIDO, ve.SEMESTRE_MATRICULA
  `, [programaId, semestre]);

  return resultados;
};

// Obtener desempeño docente por programa
const getDesempenoDocenteProgramaModel = async (programaId) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      va.DOCUMENTO_DOCENTE,
      va.NOMBRE_DOCENTE,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio,
      COUNT(DISTINCT e.ID) as total_evaluaciones,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE >= 0.8 THEN e.ID END) as evaluaciones_positivas,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE < 0.6 THEN e.ID END) as evaluaciones_negativas,
      GROUP_CONCAT(DISTINCT va.NOMBRE_MATERIA) as materias
    FROM VISTA_ACADEMICA_INSITUS va
    JOIN EVALUACIONES e ON va.DOCUMENTO_DOCENTE = e.DOCUMENTO_DOCENTE
    JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    WHERE va.COD_PROGRAMA = ?
    GROUP BY va.DOCUMENTO_DOCENTE, va.NOMBRE_DOCENTE
    ORDER BY promedio DESC
  `, [programaId]);

  return resultados;
};

// Obtener aspectos por programa
const getAspectosProgramaModel = async (programaId) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      ae.ETIQUETA,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio,
      COUNT(*) as total_evaluaciones,
      ROUND((COUNT(CASE WHEN cv.PUNTAJE >= 0.8 THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_positivo,
      ROUND((COUNT(CASE WHEN cv.PUNTAJE < 0.6 THEN 1 END) / COUNT(*)) * 100, 2) as porcentaje_negativo
    FROM EVALUACIONES e
    JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    JOIN ASPECTOS_EVALUACION ae ON ed.ASPECTO_ID = ae.ID
    JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    JOIN VISTA_ACADEMICA_INSITUS va ON e.DOCUMENTO_ESTUDIANTE = va.DOCUMENTO_ESTUDIANTE
    WHERE va.COD_PROGRAMA = ?
    GROUP BY ae.ETIQUETA
  `, [programaId]);

  return resultados;
};

// Obtener métricas detalladas por docente
const getMetricasDocenteModel = async (documentoDocente, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      va.NOMBRE_DOCENTE,
      va.DOCUMENTO_DOCENTE,
      COUNT(DISTINCT va.CODIGO_MATERIA) as total_materias_dictadas,
      COUNT(DISTINCT e.DOCUMENTO_ESTUDIANTE) as total_estudiantes_evaluadores,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio_general,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE >= 0.8 THEN e.ID END) as evaluaciones_positivas,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE < 0.6 THEN e.ID END) as evaluaciones_negativas,
      GROUP_CONCAT(DISTINCT va.NOMBRE_MATERIA) as materias_dictadas
    FROM VISTA_ACADEMICA_INSITUS va
    LEFT JOIN EVALUACIONES e ON va.DOCUMENTO_DOCENTE = e.DOCUMENTO_DOCENTE
    LEFT JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    LEFT JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    WHERE va.DOCUMENTO_DOCENTE = ? AND va.SEMESTRE_MATRICULA = ?
    GROUP BY va.NOMBRE_DOCENTE, va.DOCUMENTO_DOCENTE
  `, [documentoDocente, semestre]);

  return resultados[0];
};

// Obtener estudiantes pendientes por materia y docente
const getEstudiantesPendientesMateriaModel = async (documentoDocente, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      va.CODIGO_MATERIA,
      va.NOMBRE_MATERIA,
      COUNT(DISTINCT va.DOCUMENTO_ESTUDIANTE) as total_estudiantes,
      COUNT(DISTINCT e.DOCUMENTO_ESTUDIANTE) as estudiantes_evaluados,
      GROUP_CONCAT(DISTINCT 
        CASE WHEN e.ID IS NULL THEN 
          CONCAT(ve.PRIMER_NOMBRE, ' ', ve.PRIMER_APELLIDO)
        END
      ) as estudiantes_pendientes
    FROM VISTA_ACADEMICA_INSITUS va
    LEFT JOIN EVALUACIONES e ON va.DOCUMENTO_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
      AND va.CODIGO_MATERIA = e.CODIGO_MATERIA
    JOIN VISTA_ESTUDIANTE ve ON va.DOCUMENTO_ESTUDIANTE = ve.DOCUMENTO_ESTUDIANTE
    WHERE va.DOCUMENTO_DOCENTE = ? AND va.SEMESTRE_MATRICULA = ?
    GROUP BY va.CODIGO_MATERIA, va.NOMBRE_MATERIA
  `, [documentoDocente, semestre]);

  return resultados;
};

// Obtener ranking de docentes por aspecto
const getRankingDocentesAspectoModel = async (aspectoId, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      va.DOCUMENTO_DOCENTE,
      va.NOMBRE_DOCENTE,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio,
      COUNT(DISTINCT e.DOCUMENTO_ESTUDIANTE) as total_estudiantes_evaluadores,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE >= 0.8 THEN e.ID END) as evaluaciones_positivas,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE < 0.6 THEN e.ID END) as evaluaciones_negativas,
      GROUP_CONCAT(DISTINCT va.NOMBRE_MATERIA) as materias_dictadas
    FROM VISTA_ACADEMICA_INSITUS va
    JOIN EVALUACIONES e ON va.DOCUMENTO_DOCENTE = e.DOCUMENTO_DOCENTE
    JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    WHERE ed.ASPECTO_ID = ? AND va.SEMESTRE_MATRICULA = ?
    GROUP BY va.DOCUMENTO_DOCENTE, va.NOMBRE_DOCENTE
    ORDER BY promedio DESC
  `, [aspectoId, semestre]);

  return resultados;
};

// Obtener resumen de evaluaciones por programa
const getResumenEvaluacionesProgramaModel = async (programaId, semestre) => {
  const pool = getPool();
  const [resultados] = await pool.query(`
    SELECT 
      vp.NOMBRE_PROGRAMA,
      COUNT(DISTINCT va.DOCUMENTO_DOCENTE) as total_docentes,
      COUNT(DISTINCT va.DOCUMENTO_ESTUDIANTE) as total_estudiantes,
      COUNT(DISTINCT va.CODIGO_MATERIA) as total_materias,
      COUNT(DISTINCT e.ID) as total_evaluaciones,
      ROUND(AVG(cv.PUNTAJE), 2) as promedio_general,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE >= 0.8 THEN e.ID END) as evaluaciones_positivas,
      COUNT(DISTINCT CASE WHEN cv.PUNTAJE < 0.6 THEN e.ID END) as evaluaciones_negativas
    FROM VISTA_PROGRAMAS vp
    JOIN VISTA_ACADEMICA_INSITUS va ON vp.CODIGO_PROGRAMA = va.COD_PROGRAMA
    LEFT JOIN EVALUACIONES e ON va.DOCUMENTO_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE
    LEFT JOIN EVALUACION_DETALLE ed ON e.ID = ed.EVALUACION_ID
    LEFT JOIN CONFIGURACION_VALORACION cv ON ed.VALORACION_ID = cv.VALORACION_ID
    WHERE vp.CODIGO_PROGRAMA = ? AND va.SEMESTRE_MATRICULA = ?
    GROUP BY vp.NOMBRE_PROGRAMA
  `, [programaId, semestre]);

  return resultados[0];
};

module.exports = {
  getProgresoEstudianteModel,
  getReporteGeneralModel,
  getReporteAspectosModel,
  getDetalleAspectoModel,
  getDetalleDocenteAspectoModel,
  getReporteFacultadProgramaModel,
  getEstudiantesPendientesModel,
  getDesempenoDocenteProgramaModel,
  getAspectosProgramaModel,
  getMetricasDocenteModel,
  getEstudiantesPendientesMateriaModel,
  getRankingDocentesAspectoModel,
  getResumenEvaluacionesProgramaModel
}; 