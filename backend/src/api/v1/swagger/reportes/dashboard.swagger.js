/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para el dashboard administrativo
 */

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Obtiene estadísticas generales del dashboard
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: idConfiguracion
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de configuración para filtrar las estadísticas
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_estudiantes:
 *                   type: integer
 *                   description: Total de estudiantes
 *                 total_evaluaciones:
 *                   type: integer
 *                   description: Total de evaluaciones
 *                 evaluaciones_completadas:
 *                   type: integer
 *                   description: Evaluaciones completadas
 *                 evaluaciones_pendientes:
 *                   type: integer
 *                   description: Evaluaciones pendientes
 *                 porcentaje_completado:
 *                   type: number
 *                   format: float
 *                   description: Porcentaje de evaluaciones completadas
 *                 docentes_evaluados:
 *                   type: integer
 *                   description: Total de docentes evaluados
 *                 total_docentes:
 *                   type: integer
 *                   description: Total de docentes
 *                 porcentaje_docentes_evaluados:
 *                   type: number
 *                   format: float
 *                   description: Porcentaje de docentes evaluados
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /dashboard/aspectos:
 *   get:
 *     summary: Obtiene promedios por aspecto de evaluación
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Promedios obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ASPECTO:
 *                     type: string
 *                     description: Nombre del aspecto evaluado
 *                   PROMEDIO_GENERAL:
 *                     type: number
 *                     format: float
 *                     description: Promedio general del aspecto
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /dashboard/ranking:
 *   get:
 *     summary: Obtiene el ranking completo de docentes
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Ranking obtenido exitosamente
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
 *                   TOTAL_PUNTAJE:
 *                     type: number
 *                     format: float
 *                     description: Puntaje total del docente
 *                   PROMEDIO_GENERAL:
 *                     type: number
 *                     format: float
 *                     description: Promedio general del docente
 *                   TOTAL_RESPUESTAS:
 *                     type: integer
 *                     description: Total de respuestas recibidas
 *                   evaluaciones_esperadas:
 *                     type: integer
 *                     description: Total de evaluaciones esperadas
 *                   evaluaciones_realizadas:
 *                     type: integer
 *                     description: Total de evaluaciones realizadas
 *                   evaluaciones_pendientes:
 *                     type: integer
 *                     description: Total de evaluaciones pendientes
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /dashboard/podio:
 *   get:
 *     summary: Obtiene el podio de docentes (3 mejores y 3 peores)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Podio obtenido exitosamente
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
 *                   TOTAL_PUNTAJE:
 *                     type: number
 *                     format: float
 *                     description: Puntaje total del docente
 *                   PROMEDIO_GENERAL:
 *                     type: number
 *                     format: float
 *                     description: Promedio general del docente
 *                   TOTAL_RESPUESTAS:
 *                     type: integer
 *                     description: Total de respuestas recibidas
 *                   evaluaciones_esperadas:
 *                     type: integer
 *                     description: Total de evaluaciones esperadas
 *                   evaluaciones_realizadas:
 *                     type: integer
 *                     description: Total de evaluaciones realizadas
 *                   evaluaciones_pendientes:
 *                     type: integer
 *                     description: Total de evaluaciones pendientes
 *                   POSICION:
 *                     type: string
 *                     description: Posicion en el podio
 *       500:
 *         description: Error interno del servidor
 */ 