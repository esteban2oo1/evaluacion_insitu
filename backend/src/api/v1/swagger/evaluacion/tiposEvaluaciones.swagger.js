/**
 * @swagger
 * components:
 *   schemas:
 *     TipoEvaluacion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID único del tipo de evaluación
 *           example: 1
 *         NOMBRE:
 *           type: string
 *           description: Nombre del tipo de evaluación
 *           example: "Examen Parcial"
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción detallada del tipo de evaluación
 *           example: "Evaluación de mitad de curso"
 *         ACTIVO:
 *           type: boolean
 *           description: Estado del tipo de evaluación (activo/inactivo)
 *           example: true
 *         FECHA_CREACION:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del tipo de evaluación
 *           example: "2025-03-25T10:00:00Z"
 *         FECHA_ACTUALIZACION:
 *           type: string
 *           format: date-time
 *           description: Fecha de la última actualización
 *           example: "2025-03-25T10:00:00Z"
 *     TipoEvaluacionInput:
 *       type: object
 *       required:
 *         - NOMBRE
 *         - ACTIVO
 *       properties:
 *         NOMBRE:
 *           type: string
 *           description: Nombre del tipo de evaluación
 *           example: "Examen Parcial"
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción detallada del tipo de evaluación
 *           example: "Evaluación de mitad de curso"
 *         ACTIVO:
 *           type: boolean
 *           description: Estado del tipo de evaluación (activo/inactivo)
 *           example: true
 */

/**
 * @swagger
 * /tipos-evaluaciones:
 *   get:
 *     summary: Obtener todos los tipos de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     responses:
 *       200:
 *         description: Lista de tipos de evaluación
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
 *                     $ref: '#/components/schemas/TipoEvaluacion'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear un nuevo tipo de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEvaluacionInput'
 *     responses:
 *       201:
 *         description: Tipo de evaluación creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TipoEvaluacion'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /tipos-evaluaciones/{id}:
 *   get:
 *     summary: Obtener un tipo de evaluación por ID
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
 *     responses:
 *       200:
 *         description: Datos del tipo de evaluación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TipoEvaluacion'
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar un tipo de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEvaluacionInput'
 *     responses:
 *       200:
 *         description: Tipo de evaluación actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TipoEvaluacion'
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar un tipo de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
 *     responses:
 *       200:
 *         description: Tipo de evaluación eliminado correctamente
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
 *                   example: Tipo de evaluación eliminado correctamente
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 */


/**
 * @swagger
 * /tipos-evaluaciones/configuracion/{id}:
 *   get:
 *     summary: Obtener un tipo de evaluación por ID
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
 *     responses:
 *       200:
 *         description: Datos del tipo de evaluación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TipoEvaluacion'
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar un tipo de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoEvaluacionInput'
 *     responses:
 *       200:
 *         description: Tipo de evaluación actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/TipoEvaluacion'
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar un tipo de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
 *     responses:
 *       200:
 *         description: Tipo de evaluación eliminado correctamente
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
 *                   example: Tipo de evaluación eliminado correctamente
 *       404:
 *         description: Tipo de evaluación no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /tipos-evaluaciones/{id}/estado:
 *   patch:
 *     summary: Actualizar el estado (activo/inactivo) de un tipo de evaluación
 *     tags: [Tipos de Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de evaluación
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
 *                 description: Nuevo estado del tipo de evaluación
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
