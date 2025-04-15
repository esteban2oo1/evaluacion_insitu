const express = require('express');
const router = express.Router();
const {
    getEstudianteEvaluacionesController,
    getEstudiantesEvaluacionesController,
    getEstudiantesByDocenteMateriaGrupoController
} = require('../../controllers/reportes/estudiantes.controller');

// Obtener estadísticas de evaluaciones de un estudiante específico
router.get('/:idEstudiante', getEstudianteEvaluacionesController);

// Obtener lista de todos los estudiantes con sus estadísticas de evaluación
router.get('/', getEstudiantesEvaluacionesController);

// Obtener estudiantes por docente, materia y grupo
router.get('/docente/:idDocente/materia/:codAsignatura/grupo/:grupo', getEstudiantesByDocenteMateriaGrupoController);

module.exports = router; 