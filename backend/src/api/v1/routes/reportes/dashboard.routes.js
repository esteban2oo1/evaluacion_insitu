const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/reportes/dashboard.controller');

// Rutas del dashboard
router.get('/stats/configuracion/:idConfiguracion', dashboardController.getDashboardStats);
router.get('/aspectos/configuracion/:idConfiguracion', dashboardController.getAspectosPromedio);
router.get('/ranking', dashboardController.getRankingDocentes);
router.get('/podio', dashboardController.getPodioDocentes);

module.exports = router; 