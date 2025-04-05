// src/api/v1/routes/evaluacion/configuracionValoracion.routes.js
const express = require('express');
const {
  getConfiguraciones,
  getConfiguracionById,
  createConfiguracion,
  updateConfiguracion,
  deleteConfiguracion
} = require('../../controllers/evaluacion/configuracionValoracion.controller');

const router = express.Router();

router.get('/', getConfiguraciones);
router.post('/', createConfiguracion);
router.get('/:id', getConfiguracionById);
router.put('/:id', updateConfiguracion);
router.delete('/:id', deleteConfiguracion);

module.exports = router;
