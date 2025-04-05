const express = require('express');
const {
  getConfiguracionDetalles,
  getTipos,
  getTipoById,
  createTipo,
  updateTipo,
  deleteTipo
} = require('../../controllers/evaluacion/tiposEvaluaciones.controller');

const { verifyToken } = require('../../middlewares/userAuth.middleware');

const router = express.Router();

router.get('/configuracion/:id', getConfiguracionDetalles);
router.get('/', getTipos);
router.get('/:id', getTipoById);
router.post('/', createTipo);
router.put('/:id', updateTipo);
router.delete('/:id', deleteTipo);

module.exports = router;
