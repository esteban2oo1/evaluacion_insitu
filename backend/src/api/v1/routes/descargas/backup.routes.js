const express = require('express');
const { descargarBackup } = require('../../controllers/descargas/backup.controller');

const router = express.Router();

router.get('/', descargarBackup);

module.exports = router;
