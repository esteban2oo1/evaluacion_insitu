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
router.post('/', verifyToken, checkRole(['Admin']), validate(aspectoEvaluacionSchema), createAspecto);
router.get('/:id', verifyToken, checkRole(['Admin']), getAspectoById);
router.put('/:id', verifyToken, checkRole(['Admin']), validate(aspectoEvaluacionSchema), updateAspecto);
router.delete('/:id', verifyToken, checkRole(['Admin']), deleteAspecto);

module.exports = router;
