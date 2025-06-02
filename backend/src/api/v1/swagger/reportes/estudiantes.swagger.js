/**
 * @swagger
 * tags:
 *   name: Reportes Estudiantes
 *   description: Endpoints para consultas de reportes de estudiantes
 */

/**
 * @swagger
 * /reportes/estudiantes/{idEstudiante}/configuracion/{idConfiguracion}:
 *   get:
 *     summary: Obtiene estadísticas de evaluaciones de un estudiante específico
 *     tags: [Reportes Estudiantes]
 *     parameters:
 *       - in: path
 *         name: idEstudiante
 *         required: true
 *         schema:
 *           type: string
 *           description: ID del estudiante
 *       - in: path
 *         name: idConfiguracion
 *         required: true
 *         schema:
 *           type: integer
 *           description: ID de la configuración
 *     responses:
 *       200:
 *         description: Estadísticas del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_materias:
 *                   type: integer
 *                   description: Total de materias del estudiante
 *                 evaluaciones_completadas:
 *                   type: integer
 *                   description: Número de evaluaciones completadas
 *                 materias_pendientes:
 *                   type: integer
 *                   description: Número de materias pendientes
 *                 porcentaje_completado:
 *                   type: number
 *                   format: float
 *                   description: Porcentaje de evaluaciones completadas
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /reportes/estudiantes:
 *   get:
 *     summary: Obtiene lista de todos los estudiantes con sus estadísticas
 *     tags: [Reportes Estudiantes]
 *     responses:
 *       200:
 *         description: Lista de estudiantes con estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_ESTUDIANTE:
 *                     type: string
 *                     description: ID del estudiante
 *                   NOMBRE_COMPLETO:
 *                     type: string
 *                     description: Nombre completo del estudiante
 *                   total_materias:
 *                     type: integer
 *                     description: Total de materias del estudiante
 *                   evaluaciones_completadas:
 *                     type: integer
 *                     description: Número de evaluaciones completadas
 *                   materias_pendientes:
 *                     type: integer
 *                     description: Número de materias pendientes
 *                   porcentaje_completado:
 *                     type: number
 *                     format: float
 *                     description: Porcentaje de evaluaciones completadas
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /reportes/estudiantes/docente/{idDocente}/materia/{codAsignatura}/grupo/{grupo}:
 *   get:
 *     summary: Obtiene estudiantes por docente, materia y grupo
 *     tags: [Reportes Estudiantes]
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
 *         description: Lista de estudiantes filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_ESTUDIANTE:
 *                     type: string
 *                     description: ID del estudiante
 *                   NOMBRE_COMPLETO:
 *                     type: string
 *                     description: Nombre completo del estudiante
 *                   COD_ASIGNATURA:
 *                     type: string
 *                     description: Código de la asignatura
 *                   ASIGNATURA:
 *                     type: string
 *                     description: Nombre de la asignatura
 *                   PERIODO:
 *                     type: string
 *                     description: Período académico
 *                   GRUPO:
 *                     type: string
 *                     description: Grupo de la asignatura
 *                   SEMESTRE:
 *                     type: string
 *                     description: Semestre
 *                   total_materias:
 *                     type: integer
 *                     description: Total de materias del estudiante
 *                   evaluaciones_completadas:
 *                     type: integer
 *                     description: Número de evaluaciones completadas
 *                   materias_pendientes:
 *                     type: integer
 *                     description: Número de materias pendientes
 *                   porcentaje_completado:
 *                     type: number
 *                     format: float
 *                     description: Porcentaje de evaluaciones completadas
 *       500:
 *         description: Error del servidor
 */ 