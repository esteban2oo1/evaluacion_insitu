/**
 * @swagger
 * components:
 *   schemas:
 *     AspectoEvaluacion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID único del aspecto de evaluación
 *           example: 1
 *         ETIQUETA:
 *           type: string
 *           description: Nombre o etiqueta del aspecto de evaluación
 *           example: "Participación"
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción detallada del aspecto de evaluación
 *           example: "Evaluación de la participación activa de los estudiantes"
 *         ORDEN:
 *           type: number
 *           format: decimal
 *           description: Orden o peso del aspecto en la evaluación
 *           example: 1.00
 *         ACTIVO:
 *           type: number
 *           description: Estado del aspecto (1 para activo, 0 para inactivo)
 *           example: 1
 *     AspectoEvaluacionInput:
 *       type: object
 *       required:
 *         - ETIQUETA
 *         - ORDEN
 *         - ACTIVO
 *       properties:
 *         ETIQUETA:
 *           type: string
 *           description: Nombre o etiqueta del aspecto de evaluación
 *           example: "Participación"
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción detallada del aspecto de evaluación
 *           example: "Evaluación de la participación activa de los estudiantes"
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
 * /aspectos-evaluacion:
 *   get:
 *     summary: Obtener todos los aspectos de evaluación
 *     tags: [Aspectos de Evaluación]
 *     responses:
 *       200:
 *         description: Lista de aspectos de evaluación
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
 *                     $ref: '#/components/schemas/AspectoEvaluacion'
 *       500:
 *         description: Error del servidor
 *   post:
 *     summary: Crear un nuevo aspecto de evaluación
 *     tags: [Aspectos de Evaluación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AspectoEvaluacionInput'
 *     responses:
 *       201:
 *         description: Aspecto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AspectoEvaluacion'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /aspectos-evaluacion/{id}:
 *   get:
 *     summary: Obtener un aspecto de evaluación por ID
 *     tags: [Aspectos de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del aspecto
 *     responses:
 *       200:
 *         description: Datos del aspecto de evaluación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AspectoEvaluacion'
 *       404:
 *         description: Aspecto no encontrado
 *       500:
 *         description: Error del servidor
 *   put:
 *     summary: Actualizar un aspecto de evaluación
 *     tags: [Aspectos de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del aspecto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AspectoEvaluacionInput'
 *     responses:
 *       200:
 *         description: Aspecto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AspectoEvaluacion'
 *       404:
 *         description: Aspecto no encontrado
 *       500:
 *         description: Error del servidor
 *   delete:
 *     summary: Eliminar un aspecto de evaluación
 *     tags: [Aspectos de Evaluación]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del aspecto
 *     responses:
 *       200:
 *         description: Aspecto eliminado correctamente
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
 *                   example: Aspecto de evaluación eliminado correctamente
 *       404:
 *         description: Aspecto no encontrado
 *       500:
 *         description: Error del servidor
 */
