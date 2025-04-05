const express = require('express');
const { getVistaAcademica, getVistaAcademicaById } = require('../../controllers/vista/vistaAcademica.controller');

const router = express.Router();

router.get('/', getVistaAcademica);
router.get('/:id', getVistaAcademicaById);

module.exports = router;
