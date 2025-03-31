const express = require('express');
const {
  getConfiguraciones,
  getConfiguracionById,
  createConfiguracion,
  updateConfiguracion,
  deleteConfiguracion,
} = require('../../controllers/evaluacion/configuracionEvaluacion.controller');

const configuracionEvaluacionSchema = require('../../validations/evaluacion/configuracionEvaluacion.validation');
const { verifyToken, checkRole } = require('../../middlewares/userAuth.middleware');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.get('/', getConfiguraciones);
router.post('/', verifyToken, checkRole([1]), validate(configuracionEvaluacionSchema), createConfiguracion);
router.get('/:id', verifyToken, checkRole([1]), getConfiguracionById);
router.put('/:id', verifyToken, checkRole([1]), validate(configuracionEvaluacionSchema), updateConfiguracion);
router.delete('/:id', verifyToken, checkRole([1]), deleteConfiguracion);

module.exports = router;
