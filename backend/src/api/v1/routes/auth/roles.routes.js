const express = require('express');
const {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
} = require('../../controllers/auth/roles.controller');

const router = express.Router();

router.get('/', getRoles);
router.post('/', createRol);
router.get('/:id', getRolById);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

module.exports = router;
