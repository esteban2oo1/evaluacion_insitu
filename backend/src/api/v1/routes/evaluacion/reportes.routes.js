const express = require('express');
const {
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
} = require('../../controllers/evaluacion/reportes.controller');

const { verifyToken, checkRole } = require('../../middlewares/userAuth.middleware');

const router = express.Router();

// Reporte de progreso por estudiante
router.get('/progreso/:documentoEstudiante', verifyToken, getProgresoEstudiante);

// Reporte general de evaluaciones
router.get('/general', verifyToken, checkRole(['Admin']), getReporteGeneral);

// Reporte de aspectos evaluados
router.get('/aspectos', verifyToken, checkRole(['Admin']), getReporteAspectos);

// Reportes específicos para directores de programa
router.get('/facultad/:facultadId/programa/:programaId', verifyToken, checkRole(['Admin']), getReporteFacultadPrograma);
router.get('/estudiantes-pendientes/:facultadId/:programaId/:semestre', verifyToken, checkRole(['Admin']), getEstudiantesPendientes);
router.get('/desempeno-docente/programa/:programaId', verifyToken, checkRole(['Admin']), getDesempenoDocentePrograma);
router.get('/aspectos/programa/:programaId', verifyToken, checkRole(['Admin']), getAspectosPrograma);

// Endpoints para detalles de aspectos
router.get('/aspectos/:aspectoId', verifyToken, checkRole(['Admin']), getDetalleAspecto);
router.get('/aspectos/:aspectoId/docente/:documentoDocente', verifyToken, checkRole(['Admin']), getDetalleDocenteAspecto);

// Nuevos endpoints para métricas detalladas
router.get('/docente/:documentoDocente/metricas', verifyToken, checkRole(['Admin']), getMetricasDocente);
router.get('/docente/:documentoDocente/estudiantes-pendientes', verifyToken, checkRole(['Admin']), getEstudiantesPendientesMateria);
router.get('/aspectos/:aspectoId/ranking', verifyToken, checkRole(['Admin']), getRankingDocentesAspecto);
router.get('/programa/:programaId/resumen', verifyToken, checkRole(['Admin']), getResumenEvaluacionesPrograma);

module.exports = router; 