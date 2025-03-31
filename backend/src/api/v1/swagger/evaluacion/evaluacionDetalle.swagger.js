// src/api/v1/routes/evaluacion/evaluacionDetalle.swagger.js
/**
 * @swagger
 * components:
 *   schemas:
 *     EvaluacionDetalle:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID único del detalle de la evaluación
 *           example: 1
 *         EVALUACION_ID:
 *           type: integer
 *           description: ID de la evaluación a la que pertenece el detalle
 *           example: 2
 *         ASPECTO_ID:
 *           type: integer
 *           description: ID del aspecto relacionado
 *           example: 3
 *         VALORACION_ID:
 *           type: integer
 *           description: ID de la valoración asociada al aspecto
 *           example: 4
 *         COMENTARIO:
 *           type: string
 *           description: Comentario adicional sobre la valoración
 *           example: "El aspecto es excelente, pero podría mejorar en ciertos puntos."
 *         FECHA_CREACION:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del detalle
 *           example: "2025-03-25T12:00:00Z"
 *         FECHA_ACTUALIZACION:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del detalle
 *           example: "2025-03-25T12:00:00Z"
 *     EvaluacionDetalleInput:
 *       type: object
 *       required:
 *         - EVALUACION_ID
 *         - ASPECTO_ID
 *         - VALORACION_ID
 *         - COMENTARIO
 *       properties:
 *         EVALUACION_ID:
 *           type: integer
 *           description: ID de la evaluación a la que pertenece el detalle
 *           example: 2
 *         ASPECTO_ID:
 *           type: integer
 *           description: ID del aspecto relacionado
 *           example: 3
 *         VALORACION_ID:
 *           type: integer
 *           description: ID de la valoración asociada al aspecto
 *           example: 4
 *         COMENTARIO:
 *           type: string
 *           description: Comentario adicional sobre la valoración
 *           example: "Excelente evaluación."
 */

/**
 * @swagger
 * /evaluacion-detalle:
 *   get:
 *     summary: Obtener todos los detalles de evaluación
 *     tags: [Evaluación Detalle]
 *     responses:
 *       200:
 *         description: Lista de detalles de evaluación
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
 *                     $ref: '#/components/schemas/EvaluacionDetalle'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear un nuevo detalle de evaluación
 *     tags: [Evaluación Detalle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvaluacionDetalleInput'
 *     responses:
 *       201:
 *         description: Detalle de evaluación creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EvaluacionDetalle'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluacion-detalle/{id}:
 *   get:
 *     summary: Obtener un detalle de evaluación por ID
 *     tags: [Evaluación Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle de evaluación
 *     responses:
 *       200:
 *         description: Detalles de la evaluación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EvaluacionDetalle'
 *       404:
 *         description: Detalle de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar un detalle de evaluación
 *     tags: [Evaluación Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle de evaluación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvaluacionDetalleInput'
 *     responses:
 *       200:
 *         description: Detalle de evaluación actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EvaluacionDetalle'
 *       404:
 *         description: Detalle de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar un detalle de evaluación
 *     tags: [Evaluación Detalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del detalle de evaluación
 *     responses:
 *       200:
 *         description: Detalle de evaluación eliminado correctamente
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
 *                   example: Detalle de evaluación eliminado correctamente
 *       404:
 *         description: Detalle de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 */
