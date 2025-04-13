const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');
const {
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
} = require('../../models/evaluacion/reportes.model');

// Reporte de progreso de evaluación por estudiante
const getProgresoEstudiante = async (req, res) => {
  try {
    const { documentoEstudiante } = req.params;
    const { semestre = '2025-1' } = req.query;

    const resultados = await getProgresoEstudianteModel(documentoEstudiante, semestre);

    const {
      total_materias,
      evaluaciones_completadas,
      materias_pendientes
    } = resultados;

    const evaluaciones_pendientes = total_materias - evaluaciones_completadas;
    const porcentaje_completado = total_materias > 0 ? 
      (evaluaciones_completadas / total_materias) * 100 : 0;

    successResponse(res, {
      data: {
        total_evaluaciones: total_materias,
        evaluaciones_completadas,
        evaluaciones_pendientes,
        porcentaje_completado: porcentaje_completado.toFixed(2),
        materias_pendientes: materias_pendientes ? materias_pendientes.split(',').map(materia => {
          const [nombre_materia, nombre_docente] = materia.split(' - ');
          return {
            nombre_materia,
            nombre_docente
          };
        }) : []
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Reporte general de evaluaciones realizadas vs pendientes
const getReporteGeneral = async (req, res) => {
  try {
    const { semestre = '2025-1' } = req.query;

    const resultados = await getReporteGeneralModel(semestre);

    const {
      total_estudiantes,
      total_materias,
      evaluaciones_completadas
    } = resultados;

    const evaluaciones_pendientes = total_materias - evaluaciones_completadas;
    const porcentaje_completado = total_materias > 0 ? 
      (evaluaciones_completadas / total_materias) * 100 : 0;

    successResponse(res, {
      data: {
        total_estudiantes,
        total_evaluaciones: total_materias,
        evaluaciones_completadas,
        evaluaciones_pendientes,
        porcentaje_completado: porcentaje_completado.toFixed(2),
        semestre_actual: semestre
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Reporte de aspectos evaluados
const getReporteAspectos = async (req, res) => {
  try {
    const { semestre = '2025-1' } = req.query;

    const resultados = await getReporteAspectosModel(semestre);

    // Calcular estadísticas generales
    const total_aspectos = resultados.length;
    const promedio_general = resultados.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0) / total_aspectos;

    successResponse(res, {
      data: {
        total_aspectos,
        promedio_general: promedio_general.toFixed(2),
        semestre_actual: semestre,
        aspectos: resultados
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Detalle de un aspecto específico
const getDetalleAspecto = async (req, res) => {
  try {
    const { aspectoId } = req.params;
    const { semestre = '2025-1' } = req.query;

    const { aspecto, resultados } = await getDetalleAspectoModel(aspectoId, semestre);

    if (resultados.length === 0) {
      return errorResponse(res, { code: 404, message: "No se encontraron datos para el aspecto especificado" });
    }

    successResponse(res, {
      data: {
        aspecto,
        semestre_actual: semestre,
        total_docentes: resultados.length,
        docentes: resultados.map(docente => ({
          documento: docente.DOCUMENTO_DOCENTE,
          nombre: docente.NOMBRE_DOCENTE,
          promedio: docente.promedio,
          total_evaluaciones: docente.total_evaluaciones,
          porcentaje_positivo: docente.porcentaje_positivo,
          porcentaje_negativo: docente.porcentaje_negativo,
          total_estudiantes_evaluadores: docente.total_estudiantes_evaluadores,
          materias_dictadas: docente.materias_dictadas.split(',')
        }))
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Detalle de un docente en un aspecto específico
const getDetalleDocenteAspecto = async (req, res) => {
  try {
    const { aspectoId, documentoDocente } = req.params;
    const { semestre = '2025-1' } = req.query;

    const resultados = await getDetalleDocenteAspectoModel(aspectoId, documentoDocente, semestre);

    if (resultados.length === 0) {
      return errorResponse(res, { code: 404, message: "No se encontraron datos para el docente y aspecto especificados" });
    }

    // Calcular estadísticas generales
    const total_evaluaciones = resultados.length;
    const promedio = resultados.reduce((acc, curr) => acc + parseFloat(curr.PUNTAJE), 0) / total_evaluaciones;
    const evaluaciones_positivas = resultados.filter(r => r.PUNTAJE >= 0.8).length;
    const evaluaciones_negativas = resultados.filter(r => r.PUNTAJE < 0.6).length;

    successResponse(res, {
      data: {
        docente: {
          documento: resultados[0].DOCUMENTO_DOCENTE,
          nombre: resultados[0].NOMBRE_DOCENTE
        },
        semestre_actual: semestre,
        total_evaluaciones,
        promedio: promedio.toFixed(2),
        porcentaje_positivo: ((evaluaciones_positivas / total_evaluaciones) * 100).toFixed(2),
        porcentaje_negativo: ((evaluaciones_negativas / total_evaluaciones) * 100).toFixed(2),
        evaluaciones: resultados.map(eval => ({
          documento_estudiante: eval.DOCUMENTO_ESTUDIANTE,
          nombre_estudiante: eval.nombre_estudiante,
          materia: eval.NOMBRE_MATERIA,
          puntaje: eval.PUNTAJE,
          valoracion: eval.valoracion,
          comentario: eval.COMENTARIO
        }))
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Reporte general por facultad y programa
const getReporteFacultadPrograma = async (req, res) => {
  try {
    const { facultadId, programaId } = req.params;

    const data = await getReporteFacultadProgramaModel(facultadId, programaId);

    if (!data) {
      return errorResponse(res, { code: 404, message: "No se encontraron datos para la facultad y programa especificados" });
    }

    const porcentaje_completado = data.total_evaluaciones > 0 ? 
      (data.evaluaciones_completadas / data.total_evaluaciones) * 100 : 0;

    successResponse(res, {
      data: {
        ...data,
        porcentaje_completado: porcentaje_completado.toFixed(2)
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Reporte de estudiantes pendientes por semestre
const getEstudiantesPendientes = async (req, res) => {
  try {
    const { facultadId, programaId, semestre } = req.params;

    const resultados = await getEstudiantesPendientesModel(facultadId, programaId, semestre);

    successResponse(res, {
      data: {
        total_estudiantes_pendientes: resultados.length,
        estudiantes: resultados
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Reporte de desempeño docente por programa
const getDesempenoDocentePrograma = async (req, res) => {
  try {
    const { programaId } = req.params;

    const resultados = await getDesempenoDocenteProgramaModel(programaId);

    // Calcular estadísticas generales
    const total_docentes = resultados.length;
    const mejor_docente = resultados[0];
    const peor_docente = resultados[total_docentes - 1];
    const promedio_general = resultados.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0) / total_docentes;

    successResponse(res, {
      data: {
        total_docentes,
        mejor_docente: {
          documento: mejor_docente.DOCUMENTO_DOCENTE,
          nombre: mejor_docente.NOMBRE_DOCENTE,
          promedio: mejor_docente.promedio,
          evaluaciones_positivas: mejor_docente.evaluaciones_positivas,
          materias: mejor_docente.materias.split(',')
        },
        peor_docente: {
          documento: peor_docente.DOCUMENTO_DOCENTE,
          nombre: peor_docente.NOMBRE_DOCENTE,
          promedio: peor_docente.promedio,
          evaluaciones_negativas: peor_docente.evaluaciones_negativas,
          materias: peor_docente.materias.split(',')
        },
        promedio_general: promedio_general.toFixed(2),
        docentes: resultados.map(docente => ({
          documento: docente.DOCUMENTO_DOCENTE,
          nombre: docente.NOMBRE_DOCENTE,
          promedio: docente.promedio,
          total_evaluaciones: docente.total_evaluaciones,
          evaluaciones_positivas: docente.evaluaciones_positivas,
          evaluaciones_negativas: docente.evaluaciones_negativas,
          materias: docente.materias.split(',')
        }))
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Reporte de aspectos por programa
const getAspectosPrograma = async (req, res) => {
  try {
    const { programaId } = req.params;

    const resultados = await getAspectosProgramaModel(programaId);

    // Calcular estadísticas generales
    const total_aspectos = resultados.length;
    const promedio_general = resultados.reduce((acc, curr) => acc + parseFloat(curr.promedio), 0) / total_aspectos;

    successResponse(res, {
      data: {
        total_aspectos,
        promedio_general: promedio_general.toFixed(2),
        aspectos: resultados
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Obtener métricas detalladas de un docente
const getMetricasDocente = async (req, res) => {
  try {
    const { documentoDocente } = req.params;
    const { semestre = '2025-1' } = req.query;

    const resultados = await getMetricasDocenteModel(documentoDocente, semestre);

    if (!resultados) {
      return errorResponse(res, { code: 404, message: "No se encontraron datos para el docente especificado" });
    }

    successResponse(res, {
      data: {
        ...resultados,
        materias_dictadas: resultados.materias_dictadas ? resultados.materias_dictadas.split(',') : [],
        porcentaje_positivo: resultados.total_estudiantes_evaluadores > 0 ? 
          (resultados.evaluaciones_positivas / resultados.total_estudiantes_evaluadores) * 100 : 0,
        porcentaje_negativo: resultados.total_estudiantes_evaluadores > 0 ? 
          (resultados.evaluaciones_negativas / resultados.total_estudiantes_evaluadores) * 100 : 0
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Obtener estudiantes pendientes por materia de un docente
const getEstudiantesPendientesMateria = async (req, res) => {
  try {
    const { documentoDocente } = req.params;
    const { semestre = '2025-1' } = req.query;

    const resultados = await getEstudiantesPendientesMateriaModel(documentoDocente, semestre);

    successResponse(res, {
      data: resultados.map(materia => ({
        ...materia,
        estudiantes_pendientes: materia.estudiantes_pendientes ? materia.estudiantes_pendientes.split(',') : [],
        porcentaje_evaluado: (materia.estudiantes_evaluados / materia.total_estudiantes) * 100
      }))
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Obtener ranking de docentes por aspecto
const getRankingDocentesAspecto = async (req, res) => {
  try {
    const { aspectoId } = req.params;
    const { semestre = '2025-1' } = req.query;

    const resultados = await getRankingDocentesAspectoModel(aspectoId, semestre);

    successResponse(res, {
      data: resultados.map(docente => ({
        ...docente,
        materias_dictadas: docente.materias_dictadas ? docente.materias_dictadas.split(',') : [],
        porcentaje_positivo: docente.total_estudiantes_evaluadores > 0 ? 
          (docente.evaluaciones_positivas / docente.total_estudiantes_evaluadores) * 100 : 0,
        porcentaje_negativo: docente.total_estudiantes_evaluadores > 0 ? 
          (docente.evaluaciones_negativas / docente.total_estudiantes_evaluadores) * 100 : 0
      }))
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Obtener resumen de evaluaciones por programa
const getResumenEvaluacionesPrograma = async (req, res) => {
  try {
    const { programaId } = req.params;
    const { semestre = '2025-1' } = req.query;

    const resultados = await getResumenEvaluacionesProgramaModel(programaId, semestre);

    if (!resultados) {
      return errorResponse(res, { code: 404, message: "No se encontraron datos para el programa especificado" });
    }

    successResponse(res, {
      data: {
        ...resultados,
        porcentaje_positivo: resultados.total_evaluaciones > 0 ? 
          (resultados.evaluaciones_positivas / resultados.total_evaluaciones) * 100 : 0,
        porcentaje_negativo: resultados.total_evaluaciones > 0 ? 
          (resultados.evaluaciones_negativas / resultados.total_evaluaciones) * 100 : 0
      }
    });
  } catch (error) {
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

module.exports = {
  getProgresoEstudiante,
  getReporteGeneral,
  getReporteAspectos,
  getDetalleAspecto,
  getDetalleDocenteAspecto,
  getReporteFacultadPrograma,
  getEstudiantesPendientes,
  getDesempenoDocentePrograma,
  getAspectosPrograma,
  getMetricasDocente,
  getEstudiantesPendientesMateria,
  getRankingDocentesAspecto,
  getResumenEvaluacionesPrograma
}; 