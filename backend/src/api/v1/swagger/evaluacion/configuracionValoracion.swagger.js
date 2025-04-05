// src/api/v1/routes/evaluacion/configuracionValoracion.swagger.js
/**
 * @swagger
 * components:
 *   schemas:
 *     ConfiguracionValoracion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID único de la configuración de valoración
 *           example: 1
 *         CONFIGURACION_EVALUACION_ID:
 *           type: integer
 *           description: ID de la configuración de evaluación
 *           example: 2
 *         VALORACION_ID:
 *           type: integer
 *           description: ID de la valoración relacionada
 *           example: 3
 *         PUNTAJE:
 *           type: number
 *           format: decimal
 *           description: Puntaje asociado a la valoración
 *           example: 5.00
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la configuración de evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: boolean
 *           description: Estado de la configuración (true para activo, false para inactivo)
 *           example: true
 *     ConfiguracionValoracionInput:
 *       type: object
 *       required:
 *         - CONFIGURACION_EVALUACION_ID
 *         - VALORACION_ID
 *         - PUNTAJE
 *         - ORDEN
 *         - ACTIVO
 *       properties:
 *         CONFIGURACION_EVALUACION_ID:
 *           type: integer
 *           description: ID de la configuración de evaluación
 *           example: 2
 *         VALORACION_ID:
 *           type: integer
 *           description: ID de la valoración relacionada
 *           example: 3
 *         PUNTAJE:
 *           type: number
 *           format: decimal
 *           description: Puntaje asociado a la valoración
 *           example: 5.00
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la configuración de evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: boolean
 *           description: Estado de la configuración (true para activo, false para inactivo)
 *           example: true
 */

/**
 * @swagger
 * /configuracion-valoracion:
 *   get:
 *     summary: Obtener todas las configuraciones de valoración
 *     tags: [Configuración Valoración]
 *     responses:
 *       200:
 *         description: Lista de configuraciones de valoración
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
 *                     $ref: '#/components/schemas/ConfiguracionValoracion'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear una nueva configuración de valoración
 *     tags: [Configuración Valoración]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracionValoracionInput'
 *     responses:
 *       201:
 *         description: Configuración de valoración creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionValoracion'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /configuracion-valoracion/{id}:
 *   get:
 *     summary: Obtener una configuración de valoración por ID
 *     tags: [Configuración Valoración]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración de valoración
 *     responses:
 *       200:
 *         description: Datos de la configuración de valoración
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionValoracion'
 *       404:
 *         description: Configuración de valoración no encontrada
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar una configuración de valoración
 *     tags: [Configuración Valoración]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración de valoración
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfiguracionValoracionInput'
 *     responses:
 *       200:
 *         description: Configuración de valoración actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConfiguracionValoracion'
 *       404:
 *         description: Configuración de valoración no encontrada
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar una configuración de valoración
 *     tags: [Configuración Valoración]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración de valoración
 *     responses:
 *       200:
 *         description: Configuración de valoración eliminada correctamente
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
 *                   example: Configuración de valoración eliminada correctamente
 *       404:
 *         description: Configuración de valoración no encontrada
 *       500:
 *         description: Error del servidor
 */
