/**
 * @swagger
 * components:
 *   schemas:
 *     Programa:
 *       type: object
 *       properties:
 *         SEDE:
 *           type: string
 *           example: BOG
 *         CODIGO_PROGRAMA:
 *           type: string
 *           example: 1001
 *         SNIES_PROGRAMA:
 *           type: string
 *           example: 123456789
 *         NOMBRE_PROGRAMA:
 *           type: string
 *           example: Ingeniería de Sistemas
 *         CODIGO_FACULTAD:
 *           type: string
 *           example: F001
 *         NOMBRE_FACULTAD:
 *           type: string
 *           example: Facultad de Ingeniería
 *         MODALIDAD:
 *           type: string
 *           enum: [PRESENCIAL, VIRTUAL]
 *           example: PRESENCIAL
 *         TIPO:
 *           type: string
 *           enum: [PREGRADO, POSGRADO]
 *           example: PREGRADO
 */

/**
 * @swagger
 * /programas:
 *   get:
 *     summary: Get all programas
 *     tags: [Programas]
 *     responses:
 *       200:
 *         description: List of programas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Programa'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /programas/{codigoPrograma}:
 *   get:
 *     summary: Get programa by ID
 *     tags: [Programas]
 *     parameters:
 *       - in: path
 *         name: codigoPrograma
 *         schema:
 *           type: string
 *         required: true
 *         description: Código del programa
 *     responses:
 *       200:
 *         description: Programa data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Programa'
 *       404:
 *         description: Programa not found
 *       500:
 *         description: Server error
 */
