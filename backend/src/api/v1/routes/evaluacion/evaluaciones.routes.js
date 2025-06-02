// evaluaciones.routes.js

const express = require('express');
const {
  getEvaluaciones,
  getEvaluacionById,
  createEvaluacion,
  updateEvaluacion,
  deleteEvaluacion,
  createEvaluacionU,
  getEvaluacionesByEstudiante,
  getEvaluacionesByEstudianteByConfiguracion,
  getEvaluacionesByDocente
} = require('../../controllers/evaluacion/evaluaciones.controller');

const { verifyToken, checkRole } = require('../../middlewares/userAuth.middleware');

const router = express.Router();

router.post('/insitu/crear', verifyToken, checkRole(['Admin', 'Estudiante']), createEvaluacionU);
router.get('/', getEvaluaciones);
router.post('/', verifyToken, createEvaluacion);
router.get('/:id', getEvaluacionById);
router.put('/:id', verifyToken, updateEvaluacion);
router.delete('/:id', verifyToken, deleteEvaluacion);
router.get('/estudiante/:documentoEstudiante', getEvaluacionesByEstudiante);
router.get('/estudiante/:documentoEstudiante/configuracion/:configuracionId', getEvaluacionesByEstudianteByConfiguracion);
router.get('/docente/:documentoDocente', getEvaluacionesByDocente);

module.exports = router;
