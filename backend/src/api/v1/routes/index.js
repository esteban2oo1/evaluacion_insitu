// src/api/v1/routes/index.js
const express = require('express');

// auth
const rolesRoutes = require('./auth/roles.routes.js');
const userAuthRoutes = require('./auth/userAuth.routes.js');
const userRoleRoutes = require('./auth/userRole.routes.js');

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
const vistaEstudianteRoutes = require('./vista/vistaEstudiante.routes');
const vistaAcademicaRoutes = require('./vista/vistaAcademica.routes');

// reportes
const dashboardRoutes = require('./reportes/dashboard.routes');
const estudiantesRoutes = require('./reportes/estudiantes.routes');
const docentesRoutes = require('./reportes/docentes.routes');

// descargar informe

const informeRoutes = require('./descargas/informe.routes');
const backupRoutes = require('./descargas/backup.routes');  

const router = express.Router();

// Ruta base de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    endpoints: {
      auth: '/api/v1/auth',
      evaluaciones: '/api/v1/evaluaciones',
      aspectosEvaluacion: '/api/v1/aspectos-evaluacion',
      escalaValoracion: '/api/v1/escala-valoracion',
      estudiantes: '/api/v1/estudiantes',
      academica: '/api/v1/academica',
      dashboard: '/api/v1/dashboard',
      reportesEstudiantes: '/api/v1/reportes/estudiantes',
      userRoles: '/api/v1/user-roles',
      informeDocentes: '/api/v1/informe-docentes',
      backup: '/api/v1/backup'
    },
    documentation: '/api-docs'
  });
});

// API Routes

// vistas
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
router.use('/user-roles', userRoleRoutes);

// reportes
router.use('/dashboard', dashboardRoutes);
router.use('/reportes/estudiantes', estudiantesRoutes);
router.use('/reportes/docentes', docentesRoutes);

// descargas

router.use('/informe-docentes', informeRoutes);
router.use('/backup', backupRoutes);

module.exports = router;

