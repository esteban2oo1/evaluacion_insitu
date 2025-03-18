const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 * 
 * @route   POST /api/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout and invalidate token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 * 
 * @route   POST /api/logout
 * @desc    Logout and invalidate token
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get current user info
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 * 
 * @route   GET /api/user
 * @desc    Get current user info
 * @access  Private
 */
router.get('/user', authenticateToken, authController.getProfile);

module.exports = router;