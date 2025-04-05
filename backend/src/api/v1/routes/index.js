// src/api/v1/routes/index.js
const express = require('express');

// auth
const rolesRoutes = require('./auth/roles.routes.js');
const userAuthRoutes = require('./auth/userAuth.routes.js');

// evaluacion
const aspectosEvaluacionRoutes = require('./evaluacion/aspectosEvaluacion.routes');
const escalaValoracionRoutes = require('./evaluacion/escalaValoracion.routes');
const evaluacionesRoutes = require('./evaluacion/evaluaciones.routes');
const evaluacionDetalleRoutes = require('./evaluacion/evaluacionDetalle.routes');
    // configuracion
const tiposEvaluacionesRoutes = require('./evaluacion/tiposEvaluaciones.routes');
const configuracionEvaluacionRoutes = require('./evaluacion/configuracionEvaluacion.routes');
const configuracionAspectoRoutes = require('./evaluacion/configuracionAspecto.routes.js');
const configuracionValoracionRoutes = require('./evaluacion/configuracionValoracion.routes.js');

// vistas
const vistaProgramasRoutes = require('./vista/vistaProgramas.routes');
const vistaEstudianteRoutes = require('./vista/vistaEstudiante.routes');
const vistaAcademicaRoutes = require('./vista/vistaAcademica.routes');


const router = express.Router();

// Ruta base de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Sistema de Evaluación Docente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      evaluaciones: '/api/v1/evaluaciones',
      aspectosEvaluacion: '/api/v1/aspectos-evaluacion',
      escalaValoracion: '/api/v1/escala-valoracion',
      programas: '/api/v1/programas',
      estudiantes: '/api/v1/estudiantes',
      academica: '/api/v1/academica'
    },
    documentation: '/api-docs'
  });
});

// API Routes

// vistas
router.use('/programas', vistaProgramasRoutes);
router.use('/estudiantes', vistaEstudianteRoutes);
router.use('/academica', vistaAcademicaRoutes);

// evaluacion
router.use('/aspectos-evaluacion', aspectosEvaluacionRoutes);
router.use('/escala-valoracion', escalaValoracionRoutes);
router.use('/evaluaciones', evaluacionesRoutes);
router.use('/evaluacion-detalle', evaluacionDetalleRoutes);

    // configuracion
router.use('/tipos-evaluaciones', tiposEvaluacionesRoutes);
router.use('/configuracion-evaluacion', configuracionEvaluacionRoutes);
router.use('/configuracion-aspecto', configuracionAspectoRoutes);
router.use('/configuracion-valoracion', configuracionValoracionRoutes);
// auth
router.use('/roles', rolesRoutes);
router.use('/auth', userAuthRoutes);

module.exports = router;

