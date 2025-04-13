const express = require('express');
const {
  getEscalas,
  getEscalaById,
  createEscala,
  updateEscala,
  deleteEscala
} = require('../../controllers/evaluacion/escalaValoracion.controller');

const escalaValoracionSchema = require('../../validations/evaluacion/escalaValoracion.validation');
const { verifyToken, checkRole } = require('../../middlewares/userAuth.middleware');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.get('/', getEscalas);
router.post('/', verifyToken, checkRole(['Admin']), validate(escalaValoracionSchema), createEscala);
router.get('/:id', verifyToken, checkRole(['Admin']), getEscalaById);
router.put('/:id', verifyToken, checkRole(['Admin']), validate(escalaValoracionSchema), updateEscala);
router.delete('/:id', verifyToken, checkRole(['Admin']), deleteEscala);

module.exports = router;
