// src/api/v1/routes/evaluacion/evaluacion.swagger.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluacion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID único de la evaluación
 *           example: 1
 *         DOCUMENTO_ESTUDIANTE:
 *           type: string
 *           description: Documento del estudiante evaluado
 *           example: "1234567890"
 *         DOCUMENTO_DOCENTE:
 *           type: string
 *           description: Documento del docente evaluador
 *           example: "9876543210"
 *         COMENTARIO_GENERAL:
 *           type: string
 *           description: Comentario general sobre la evaluación
 *           example: "Buen desempeño general."
 *         ID_CONFIGURACION:
 *           type: integer
 *           description: ID de la configuración de evaluación utilizada
 *           example: 2
 *         CODIGO_MATERIA:
 *           type: string
 *           description: Código de la materia evaluada
 *           example: "MAT101"
 */

/**
 * @swagger
 * /evaluaciones:
 *   get:
 *     summary: Obtener todas las evaluaciones
 *     tags: [Evaluaciones]
 *     responses:
 *       200:
 *         description: Lista de evaluaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluacion'
 *       500:
 *         description: Error del servidor
 * 
 *   post:
 *     summary: Crear una nueva evaluación
 *     tags: [Evaluaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluacion'
 *     responses:
 *       201:
 *         description: Evaluación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluacion'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluaciones/insitu/crear:
 *   post:
 *     summary: Crear evaluaciones in situ para todas las materias del estudiante
 *     tags: [Evaluaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoEvaluacionId:
 *                 type: integer
 *                 description: ID de configuración de evaluación
 *                 example: 1
 *     responses:
 *       201:
 *         description: Evaluaciones creadas exitosamente
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
 *                     $ref: '#/components/schemas/Evaluacion'
 *       400:
 *         description: Evaluación no disponible o ya existe
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración de evaluación no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluaciones/{id}:
 *   get:
 *     summary: Obtener una evaluación por ID
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evaluación
 *     responses:
 *       200:
 *         description: Evaluación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluacion'
 *       404:
 *         description: Evaluación no encontrada
 *       500:
 *         description: Error del servidor
 * 
 *   put:
 *     summary: Actualizar una evaluación
 *     tags: [Evaluaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evaluación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluacion'
 *     responses:
 *       200:
 *         description: Evaluación actualizada exitosamente
 *       404:
 *         description: Evaluación no encontrada
 *       500:
 *         description: Error del servidor
 * 
 *   delete:
 *     summary: Eliminar una evaluación
 *     tags: [Evaluaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la evaluación
 *     responses:
 *       200:
 *         description: Evaluación eliminada exitosamente
 *       404:
 *         description: Evaluación no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluaciones/estudiante/{documentoEstudiante}:
 *   get:
 *     summary: Obtener evaluaciones por documento del estudiante
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: documentoEstudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del estudiante
 *     responses:
 *       200:
 *         description: Evaluaciones encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluacion'
 *       404:
 *         description: Evaluaciones no encontradas
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluaciones/docente/{documentoDocente}:
 *   get:
 *     summary: Obtener evaluaciones por documento del docente
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: documentoDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del docente
 *     responses:
 *       200:
 *         description: Evaluaciones encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluacion'
 *       404:
 *         description: Evaluaciones no encontradas
 *       500:
 *         description: Error del servidor
 */
