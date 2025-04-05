// src/api/v1/routes/evaluacion/aspectosEvaluacion.routes.js
const express = require('express');
const {
  getAspectos,
  getAspectoById,
  createAspecto,
  updateAspecto,
  deleteAspecto
} = require('../../controllers/evaluacion/aspectosEvaluacion.controller');

const { aspectoEvaluacionSchema } = require('../../validations/evaluacion/aspectoEvaluacion.validation');
const { verifyToken, checkRole } = require('../../middlewares/userAuth.middleware');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.get('/', getAspectos);
router.post('/', verifyToken, checkRole([1]), validate(aspectoEvaluacionSchema), createAspecto);
router.get('/:id', verifyToken, checkRole([1]), getAspectoById);
router.put('/:id', verifyToken, checkRole([1]), validate(aspectoEvaluacionSchema), updateAspecto);
router.delete('/:id', verifyToken, checkRole([1]), deleteAspecto);

module.exports = router;
