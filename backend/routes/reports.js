const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports and notifications management
 */

/**
 * @swagger
 * /reportes/desempeno-docente/{id}:
 *   get:
 *     summary: Get teacher performance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher performance report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 evaluations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       subject:
 *                         type: string
 *                       averageScore:
 *                         type: number
 *                         format: float
 *                 averageScores:
 *                   type: object
 *                   properties:
 *                     overall:
 *                       type: number
 *                       format: float
 *                     byAspect:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           aspect:
 *                             type: string
 *                           score:
 *                             type: number
 *                             format: float
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Teacher not found or no evaluations available
 *       500:
 *         description: Server error
 * 
 * @route   GET /api/reportes/desempeno-docente/:id
 * @desc    Get teacher performance report
 * @access  Private
 */
router.get('/reportes/desempeno-docente/:id', authenticateToken, reportsController.getTeacherPerformanceReport);

/**
 * @swagger
 * /notificaciones:
 *   get:
 *     summary: Get notifications
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   message:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [info, warning, alert]
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   read:
 *                     type: boolean
 *                   relatedId:
 *                     type: integer
 *                     description: ID related to the notification (e.g., evaluation ID)
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 * 
 * @route   GET /api/notificaciones
 * @desc    Get notifications
 * @access  Private
 */
router.get('/notificaciones', authenticateToken, reportsController.getNotifications);

/**
 * @swagger
 * /notificaciones/{id}/leer:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 * 
 * @route   PUT /api/notificaciones/:id/leer
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/notificaciones/:id/leer', authenticateToken, reportsController.markNotificationAsRead);

module.exports = router;