const express = require('express'); 
const { getEstudiantes, getEstudianteById } = require('../../controllers/vista/vistaEstudiante.controller');

const router = express.Router();

router.get('/', getEstudiantes);
router.get('/:documentoEstudiante', getEstudianteById);

module.exports = router;
