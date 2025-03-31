// src/api/v1/routes/evaluacion/configuracionAspecto.routes.js
const express = require('express');
const {
  getConfiguracionesAspecto,
  getConfiguracionAspectoById,
  createConfiguracionAspecto,
  updateConfiguracionAspecto,
  deleteConfiguracionAspecto
} = require('../../controllers/evaluacion/configuracionAspecto.controller');

const router = express.Router();

router.get('/', getConfiguracionesAspecto);
router.post('/', createConfiguracionAspecto);
router.get('/:id', getConfiguracionAspectoById);
router.put('/:id', updateConfiguracionAspecto);
router.delete('/:id', deleteConfiguracionAspecto);

module.exports = router;
