const express = require('express');

const { login, getProfile } = require('../../controllers/auth/userAuth.controller');
const { verifyToken } = require('../../middlewares/userAuth.middleware');
const { loginSchema } = require('../../validations/auth/auth.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

// Login route
router.post('/login', validate(loginSchema), login);

// Profile route with token verification
router.get('/profile', verifyToken, getProfile);

module.exports = router;
