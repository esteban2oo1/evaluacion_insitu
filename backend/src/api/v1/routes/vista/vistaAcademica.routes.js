const express = require('express');
const { getVistaAcademica, getVistaAcademicaById, getPeriodos, getSedes, getProgramas, getSemestres,  getGrupos } = require('../../controllers/vista/vistaAcademica.controller');
const { verifyToken, checkRole } = require('../../middlewares/userAuth.middleware');

const router = express.Router();


router.get('/periodos', getPeriodos);       
router.get('/sedes', getSedes);
router.get('/programas', getProgramas);
router.get('/semestres', getSemestres);
router.get('/grupos', getGrupos);
router.get('/:id', getVistaAcademicaById);
router.get('/', getVistaAcademica);

module.exports = router;
