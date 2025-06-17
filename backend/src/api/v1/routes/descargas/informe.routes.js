const express = require('express');
const router = express.Router();
const { descargarInformeDocentes } = require('../../controllers/descargas/informe.controller');

router.get('/', descargarInformeDocentes);

module.exports = router;
