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
router.post('/', verifyToken, checkRole([1]), validate(escalaValoracionSchema), createEscala);
router.get('/:id', verifyToken, checkRole([1]), getEscalaById);
router.put('/:id', verifyToken, checkRole([1]), validate(escalaValoracionSchema), updateEscala);
router.delete('/:id', verifyToken, checkRole([1]), deleteEscala);

module.exports = router;
