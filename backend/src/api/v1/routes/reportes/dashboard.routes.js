const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/reportes/dashboard.controller');

// Rutas del dashboard
router.get('/stats', dashboardController.getDashboardStats);
router.get('/aspectos', dashboardController.getAspectosPromedio);
router.get('/ranking', dashboardController.getRankingDocentes);
router.get('/podio', dashboardController.getPodioDocentes);

module.exports = router; 