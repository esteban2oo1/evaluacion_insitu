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
 *     summary: Obtiene estadísticas generales del dashboard con filtros dinámicos
 *     description: |
 *       Obtiene estadísticas del dashboard aplicando filtros de forma jerárquica y dinámica.
 *       Los filtros se aplican en el siguiente orden de prioridad:
 *       1. ID_CONFIGURACION (obligatorio)
 *       2. NOMBRE_SEDE (opcional)
 *       3. NOM_PROGRAMA (opcional) 
 *       4. SEMESTRE (opcional)
 *       5. GRUPO (opcional)
 *       
 *       Puedes usar cualquier combinación de filtros respetando la jerarquía.
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: idConfiguracion
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de configuración para filtrar las estadísticas (obligatorio)
 *         example: "1"
 *       - in: query
 *         name: periodo
 *         required: false
 *         schema:
 *           type: string
 *         description: Periodo de evaluación (opcional)
 *         example: "2025-1"
 *       - in: query
 *         name: nombreSede
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre de la sede (opcional - filtro nivel 2)
 *         example: "Sede Principal"
 *       - in: query
 *         name: nomPrograma
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre del programa académico (opcional - filtro nivel 3)
 *         example: "Ingeniería de Sistemas"
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *         description: Semestre académico (opcional - filtro nivel 4)
 *         example: "2024-1"
 *       - in: query
 *         name: grupo
 *         required: false
 *         schema:
 *           type: string
 *         description: Grupo del estudiante (opcional - filtro nivel 5)
 *         example: "A"
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
 *                   description: Total de estudiantes únicos
 *                   example: 150
 *                 total_evaluaciones:
 *                   type: integer
 *                   description: Total de evaluaciones (estudiante-asignatura)
 *                   example: 450
 *                 evaluaciones_completadas:
 *                   type: integer
 *                   description: Número de evaluaciones completadas
 *                   example: 320
 *                 evaluaciones_pendientes:
 *                   type: integer
 *                   description: Número de evaluaciones pendientes
 *                   example: 130
 *                 porcentaje_completado:
 *                   type: number
 *                   format: float
 *                   description: Porcentaje de evaluaciones completadas
 *                   example: 71.11
 *                 docentes_evaluados:
 *                   type: integer
 *                   description: Número de docentes que han sido completamente evaluados
 *                   example: 8
 *                 total_docentes:
 *                   type: integer
 *                   description: Total de docentes en el filtro aplicado
 *                   example: 12
 *                 porcentaje_docentes_evaluados:
 *                   type: number
 *                   format: float
 *                   description: Porcentaje de docentes completamente evaluados
 *                   example: 66.67
 *             examples:
 *               solo_configuracion:
 *                 summary: Solo con ID de configuración
 *                 value:
 *                   total_estudiantes: 500
 *                   total_evaluaciones: 1500
 *                   evaluaciones_completadas: 1200
 *                   evaluaciones_pendientes: 300
 *                   porcentaje_completado: 80.00
 *                   docentes_evaluados: 45
 *                   total_docentes: 50
 *                   porcentaje_docentes_evaluados: 90.00
 *               con_sede:
 *                 summary: Filtrado por configuración y sede
 *                 value:
 *                   total_estudiantes: 200
 *                   total_evaluaciones: 600
 *                   evaluaciones_completadas: 480
 *                   evaluaciones_pendientes: 120
 *                   porcentaje_completado: 80.00
 *                   docentes_evaluados: 18
 *                   total_docentes: 20
 *                   porcentaje_docentes_evaluados: 90.00
 *               filtro_completo:
 *                 summary: Con todos los filtros aplicados
 *                 value:
 *                   total_estudiantes: 25
 *                   total_evaluaciones: 75
 *                   evaluaciones_completadas: 60
 *                   evaluaciones_pendientes: 15
 *                   porcentaje_completado: 80.00
 *                   docentes_evaluados: 2
 *                   total_docentes: 3
 *                   porcentaje_docentes_evaluados: 66.67
 *       400:
 *         description: Faltan parámetros requeridos o parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error detallado
 *             examples:
 *               missing_config:
 *                 summary: Falta ID de configuración
 *                 value:
 *                   message: "ID_CONFIGURACION es obligatorio."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error del servidor
 *                   example: "Error interno del servidor."
 * 
 * @swagger
 * components:
 *   examples:
 *     DashboardQueries:
 *       summary: Ejemplos de consultas válidas
 *       description: |
 *         Ejemplos de cómo usar los filtros jerárquicos:
 *         
 *         • Solo configuración:
 *           GET /dashboard/stats?idConfiguracion=1
 *         
 *         • Configuración + Sede:
 *           GET /dashboard/stats?idConfiguracion=1&nombreSede=Sede%20Principal
 *         
 *         • Configuración + Sede + Programa:
 *           GET /dashboard/stats?idConfiguracion=1&nombreSede=Sede%20Principal&nomPrograma=Ingeniería
 *         
 *         • Configuración + Sede + Programa + Semestre:
 *           GET /dashboard/stats?idConfiguracion=1&nombreSede=Sede%20Principal&nomPrograma=Ingeniería&semestre=2024-1
 *         
 *         • Todos los filtros:
 *           GET /dashboard/stats?idConfiguracion=1&nombreSede=Sede%20Principal&nomPrograma=Ingeniería&semestre=2024-1&grupo=A
 */

/**
 * @swagger
 * /dashboard/aspectos:
 *   get:
 *     summary: Obtiene promedios por aspecto de evaluación con filtros dinámicos
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: idConfiguracion
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración de evaluación
 *       - in: query
 *         name: periodo
 *         required: false
 *         schema:
 *           type: string
 *         description: Periodo de evaluación (opcional)
 *         example: "2025-1"
 *       - in: query
 *         name: nombreSede
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre de la sede (opcional)
 *       - in: query
 *         name: nomPrograma
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre del programa (opcional)
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *         required: false
 *         description: Semestre (opcional)
 *       - in: query
 *         name: grupo
 *         schema:
 *           type: string
 *         required: false
 *         description: Grupo (opcional)
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
 *       400:
 *         description: Solicitud inválida, parámetros requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /dashboard/ranking:
 *   get:
 *     summary: Obtiene el ranking de docentes con filtros dinámicos
 *     description: |
 *       Obtiene el ranking completo de docentes aplicando filtros de forma jerárquica y dinámica.
 *       Los filtros se aplican en el siguiente orden de prioridad:
 *       1. ID_CONFIGURACION (obligatorio)
 *       2. NOMBRE_SEDE (opcional)
 *       3. NOM_PROGRAMA (opcional)
 *       4. SEMESTRE (opcional)
 *       5. GRUPO (opcional)
 *       
 *       Puedes usar cualquier combinación de filtros respetando la jerarquía.
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: idConfiguracion
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de configuración para filtrar el ranking de docentes (obligatorio)
 *         example: "1"
 *       - in: query
 *         name: periodo
 *         required: false
 *         schema:
 *           type: string
 *         description: Periodo de evaluación (opcional)
 *         example: "2025-1"
 *       - in: query
 *         name: nombreSede
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre de la sede (opcional - filtro nivel 2)
 *         example: "Sede Principal"
 *       - in: query
 *         name: nomPrograma
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre del programa académico (opcional - filtro nivel 3)
 *         example: "Ingeniería de Sistemas"
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *         description: Semestre académico (opcional - filtro nivel 4)
 *         example: "2024-1"
 *       - in: query
 *         name: grupo
 *         required: false
 *         schema:
 *           type: string
 *         description: Grupo del estudiante (opcional - filtro nivel 5)
 *         example: "A"
 *     responses:
 *       200:
 *         description: Ranking de docentes obtenido exitosamente
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
 *             examples:
 *               solo_configuracion:
 *                 summary: Solo con ID de configuración
 *                 value:
 *                   - ID_DOCENTE: "D001"
 *                     DOCENTE: "Juan Pérez"
 *                     TOTAL_PUNTAJE: 85.50
 *                     PROMEDIO_GENERAL: 4.2
 *                     TOTAL_RESPUESTAS: 120
 *                     evaluaciones_esperadas: 150
 *                     evaluaciones_realizadas: 120
 *                     evaluaciones_pendientes: 30
 *               con_sede:
 *                 summary: Filtrado por configuración y sede
 *                 value:
 *                   - ID_DOCENTE: "D002"
 *                     DOCENTE: "Ana Gómez"
 *                     TOTAL_PUNTAJE: 92.00
 *                     PROMEDIO_GENERAL: 4.5
 *                     TOTAL_RESPUESTAS: 140
 *                     evaluaciones_esperadas: 150
 *                     evaluaciones_realizadas: 140
 *                     evaluaciones_pendientes: 10
 *               filtro_completo:
 *                 summary: Con todos los filtros aplicados
 *                 value:
 *                   - ID_DOCENTE: "D003"
 *                     DOCENTE: "Carlos Martínez"
 *                     TOTAL_PUNTAJE: 95.00
 *                     PROMEDIO_GENERAL: 4.8
 *                     TOTAL_RESPUESTAS: 150
 *                     evaluaciones_esperadas: 150
 *                     evaluaciones_realizadas: 150
 *                     evaluaciones_pendientes: 0
 *       400:
 *         description: Faltan parámetros requeridos o parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error detallado
 *             examples:
 *               missing_config:
 *                 summary: Falta ID de configuración
 *                 value:
 *                   message: "ID_CONFIGURACION es obligatorio."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error del servidor
 *                   example: "Error interno del servidor."
 * 
 * @swagger
 * components:
 *   examples:
 *     RankingQueries:
 *       summary: Ejemplos de consultas válidas para obtener el ranking de docentes
 *       description: |
 *         Ejemplos de cómo usar los filtros jerárquicos:
 *         
 *         • Solo configuración:
 *           GET /dashboard/ranking?idConfiguracion=1
 *         
 *         • Configuración + Sede:
 *           GET /dashboard/ranking?idConfiguracion=1&nombreSede=Sede%20Principal
 *         
 *         • Configuración + Sede + Programa:
 *           GET /dashboard/ranking?idConfiguracion=1&nombreSede=Sede%20Principal&nomPrograma=Ingeniería
 *         
 *         • Configuración + Sede + Programa + Semestre:
 *           GET /dashboard/ranking?idConfiguracion=1&nombreSede=Sede%20Principal&nomPrograma=Ingeniería&semestre=2024-1
 *         
 *         • Todos los filtros:
 *           GET /dashboard/ranking?idConfiguracion=1&nombreSede=Sede%20Principal&nomPrograma=Ingeniería&semestre=2024-1&grupo=A
 */

/**
 * @swagger
 * /dashboard/podio:
 *   get:
 *     summary: Obtiene el podio de docentes (3 mejores y 3 peores) con filtros dinámicos
 *     description: |
 *       Este endpoint devuelve el podio de docentes, mostrando a los 3 mejores y los 3 peores docentes 
 *       basados en su puntaje. Los filtros para obtener los docentes del podio son dinámicos y 
 *       se aplican en el siguiente orden de prioridad:
 *       1. ID_CONFIGURACION (obligatorio)
 *       2. NOMBRE_SEDE (opcional)
 *       3. NOM_PROGRAMA (opcional)
 *       4. SEMESTRE (opcional)
 *       5. GRUPO (opcional)
 *       
 *       Los docentes seleccionados serán ordenados por su puntaje general.
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: idConfiguracion
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de configuración para filtrar el podio (obligatorio)
 *         example: "1"
 *       - in: query
 *         name: periodo
 *         required: false
 *         schema:
 *           type: string
 *         description: Periodo de evaluación (opcional)
 *         example: "2025-1"
 *       - in: query
 *         name: nombreSede
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre de la sede para filtrar el podio (opcional)
 *         example: "Sede Principal"
 *       - in: query
 *         name: nomPrograma
 *         required: false
 *         schema:
 *           type: string
 *         description: Nombre del programa académico para filtrar el podio (opcional)
 *         example: "Ingeniería de Sistemas"
 *       - in: query
 *         name: semestre
 *         required: false
 *         schema:
 *           type: string
 *         description: Semestre para filtrar el podio (opcional)
 *         example: "2024-1"
 *       - in: query
 *         name: grupo
 *         required: false
 *         schema:
 *           type: string
 *         description: Grupo para filtrar el podio (opcional)
 *         example: "A"
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
 *                     description: Posición en el podio ("TOP 1 MEJOR", "TOP 2 PEOR", etc.)
 *       400:
 *         description: Parámetros inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error
 *             examples:
 *               missing_params:
 *                 summary: Parámetros faltantes
 *                 value:
 *                   message: "Faltan parámetros requeridos o son inválidos."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error del servidor
 *                   example: "Error interno del servidor."
 * 
 * @swagger
 * components:
 *   examples:
 *     PodioExample:
 *       summary: Ejemplo de respuesta exitosa del podio
 *       value:
 *         - ID_DOCENTE: "1"
 *           DOCENTE: "Carlos Pérez"
 *           TOTAL_PUNTAJE: 98.5
 *           PROMEDIO_GENERAL: 9.85
 *           TOTAL_RESPUESTAS: 500
 *           evaluaciones_esperadas: 510
 *           evaluaciones_realizadas: 480
 *           evaluaciones_pendientes: 30
 *           POSICION: "TOP 1 MEJOR"
 *         - ID_DOCENTE: "2"
 *           DOCENTE: "Ana López"
 *           TOTAL_PUNTAJE: 95.0
 *           PROMEDIO_GENERAL: 9.50
 *           TOTAL_RESPUESTAS: 450
 *           evaluaciones_esperadas: 460
 *           evaluaciones_realizadas: 440
 *           evaluaciones_pendientes: 20
 *           POSICION: "TOP 2 MEJOR"
 *         - ID_DOCENTE: "3"
 *           DOCENTE: "Luis Rodríguez"
 *           TOTAL_PUNTAJE: 92.0
 *           PROMEDIO_GENERAL: 9.20
 *           TOTAL_RESPUESTAS: 430
 *           evaluaciones_esperadas: 450
 *           evaluaciones_realizadas: 420
 *           evaluaciones_pendientes: 30
 *           POSICION: "TOP 3 MEJOR"
 *         - ID_DOCENTE: "100"
 *           DOCENTE: "María García"
 *           TOTAL_PUNTAJE: 65.5
 *           PROMEDIO_GENERAL: 6.55
 *           TOTAL_RESPUESTAS: 200
 *           evaluaciones_esperadas: 250
 *           evaluaciones_realizadas: 180
 *           evaluaciones_pendientes: 70
 *           POSICION: "TOP 1 PEOR"
 *       400:
 *         description: Faltan parámetros requeridos o parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error detallado
 *             examples:
 *               missing_params:
 *                 summary: Faltan parámetros requeridos
 *                 value:
 *                   message: "Faltan parámetros requeridos para obtener el podio."
 * 
 */
