// src/api/v1/routes/evaluacion/configuracionAspecto.swagger.js
/**
 * @swagger
 * components:
 *   schemas:
 *     ConfiguracionAspecto:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID único de la configuración del aspecto
 *           example: 1
 *         CONFIGURACION_EVALUACION_ID:
 *           type: integer
 *           description: ID de la configuración de evaluación
 *           example: 2
 *         ASPECTO_ID:
 *           type: integer
 *           description: ID del aspecto de evaluación relacionado
 *           example: 5
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la configuración de evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: boolean
 *           description: Estado del aspecto (true para activo, false para inactivo)
 *           example: true
 *     ConfiguracionAspectoInput:
 *       type: object
 *       required:
 *         - CONFIGURACION_EVALUACION_ID
 *         - ASPECTO_ID
 *         - ORDEN
 *         - ACTIVO
 *       properties:
 *         CONFIGURACION_EVALUACION_ID:
 *           type: integer
 *           description: ID de la configuración de evaluación
 *           example: 2
 *         ASPECTO_ID:
 *           type: integer
 *           description: ID del aspecto de evaluación relacionado
 *           example: 5
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la configuración de evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: boolean
 *           description: Estado del aspecto (true para activo, false para inactivo)
 *           example: true
 */

/**
 * @swagger
 * /configuracion-aspecto:
 *   get:
 *     summary: Obtener todos los aspectos configurados en la evaluación
 *     tags: [Configuración Aspecto]
 *     responses:
 *       200:
 *         description: Lista de configuraciones de aspecto
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
 *                     $ref: '#/components/schemas/ConfiguracionAspecto'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear una nueva configuración de aspecto
 *     tags: [Configuración Aspecto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracionAspectoInput'
 *     responses:
 *       201:
 *         description: Configuración de aspecto creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionAspecto'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /configuracion-aspecto/{id}:
 *   get:
 *     summary: Obtener una configuración de aspecto por ID
 *     tags: [Configuración Aspecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración del aspecto
 *     responses:
 *       200:
 *         description: Datos de la configuración de aspecto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionAspecto'
 *       404:
 *         description: Configuración de aspecto no encontrada
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar una configuración de aspecto
 *     tags: [Configuración Aspecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración del aspecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracionAspectoInput'
 *     responses:
 *       200:
 *         description: Configuración de aspecto actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionAspecto'
 *       404:
 *         description: Configuración de aspecto no encontrada
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar una configuración de aspecto
 *     tags: [Configuración Aspecto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración del aspecto
 *     responses:
 *       200:
 *         description: Configuración de aspecto eliminada correctamente
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
 *                   example: Configuración de aspecto eliminada correctamente
 *       404:
 *         description: Configuración de aspecto no encontrada
 *       500:
 *         description: Error del servidor
 */
