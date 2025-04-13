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
 *           example: "El aspecto es excelente"
 *         FECHA_CREACION:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del detalle
 *         FECHA_ACTUALIZACION:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del detalle
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
 *     DetalleEvaluacionBulkInput:
 *       type: object
 *       required:
 *         - evaluacionId
 *         - detalles
 *       properties:
 *         evaluacionId:
 *           type: integer
 *           description: ID de la evaluación a la que pertenecen los detalles
 *           example: 1
 *         detalles:
 *           type: array
 *           description: Lista de detalles de evaluación a crear
 *           items:
 *             type: object
 *             required:
 *               - aspectoId
 *               - valoracionId
 *             properties:
 *               aspectoId:
 *                 type: integer
 *                 description: ID del aspecto a evaluar
 *                 example: 1
 *               valoracionId:
 *                 type: integer
 *                 description: ID de la valoración seleccionada
 *                 example: 2
 *               comentario:
 *                 type: string
 *                 description: Comentario opcional para este aspecto
 *                 example: "Excelente dominio del tema"
 *     DetalleInput:
 *       type: object
 *       required:
 *         - aspectoId
 *         - valoracionId
 *       properties:
 *         aspectoId:
 *           type: integer
 *           description: ID del aspecto a evaluar
 *           example: 1
 *         valoracionId:
 *           type: integer
 *           description: ID de la valoración seleccionada
 *           example: 2
 *         comentario:
 *           type: string
 *           description: Comentario opcional para este aspecto
 *           example: "Excelente dominio del tema"
 *     BulkCreateRequest:
 *       type: object
 *       required:
 *         - evaluacionId
 *         - comentarioGeneral
 *         - detalles
 *       properties:
 *         evaluacionId:
 *           type: integer
 *           description: ID de la evaluación a la que pertenecen los detalles
 *           example: 1
 *         comentarioGeneral:
 *           type: string
 *           description: Comentario general sobre la evaluación del docente
 *           example: "El docente demuestra excelente dominio y metodología"
 *         detalles:
 *           type: array
 *           description: Lista de detalles de evaluación a crear
 *           items:
 *             $ref: '#/components/schemas/DetalleInput'
 *     BulkCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         code:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: "Detalles de evaluación creados exitosamente"
 *         data:
 *           type: object
 *           properties:
 *             evaluacion:
 *               type: object
 *               properties:
 *                 ID:
 *                   type: integer
 *                   example: 1
 *                 DOCUMENTO_ESTUDIANTE:
 *                   type: string
 *                   example: "1000001"
 *                 DOCUMENTO_DOCENTE:
 *                   type: string
 *                   example: "9000001"
 *                 CODIGO_MATERIA:
 *                   type: string
 *                   example: "MAT101"
 *                 COMENTARIO_GENERAL:
 *                   type: string
 *                   example: "El docente demuestra excelente dominio y metodología"
 *                 CONFIGURACION_ID:
 *                   type: integer
 *                   example: 1
 *             detalles:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EvaluacionDetalle'
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
 *             type: object
 *             required:
 *               - EVALUACION_ID
 *               - ASPECTO_ID
 *               - VALORACION_ID
 *             properties:
 *               EVALUACION_ID:
 *                 type: integer
 *                 example: 1
 *               ASPECTO_ID:
 *                 type: integer
 *                 example: 2
 *               VALORACION_ID:
 *                 type: integer
 *                 example: 3
 *               COMENTARIO:
 *                 type: string
 *                 example: "Comentario específico"
 *     responses:
 *       201:
 *         description: Detalle de evaluación creado exitosamente
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
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de evaluación
 *     responses:
 *       200:
 *         description: Detalle de evaluación encontrado
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
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de evaluación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvaluacionDetalle'
 *     responses:
 *       200:
 *         description: Detalle de evaluación actualizado exitosamente
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
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de evaluación
 *     responses:
 *       200:
 *         description: Detalle de evaluación eliminado exitosamente
 *       404:
 *         description: Detalle de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluacion-detalle/bulk:
 *   post:
 *     summary: Crear múltiples detalles de evaluación y actualizar el comentario general
 *     tags: [Evaluación Detalle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkCreateRequest'
 *     responses:
 *       201:
 *         description: Detalles de evaluación creados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BulkCreateResponse'
 *       400:
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "El comentario general es requerido"
 *       404:
 *         description: La evaluación no existe
 *       500:
 *         description: Error del servidor
 */
