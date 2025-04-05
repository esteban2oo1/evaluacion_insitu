/**
 * @swagger
 * components:
 *   schemas:
 *     VistaAcademica:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 1
 *         SEMESTRE_MATRICULA:
 *           type: string
 *           example: 2024-1
 *         SEDE:
 *           type: string
 *           example: BOG
 *         CODIGO_ESTUDIANTE:
 *           type: string
 *           example: 100200
 *         DOCUMENTO_ESTUDIANTE:
 *           type: string
 *           example: 1234567890
 *         CODIGO_MATERIA:
 *           type: string
 *           example: MAT101
 *         NOMBRE_MATERIA:
 *           type: string
 *           example: Matemáticas Básicas
 *         CREDITOS_MATERIA:
 *           type: integer
 *           example: 3
 *         NOMBRE_DOCENTE:
 *           type: string
 *           example: Juan Pérez
 *         DOCUMENTO_DOCENTE:
 *           type: string
 *           example: 987654321
 *         CORREO_DOCENTE:
 *           type: string
 *           example: juan.perez@universidad.edu
 *         ESTADO_MATERIA:
 *           type: string
 *           enum: [INSCRITO, CANCELADA, APROBADA, REPROBADA]
 *           example: INSCRITO
 *         NOTA_CORTE_1:
 *           type: number
 *           format: float
 *           example: 3.5
 *         PESO_NOTA_1:
 *           type: integer
 *           example: 30
 *         NOTA_CORTE_2:
 *           type: number
 *           format: float
 *           example: 4.0
 *         PESO_NOTA_2:
 *           type: integer
 *           example: 30
 *         NOTA_CORTE_3:
 *           type: number
 *           format: float
 *           example: 3.8
 *         PESO_NOTA_3:
 *           type: integer
 *           example: 40
 *         VECES_INSCRITO:
 *           type: integer
 *           example: 1
 *         VECES_PERDIDA:
 *           type: integer
 *           example: 0
 *         VECES_CANCELADA:
 *           type: integer
 *           example: 0
 */

/**
 * @swagger
 * /academica:
 *   get:
 *     summary: Get all academic data
 *     tags: [Vista Academica]
 *     responses:
 *       200:
 *         description: List of academic data
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
 *                     $ref: '#/components/schemas/VistaAcademica'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /academica/{id}:
 *   get:
 *     summary: Get academic data by ID
 *     tags: [Vista Academica]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro académico
 *     responses:
 *       200:
 *         description: Academic data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/VistaAcademica'
 *       404:
 *         description: Academic data not found
 *       500:
 *         description: Server error
 */
