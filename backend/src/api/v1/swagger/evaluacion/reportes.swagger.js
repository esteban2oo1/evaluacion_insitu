/**
 * @swagger
 * components:
 *   schemas:
 *     ProgresoEstudianteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total_evaluaciones:
 *               type: integer
 *               example: 6
 *             evaluaciones_completadas:
 *               type: integer
 *               example: 3
 *             porcentaje_completado:
 *               type: string
 *               example: "50.00"
 *             evaluaciones_pendientes:
 *               type: integer
 *               example: 3
 *             materias_pendientes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre_materia:
 *                     type: string
 *                     example: "Matemáticas I"
 *                   nombre_docente:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   documento_docente:
 *                     type: string
 *                     example: "9000001"
 * 
 *     ReporteGeneralResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total_estudiantes:
 *               type: integer
 *               example: 100
 *             total_evaluaciones:
 *               type: integer
 *               example: 600
 *             evaluaciones_completadas:
 *               type: integer
 *               example: 450
 *             evaluaciones_pendientes:
 *               type: integer
 *               example: 150
 *             porcentaje_completado:
 *               type: string
 *               example: "75.00"
 *             semestre_actual:
 *               type: string
 *               example: "2025-1"
 * 
 *     DesempenoDocenteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total_docentes:
 *               type: integer
 *               example: 20
 *             mejor_docente:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "9000001"
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 promedio:
 *                   type: string
 *                   example: "4.75"
 *                 evaluaciones_positivas:
 *                   type: integer
 *                   example: 45
 *             peor_docente:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "9000002"
 *                 nombre:
 *                   type: string
 *                   example: "María García"
 *                 promedio:
 *                   type: string
 *                   example: "2.50"
 *                 evaluaciones_negativas:
 *                   type: integer
 *                   example: 15
 *             promedio_general:
 *               type: string
 *               example: "3.85"
 * 
 *     ReporteAspectosResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total_aspectos:
 *               type: integer
 *               example: 5
 *             promedio_general:
 *               type: string
 *               example: "3.80"
 *             semestre_actual:
 *               type: string
 *               example: "2025-1"
 *             aspectos:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   aspecto_id:
 *                     type: integer
 *                     example: 1
 *                   etiqueta:
 *                     type: string
 *                     example: "Dominio del tema"
 *                   promedio:
 *                     type: string
 *                     example: "4.20"
 *                   total_evaluaciones:
 *                     type: integer
 *                     example: 100
 *                   porcentaje_positivo:
 *                     type: string
 *                     example: "85.00"
 *                   porcentaje_negativo:
 *                     type: string
 *                     example: "5.00"
 *                   total_docentes_evaluados:
 *                     type: integer
 *                     example: 15
 *                   total_estudiantes_evaluadores:
 *                     type: integer
 *                     example: 80
 * 
 *     ReporteFacultadProgramaResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             codigo_facultad:
 *               type: string
 *               example: "FAC01"
 *             nombre_facultad:
 *               type: string
 *               example: "Facultad de Ingeniería"
 *             codigo_programa:
 *               type: string
 *               example: "1001"
 *             nombre_programa:
 *               type: string
 *               example: "Ingeniería de Sistemas"
 *             total_estudiantes:
 *               type: integer
 *               example: 150
 *             total_evaluaciones:
 *               type: integer
 *               example: 750
 *             evaluaciones_completadas:
 *               type: integer
 *               example: 600
 *             evaluaciones_pendientes:
 *               type: integer
 *               example: 150
 *             total_docentes:
 *               type: integer
 *               example: 25
 *             porcentaje_completado:
 *               type: string
 *               example: "80.00"
 * 
 *     EstudiantesPendientesResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total_estudiantes_pendientes:
 *               type: integer
 *               example: 15
 *             estudiantes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documento_estudiante:
 *                     type: string
 *                     example: "1000001"
 *                   nombre_estudiante:
 *                     type: string
 *                     example: "Juan Carlos Gómez López"
 *                   semestre_matricula:
 *                     type: string
 *                     example: "2025-1"
 *                   evaluaciones_completadas:
 *                     type: integer
 *                     example: 2
 *                   total_materias:
 *                     type: integer
 *                     example: 6
 *                   materias_pendientes:
 *                     type: string
 *                     example: "Matemáticas I,Programación I,Física I"
 * 
 *     DesempenoDocenteProgramaResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             total_docentes:
 *               type: integer
 *               example: 10
 *             mejor_docente:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "9000001"
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 promedio:
 *                   type: string
 *                   example: "4.75"
 *                 evaluaciones_positivas:
 *                   type: integer
 *                   example: 45
 *                 materias:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Matemáticas I,Programación I"
 *             peor_docente:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "9000002"
 *                 nombre:
 *                   type: string
 *                   example: "María García"
 *                 promedio:
 *                   type: string
 *                   example: "2.50"
 *                 evaluaciones_negativas:
 *                   type: integer
 *                   example: 15
 *                 materias:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "Física I"
 *             promedio_general:
 *               type: string
 *               example: "3.85"
 *             docentes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documento:
 *                     type: string
 *                     example: "9000001"
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   promedio:
 *                     type: string
 *                     example: "4.75"
 *                   total_evaluaciones:
 *                     type: integer
 *                     example: 50
 *                   evaluaciones_positivas:
 *                     type: integer
 *                     example: 45
 *                   evaluaciones_negativas:
 *                     type: integer
 *                     example: 5
 *                   materias:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Matemáticas I,Programación I"
 * 
 *     DetalleAspectoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             aspecto:
 *               type: object
 *               properties:
 *                 ETIQUETA:
 *                   type: string
 *                   example: "Dominio del tema"
 *                 DESCRIPCION:
 *                   type: string
 *                   example: "El docente demuestra conocimiento profundo del tema"
 *             semestre_actual:
 *               type: string
 *               example: "2025-1"
 *             total_docentes:
 *               type: integer
 *               example: 10
 *             docentes:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documento:
 *                     type: string
 *                     example: "9000001"
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   promedio:
 *                     type: string
 *                     example: "4.50"
 *                   total_evaluaciones:
 *                     type: integer
 *                     example: 45
 *                   porcentaje_positivo:
 *                     type: string
 *                     example: "90.00"
 *                   porcentaje_negativo:
 *                     type: string
 *                     example: "2.00"
 *                   total_estudiantes_evaluadores:
 *                     type: integer
 *                     example: 40
 *                   materias_dictadas:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "Matemáticas I,Programación I"
 * 
 *     DetalleDocenteAspectoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             docente:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "9000001"
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *             semestre_actual:
 *               type: string
 *               example: "2025-1"
 *             total_evaluaciones:
 *               type: integer
 *               example: 45
 *             promedio:
 *               type: string
 *               example: "4.50"
 *             porcentaje_positivo:
 *               type: string
 *               example: "90.00"
 *             porcentaje_negativo:
 *               type: string
 *               example: "2.00"
 *             evaluaciones:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documento_estudiante:
 *                     type: string
 *                     example: "1000001"
 *                   nombre_estudiante:
 *                     type: string
 *                     example: "Carlos Gómez"
 *                   materia:
 *                     type: string
 *                     example: "Matemáticas I"
 *                   puntaje:
 *                     type: number
 *                     example: 0.9
 *                   valoracion:
 *                     type: string
 *                     example: "Excelente"
 *                   comentario:
 *                     type: string
 *                     example: "El docente explica muy bien los conceptos"
 * 
 *     MetricasDocenteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             nombre_docente:
 *               type: string
 *               example: "Juan Pérez"
 *             documento_docente:
 *               type: string
 *               example: "9000001"
 *             total_materias_dictadas:
 *               type: integer
 *               example: 3
 *             total_estudiantes_evaluadores:
 *               type: integer
 *               example: 45
 *             promedio_general:
 *               type: number
 *               format: float
 *               example: 4.2
 *             evaluaciones_positivas:
 *               type: integer
 *               example: 40
 *             evaluaciones_negativas:
 *               type: integer
 *               example: 2
 *             materias_dictadas:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Matemáticas I, Programación I"
 *             porcentaje_positivo:
 *               type: number
 *               format: float
 *               example: 88.89
 *             porcentaje_negativo:
 *               type: number
 *               format: float
 *               example: 4.44
 * 
 *     EstudiantesPendientesMateriaResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               codigo_materia:
 *                 type: string
 *                 example: "MAT101"
 *               nombre_materia:
 *                 type: string
 *                 example: "Matemáticas I"
 *               total_estudiantes:
 *                 type: integer
 *                 example: 30
 *               estudiantes_evaluados:
 *                 type: integer
 *                 example: 25
 *               estudiantes_pendientes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Carlos Gómez, Ana López"
 *               porcentaje_evaluado:
 *                 type: number
 *                 format: float
 *                 example: 83.33
 * 
 *     RankingDocentesAspectoResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               documento_docente:
 *                 type: string
 *                 example: "9000001"
 *               nombre_docente:
 *                 type: string
 *                 example: "Juan Pérez"
 *               promedio:
 *                 type: number
 *                 format: float
 *                 example: 4.5
 *               total_estudiantes_evaluadores:
 *                 type: integer
 *                 example: 45
 *               evaluaciones_positivas:
 *                 type: integer
 *                 example: 42
 *               evaluaciones_negativas:
 *                 type: integer
 *                 example: 1
 *               materias_dictadas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Matemáticas I, Programación I"
 *               porcentaje_positivo:
 *                 type: number
 *                 format: float
 *                 example: 93.33
 *               porcentaje_negativo:
 *                 type: number
 *                 format: float
 *                 example: 2.22
 * 
 *     ResumenEvaluacionesProgramaResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             nombre_programa:
 *               type: string
 *               example: "Ingeniería de Sistemas"
 *             total_docentes:
 *               type: integer
 *               example: 15
 *             total_estudiantes:
 *               type: integer
 *               example: 200
 *             total_materias:
 *               type: integer
 *               example: 30
 *             total_evaluaciones:
 *               type: integer
 *               example: 500
 *             promedio_general:
 *               type: number
 *               format: float
 *               example: 4.1
 *             evaluaciones_positivas:
 *               type: integer
 *               example: 450
 *             evaluaciones_negativas:
 *               type: integer
 *               example: 20
 *             porcentaje_positivo:
 *               type: number
 *               format: float
 *               example: 90.00
 *             porcentaje_negativo:
 *               type: number
 *               format: float
 *               example: 4.00
 */

/**
 * @swagger
 * /reportes/progreso/{documentoEstudiante}:
 *   get:
 *     summary: Obtener progreso de evaluación de un estudiante
 *     description: Retorna el progreso de evaluación de un estudiante específico, incluyendo materias pendientes
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentoEstudiante
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del estudiante
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Progreso obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgresoEstudianteResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/general:
 *   get:
 *     summary: Obtener reporte general de evaluaciones
 *     description: Retorna estadísticas generales de las evaluaciones en el sistema
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteGeneralResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/desempeno-docente:
 *   get:
 *     summary: Obtener reporte de desempeño docente
 *     description: Retorna estadísticas del desempeño de los docentes en el sistema
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DesempenoDocenteResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/aspectos:
 *   get:
 *     summary: Obtener reporte de aspectos evaluados
 *     description: Retorna estadísticas de los aspectos evaluados en el sistema
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteAspectosResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/aspectos/{aspectoId}:
 *   get:
 *     summary: Obtener detalles de un aspecto específico
 *     description: Retorna información detallada de un aspecto, incluyendo estadísticas por docente
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aspectoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aspecto
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Detalles obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleAspectoResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/aspectos/{aspectoId}/docente/{documentoDocente}:
 *   get:
 *     summary: Obtener detalles de un docente en un aspecto específico
 *     description: Retorna información detallada de las evaluaciones de un docente en un aspecto específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aspectoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aspecto
 *       - in: path
 *         name: documentoDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del docente
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Detalles obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetalleDocenteAspectoResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/facultad/{facultadId}/programa/{programaId}:
 *   get:
 *     summary: Obtener reporte por facultad y programa
 *     description: Retorna estadísticas de evaluaciones por facultad y programa específicos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: facultadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facultad
 *       - in: path
 *         name: programaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del programa
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteFacultadProgramaResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       404:
 *         description: No se encontraron datos
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/estudiantes-pendientes/{facultadId}/{programaId}/{semestre}:
 *   get:
 *     summary: Obtener lista de estudiantes pendientes
 *     description: Retorna lista de estudiantes que no han completado sus evaluaciones en un semestre específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: facultadId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la facultad
 *       - in: path
 *         name: programaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del programa
 *       - in: path
 *         name: semestre
 *         required: true
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstudiantesPendientesResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/desempeno-docente/programa/{programaId}:
 *   get:
 *     summary: Obtener reporte de desempeño docente por programa
 *     description: Retorna estadísticas del desempeño de los docentes de un programa específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del programa
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DesempenoDocenteProgramaResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/aspectos/programa/{programaId}:
 *   get:
 *     summary: Obtener reporte de aspectos por programa
 *     description: Retorna estadísticas de los aspectos evaluados en un programa específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del programa
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReporteAspectosResponse'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos suficientes
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/docente/{documentoDocente}/metricas:
 *   get:
 *     summary: Obtener métricas detalladas de un docente
 *     description: Retorna estadísticas detalladas del desempeño de un docente específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentoDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del docente
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Métricas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetricasDocenteResponse'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron datos para el docente
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/docente/{documentoDocente}/estudiantes-pendientes:
 *   get:
 *     summary: Obtener estudiantes pendientes por materia
 *     description: Retorna lista de estudiantes que no han evaluado al docente por materia
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentoDocente
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del docente
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EstudiantesPendientesMateriaResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/aspectos/{aspectoId}/ranking:
 *   get:
 *     summary: Obtener ranking de docentes por aspecto
 *     description: Retorna ranking de docentes ordenados por su desempeño en un aspecto específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aspectoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del aspecto
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Ranking obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingDocentesAspectoResponse'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 * 
 * /reportes/programa/{programaId}/resumen:
 *   get:
 *     summary: Obtener resumen de evaluaciones por programa
 *     description: Retorna estadísticas generales de las evaluaciones en un programa específico
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del programa
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *           format: AAAA-S
 *         description: Semestre académico (por defecto 2025-1)
 *     responses:
 *       200:
 *         description: Resumen obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumenEvaluacionesProgramaResponse'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron datos para el programa
 *       500:
 *         description: Error del servidor
 */ 