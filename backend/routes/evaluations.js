const express = require('express');
const router = express.Router();
const evaluationsController = require('../controllers/evaluations');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Evaluation management endpoints
 */

/**
 * @swagger
 * /dashboard/evaluaciones:
 *   get:
 *     summary: Get pending evaluations for dashboard
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending evaluations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   teacher:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Server error
 * 
 * @route   GET /api/dashboard/evaluaciones
 * @desc    Get pending evaluations for dashboard
 * @access  Private
 */
router.get('/dashboard/evaluaciones', authenticateToken, evaluationsController.getDashboardEvaluations);

/**
 * @swagger
 * /evaluaciones/iniciar:
 *   post:
 *     summary: Initialize a new evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - subjectId
 *             properties:
 *               teacherId:
 *                 type: integer
 *                 description: ID of the teacher being evaluated
 *               subjectId:
 *                 type: integer
 *                 description: ID of the subject
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of evaluation
 *     responses:
 *       201:
 *         description: Evaluation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       403:
 *         description: Forbidden, user doesn't have required role
 *       500:
 *         description: Server error
 * 
 * @route   POST /api/evaluaciones/iniciar
 * @desc    Initialize a new evaluation
 * @access  Private (evaluador, admin)
 */
router.post('/evaluaciones/iniciar', authenticateToken, evaluationsController.initializeEvaluation);

/**
 * @swagger
 * /evaluaciones/{id}:
 *   get:
 *     summary: Get evaluation details
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Evaluation ID
 *     responses:
 *       200:
 *         description: Evaluation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 teacher:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 subject:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 aspects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       score:
 *                         type: integer
 *                       comments:
 *                         type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Evaluation not found
 *       500:
 *         description: Server error
 * 
 * @route   GET /api/evaluaciones/:id
 * @desc    Get evaluation details
 * @access  Private
 */
router.get('/evaluaciones/:id', authenticateToken, evaluationsController.getEvaluationDetails);

/**
 * @swagger
 * /aspectos-evaluacion:
 *   get:
 *     summary: Get aspects and scale
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: List of evaluation aspects and scale
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 aspects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                 scale:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: integer
 *                       label:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Server error
 * 
 * @route   GET /api/aspectos-evaluacion
 * @desc    Get aspects and scale
 * @access  Public
 */
router.get('/aspectos-evaluacion', evaluationsController.getAspectsAndScale);

/**
 * @swagger
 * /evaluaciones/{id}:
 *   post:
 *     summary: Save or update evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Evaluation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aspects
 *             properties:
 *               aspects:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Aspect ID
 *                     score:
 *                       type: integer
 *                       description: Score value
 *                     comments:
 *                       type: string
 *                       description: Comments for this aspect
 *     responses:
 *       200:
 *         description: Evaluation saved successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Evaluation not found
 *       500:
 *         description: Server error
 * 
 * @route   POST /api/evaluaciones/:id
 * @desc    Save or update evaluation
 * @access  Private
 */
router.post('/evaluaciones/:id', authenticateToken, evaluationsController.saveEvaluation);

/**
 * @swagger
 * /evaluaciones/{id}/enviar:
 *   post:
 *     summary: Submit evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Evaluation ID
 *     responses:
 *       200:
 *         description: Evaluation submitted successfully
 *       400:
 *         description: Invalid request or incomplete evaluation
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       404:
 *         description: Evaluation not found
 *       500:
 *         description: Server error
 * 
 * @route   POST /api/evaluaciones/:id/enviar
 * @desc    Submit evaluation
 * @access  Private
 */
router.post('/evaluaciones/:id/enviar', authenticateToken, evaluationsController.submitEvaluation);

module.exports = router;