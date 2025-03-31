const express = require('express');
const { login, getProfile } = require('../../controllers/auth/userAuth.controller');
const { verifyToken } = require('../../middlewares/userAuth.middleware');
const router = express.Router();

// Login route
router.post('/login', login);

// Profile route with token verification
router.get('/profile', verifyToken, getProfile);

module.exports = router;
