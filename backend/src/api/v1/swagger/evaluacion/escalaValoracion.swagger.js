/**
 * @swagger
 * components:
 *   schemas:
 *     EscalaValoracion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 1
 *         VALOR:
 *           type: string
 *           maxLength: 1
 *           example: A
 *         ETIQUETA:
 *           type: string
 *           maxLength: 50
 *           example: Alta
 *         DESCRIPCION:
 *           type: string
 *           example: Escala de valoración alta
 *         PUNTAJE:
 *           type: number
 *           format: decimal
 *           example: 4.50
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: number
 *           description: Estado del aspecto (1 para activo, 0 para inactivo)
 *     EscalaValoracionInput:
 *       type: object
 *       required:
 *         - VALOR
 *         - ETIQUETA
 *         - PUNTAJE
 *         - ORDEN
 *       properties:
 *         VALOR:
 *           type: string
 *           maxLength: 1
 *           example: A
 *         ETIQUETA:
 *           type: string
 *           maxLength: 50
 *           example: Alta
 *         DESCRIPCION:
 *           type: string
 *           example: Escala de valoración alta
 *         PUNTAJE:
 *           type: number
 *           format: decimal
 *           example: 5.00
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: number
 *           description: Estado del aspecto (1 para activo, 0 para inactivo)
 *           example: 1
 */

/**
 * @swagger
 * /escala-valoracion:
 *   get:
 *     summary: Obtener todas las escalas de valoración
 *     tags: [Escalas de Valoración]
 *     responses:
 *       200:
 *         description: Lista de escalas de valoración
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
 *                     $ref: '#/components/schemas/EscalaValoracion'
 *       500:
 *         description: Error en el servidor
 *   post:
 *     summary: Crear una nueva escala de valoración
 *     tags: [Escalas de Valoración]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EscalaValoracionInput'
 *     responses:
 *       201:
 *         description: Escala creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EscalaValoracion'
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /escala-valoracion/{id}:
 *   get:
 *     summary: Obtener una escala de valoración por ID
 *     tags: [Escalas de Valoración]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la escala
 *     responses:
 *       200:
 *         description: Datos de la escala
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EscalaValoracion'
 *       404:
 *         description: Escala no encontrada
 *       500:
 *         description: Error en el servidor
 *   put:
 *     summary: Actualizar una escala de valoración
 *     tags: [Escalas de Valoración]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la escala
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EscalaValoracionInput'
 *     responses:
 *       200:
 *         description: Escala actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EscalaValoracion'
 *       404:
 *         description: Escala no encontrada
 *       500:
 *         description: Error en el servidor
 *   delete:
 *     summary: Eliminar una escala de valoración
 *     tags: [Escalas de Valoración]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la escala
 *     responses:
 *       200:
 *         description: Escala eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Escala de valoración eliminada exitosamente
 *       404:
 *         description: Escala no encontrada
 *       500:
 *         description: Error en el servidor
 */
