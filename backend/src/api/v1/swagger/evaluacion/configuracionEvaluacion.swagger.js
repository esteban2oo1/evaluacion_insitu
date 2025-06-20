/**
 * @swagger
 * components:
 *   schemas:
 *     ConfiguracionEvaluacion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 1
 *         TIPO_EVALUACION_ID:
 *           type: integer
 *           example: 1
 *         FECHA_INICIO:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *         FECHA_FIN:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         ACTIVO:
 *           type: boolean
 *           description: Estado del aspecto (activo/inactivo)
 *           example: true
 *     ConfiguracionEvaluacionInput:
 *       type: object
 *       required:
 *         - TIPO_EVALUACION_ID
 *         - FECHA_INICIO
 *         - FECHA_FIN
 *       properties:
 *         TIPO_EVALUACION_ID:
 *           type: int
 *           example: 1
 *         FECHA_INICIO:
 *           type: string
 *           format: date
 *           example: "2025-04-20"
 *         FECHA_FIN:
 *           type: string
 *           format: date
 *           example: "2025-05-20"
 *         ACTIVO:
 *           type: number
 *           description: Estado del aspecto (1 para activo, 0 para inactivo)
 *           example: 1
 */

/**
 * @swagger
 * /configuracion-evaluacion:
 *   get:
 *     summary: Obtener todas las configuraciones de evaluación
 *     tags: [Configuración de Evaluación]
 *     responses:
 *       200:
 *         description: Lista de configuraciones de evaluación
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
 *                     $ref: '#/components/schemas/ConfiguracionEvaluacion'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear una nueva configuración de evaluación
 *     tags: [Configuración de Evaluación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracionEvaluacionInput'
 *     responses:
 *       201:
 *         description: Configuración creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionEvaluacion'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /configuracion-evaluacion/{id}:
 *   get:
 *     summary: Obtener una configuración de evaluación por ID
 *     tags: [Configuración de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración
 *     responses:
 *       200:
 *         description: Datos de la configuración
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionEvaluacion'
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar una configuración de evaluación
 *     tags: [Configuración de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracionEvaluacionInput'
 *     responses:
 *       200:
 *         description: Configuración actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionEvaluacion'
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar una configuración de evaluación
 *     tags: [Configuración de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración
 *     responses:
 *       200:
 *         description: Configuración eliminada exitosamente
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
 *                   example: Configuración de evaluación eliminada correctamente
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /configuracion-evaluacion/{id}/estado:
 *   patch:
 *     summary: Actualizar el estado (activo/inactivo) de una configuración de evaluación
 *     tags: [Configuración de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración de evaluación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activo
 *             properties:
 *               activo:
 *                 type: boolean
 *                 description: Nuevo estado de la configuración de evaluación
 *                 example: false
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     activo:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Valor inválido para el estado
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 */
