// src/api/v1/routes/evaluacion/configuracionAspecto.routes.js
const express = require('express');
const {
  getConfiguracionesAspecto,
  getConfiguracionAspectoById,
  createConfiguracionAspecto,
  updateConfiguracionAspecto,
  deleteConfiguracionAspecto,
  updateEstadoConfiguracionAspecto
} = require('../../controllers/evaluacion/configuracionAspecto.controller');

const router = express.Router();

router.patch('/:id/estado', updateEstadoConfiguracionAspecto);
router.get('/', getConfiguracionesAspecto);
router.post('/', createConfiguracionAspecto);
router.get('/:id', getConfiguracionAspectoById);
router.put('/:id', updateConfiguracionAspecto);
router.delete('/:id', deleteConfiguracionAspecto);

module.exports = router;
