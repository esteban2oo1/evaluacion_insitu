/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluacion:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           example: 1
 *         DOCUMENTO_ESTUDIANTE:
 *           type: string
 *           example: "1234567890"
 *         DOCUMENTO_DOCENTE:
 *           type: string
 *           example: "9876543210"
 *         COMENTARIO_GENERAL:
 *           type: string
 *           example: "Buen desempeño general."
 *         ID_CONFIGURACION:
 *           type: integer
 *           example: 2
 *         CODIGO_MATERIA:
 *           type: string
 *           example: "MAT101"
 *     EvaluacionInput:
 *       type: object
 *       properties:
 *         DOCUMENTO_ESTUDIANTE:
 *           type: string
 *           example: "1234567890"
 *         DOCUMENTO_DOCENTE:
 *           type: string
 *           example: "9876543210"
 *         COMENTARIO_GENERAL:
 *           type: string
 *           example: "Buen desempeño general."
 *         ID_CONFIGURACION:
 *           type: integer
 *           example: 2
 *         CODIGO_MATERIA:
 *           type: string
 *           example: "MAT101"
 *     EvaluacionDetalle:
 *       type: object
 *       properties:
 *         EVALUACION_ID:
 *           type: integer
 *           example: 1
 *         ASPECTO_ID:
 *           type: integer
 *           example: 1
 *         VALORACION_ID:
 *           type: integer
 *           example: 2
 *         COMENTARIO:
 *           type: string
 *           example: "El docente explica muy bien los temas."
 *     EvaluacionPendienteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             tiposEvaluacion:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Evaluación Docente"
 *                   descripcion:
 *                     type: string
 *                     example: "Evaluación del desempeño docente"
 *                   configuracion:
 *                     type: object
 *                     properties:
 *                       periodoValido:
 *                         type: boolean
 *                         example: true
 *                       fechaInicio:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T00:00:00.000Z"
 *                       fechaFin:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-31T23:59:59.999Z"
 *                   estado:
 *                     type: object
 *                     properties:
 *                       evaluacionesCreadas:
 *                         type: boolean
 *                         example: false
 *                       totalMaterias:
 *                         type: integer
 *                         example: 5
 *                       materiasEvaluadas:
 *                         type: integer
 *                         example: 0
 *                       materiasPendientes:
 *                         type: integer
 *                         example: 5
 *                       completado:
 *                         type: boolean
 *                         example: false
 *                   siguientePaso:
 *                     type: string
 *                     enum: ["CREAR_EVALUACIONES", "COMPLETAR_DETALLES"]
 *                     example: "CREAR_EVALUACIONES"
 *             perfilEstudiante:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "1000001"
 *                 totalMaterias:
 *                   type: integer
 *                   example: 5
 *                 materias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       codigo:
 *                         type: string
 *                         example: "MAT101"
 *                       nombre:
 *                         type: string
 *                         example: "Cálculo I"
 *                       docente:
 *                         type: object
 *                         properties:
 *                           documento:
 *                             type: string
 *                             example: "9000001"
 *                           nombre:
 *                             type: string
 *                             example: "Juan Pérez"
 *         message:
 *           type: string
 *           example: "Estado de evaluaciones obtenido exitosamente"
 */

/**
 * @swagger
 * /evaluaciones/detalles:
 *   post:
 *     summary: Create a new evaluacion and its detalles
 *     tags: [Evaluaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DOCUMENTO_ESTUDIANTE:
 *                 type: string
 *                 example: "1234567890"
 *               DOCUMENTO_DOCENTE:
 *                 type: string
 *                 example: "9876543210"
 *               COMENTARIO_GENERAL:
 *                 type: string
 *                 example: "Buen desempeño general."
 *               ID_CONFIGURACION:
 *                 type: integer
 *                 example: 2
 *               FECHA_INICIO:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-26T00:00:00Z"
 *               FECHA_FIN:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-27T00:00:00Z"
 *     responses:
 *       201:
 *         description: Evaluacion and detalles created successfully
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
 *                     evaluacion:
 *                       $ref: '#/components/schemas/Evaluacion'
 *                     detalles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/EvaluacionDetalle'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /evaluaciones:
 *   get:
 *     summary: Get all evaluaciones
 *     tags: [Evaluaciones]
 *     responses:
 *       200:
 *         description: List of evaluaciones
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
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new evaluacion
 *     tags: [Evaluaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvaluacionInput'
 *     responses:
 *       201:
 *         description: Evaluacion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Evaluacion'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /evaluaciones/estudiante/{documentoEstudiante}:
 *   get:
 *     summary: Get evaluaciones by estudiante
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: documentoEstudiante
 *         schema:
 *           type: string
 *         required: true
 *         description: DOCUMENTO_ESTUDIANTE
 *     responses:
 *       200:
 *         description: List of evaluaciones
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
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /evaluaciones/docente/{documentoDocente}:
 *   get:
 *     summary: Get evaluaciones by docente
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: documentoDocente
 *         schema:
 *           type: string
 *         required: true
 *         description: DOCUMENTO_DOCENTE
 *     responses:
 *       200:
 *         description: List of evaluaciones
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
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /evaluaciones/{id}:
 *   get:
 *     summary: Get evaluacion by ID
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID
 *     responses:
 *       200:
 *         description: Evaluacion data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Evaluacion'
 *       404:
 *         description: Evaluacion not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update an evaluacion
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EvaluacionInput'
 *     responses:
 *       200:
 *         description: Evaluacion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Evaluacion'
 *       404:
 *         description: Evaluacion not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete an evaluacion
 *     tags: [Evaluaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID
 *     responses:
 *       200:
 *         description: Evaluacion deleted successfully
 *       404:
 *         description: Evaluacion not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /evaluaciones/insitu/crear:
 *   post:
 *     summary: Crear una nueva evaluación insitu y sus detalles
 *     description: Crea automáticamente evaluaciones para todas las materias del estudiante
 *     tags: [Evaluaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoEvaluacionId
 *             properties:
 *               tipoEvaluacionId:
 *                 type: int
 *                 description: id configuracion de la evaluacion
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
 *                 message:
 *                   type: string
 *                   example: "Evaluaciones creadas exitosamente"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       evaluacion:
 *                         $ref: '#/components/schemas/Evaluacion'
 *                       detalles:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/EvaluacionDetalle'
 *       400:
 *         description: Error de validación
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
 *                   example: "Error de validación"
 *                 error:
 *                   type: object
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Configuración no encontrada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /evaluaciones/pendientes:
 *   get:
 *     summary: Obtener el estado de las evaluaciones pendientes del estudiante
 *     description: Retorna las evaluaciones pendientes del estudiante autenticado, incluyendo el estado de cada tipo de evaluación y su perfil académico
 *     tags: [Evaluaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de evaluaciones obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EvaluacionPendienteResponse'
 *       401:
 *         description: Usuario no autenticado
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
 *                   example: "Usuario no autenticado"
 *       404:
 *         description: No se encontró información del perfil del estudiante
 *       500:
 *         description: Error del servidor
 */
