/**
 * @swagger
 * tags:
 *   name: Reportes Docentes
 *   description: Endpoints para consultas de reportes de docentes
 */

/**
 * @swagger
 * /reportes/docentes/docentes-asignaturas:
 *   get:
 *     summary: Obtiene lista de docentes con sus asignaturas y progreso de evaluación
 *     tags: [Reportes Docentes]
 *     responses:
 *       200:
 *         description: Lista de docentes con sus asignaturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   COD_ASIGNATURA:
 *                     type: string
 *                     description: Código de la asignatura
 *                   ASIGNATURA:
 *                     type: string
 *                     description: Nombre de la asignatura
 *                   ID_DOCENTE:
 *                     type: string
 *                     description: ID del docente
 *                   DOCENTE:
 *                     type: string
 *                     description: Nombre del docente
 *                   SEMESTRE_PREDOMINANTE:
 *                     type: string
 *                     description: Semestre predominante
 *                   PROGRAMA_PREDOMINANTE:
 *                     type: string
 *                     description: Programa predominante
 *                   total_evaluaciones_esperadas:
 *                     type: integer
 *                     description: Total de evaluaciones esperadas
 *                   evaluaciones_completadas:
 *                     type: integer
 *                     description: Número de evaluaciones completadas
 *                   evaluaciones_pendientes:
 *                     type: integer
 *                     description: Número de evaluaciones pendientes
 *                   porcentaje_completado:
 *                     type: number
 *                     format: float
 *                     description: Porcentaje de evaluaciones completadas
 *                   estado_evaluacion:
 *                     type: string
 *                     description: Estado de la evaluación (COMPLETADO, NO INICIADO, EN PROGRESO)
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /reportes/docentes/estudiantes-evaluados/{idDocente}/{codAsignatura}/{grupo}:
 *   get:
 *     summary: Obtiene estudiantes evaluados por docente, materia y grupo
 *     tags: [Reportes Docentes]
 *     parameters:
 *       - in: path
 *         name: idDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del docente
 *       - in: path
 *         name: codAsignatura
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la asignatura
 *       - in: path
 *         name: grupo
 *         required: true
 *         schema:
 *           type: string
 *         description: Grupo de la asignatura
 *     responses:
 *       200:
 *         description: Estadísticas de estudiantes evaluados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_estudiantes:
 *                   type: integer
 *                   description: Total de estudiantes
 *                 evaluaciones_realizadas:
 *                   type: integer
 *                   description: Número de evaluaciones realizadas
 *                 evaluaciones_sin_realizar:
 *                   type: integer
 *                   description: Número de evaluaciones sin realizar
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /reportes/docentes/aspectos-puntaje/{idDocente}:
 *   get:
 *     summary: Obtiene aspectos y puntajes promedio por docente
 *     tags: [Reportes Docentes]
 *     parameters:
 *       - in: path
 *         name: idDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del docente
 *     responses:
 *       200:
 *         description: Lista de aspectos y puntajes promedio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_DOCENTE:
 *                     type: string
 *                     description: ID del docente
 *                   DOCENTE:
 *                     type: string
 *                     description: Nombre del docente
 *                   ASPECTO:
 *                     type: string
 *                     description: Etiqueta del aspecto
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del aspecto
 *                   PUNTAJE_PROMEDIO:
 *                     type: number
 *                     format: float
 *                     description: Puntaje promedio del aspecto
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /reportes/docentes/comentarios/{idDocente}:
 *   get:
 *     summary: Obtiene comentarios por docente
 *     tags: [Reportes Docentes]
 *     parameters:
 *       - in: path
 *         name: idDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del docente
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_DOCENTE:
 *                     type: string
 *                     description: ID del docente
 *                   DOCENTE:
 *                     type: string
 *                     description: Nombre del docente
 *                   ASPECTO:
 *                     type: string
 *                     description: Etiqueta del aspecto
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del aspecto
 *                   COMENTARIO_GENERAL:
 *                     type: string
 *                     description: Comentario general de la evaluación
 *                   COMENTARIO:
 *                     type: string
 *                     description: Comentario específico del aspecto
 *       500:
 *         description: Error del servidor
 */ 