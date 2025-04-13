// evaluaciones.routes.js

const express = require('express');
const {
  getEvaluaciones,
  getEvaluacionById,
  getEvaluacionesByEstudiante,
  getEvaluacionesByDocente,
  createEvaluacion,
  updateEvaluacion,
  deleteEvaluacion,
  createEvaluacionU,
  getEvaluacionesPendientes
} = require('../../controllers/evaluacion/evaluaciones.controller');

const { verifyToken } = require('../../middlewares/userAuth.middleware');

const router = express.Router();

// Rutas para obtener evaluaciones
router.get('/', getEvaluaciones);
router.get('/pendientes', verifyToken, getEvaluacionesPendientes);
router.get('/:id', getEvaluacionById);
router.get('/estudiante/:documentoEstudiante', getEvaluacionesByEstudiante);
router.get('/docente/:documentoDocente', getEvaluacionesByDocente);

// Rutas protegidas
router.post('/insitu/crear', verifyToken, createEvaluacionU);
router.post('/', verifyToken, createEvaluacion);
router.put('/:id', verifyToken, updateEvaluacion);
router.delete('/:id', verifyToken, deleteEvaluacion);

module.exports = router;
