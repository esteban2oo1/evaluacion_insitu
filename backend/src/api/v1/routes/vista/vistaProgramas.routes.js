const express = require('express');
const { getProgramas, getProgramaById } = require('../../controllers/vista/vistaProgramas.controller');

const router = express.Router();

router.get('/', getProgramas);
router.get('/:codigoPrograma', getProgramaById);

module.exports = router;
