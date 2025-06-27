/**
 * @swagger
 * /informe-docentes:
 *   get:
 *     summary: Genera y descarga un documento Word con información de docentes evaluados
 *     tags:
 *       - [Descargas]
 *     description: Este endpoint genera un documento Word (.docx) con la información de asignaturas y docentes evaluados, permitiendo aplicar filtros por sede, programa, semestre y grupo.
 *     parameters:
 *       - in: query
 *         name: idConfiguracion
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la configuración de evaluación
 *         example: 57
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         required: false
 *         description: Periodo académico (ej. 2024A)
 *         example: "2024A"
 *       - in: query
 *         name: nombreSede
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre de la sede
 *         example: "ITP-MOCOA"
 *       - in: query
 *         name: nomPrograma
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre del programa académico
 *         example: "INGENIERIA DE SISTEMAS"
 *       - in: query
 *         name: semestre
 *         schema:
 *           type: string
 *         required: false
 *         description: Semestre académico
 *         example: "NOVENO"
 *       - in: query
 *         name: grupo
 *         schema:
 *           type: string
 *         required: false
 *         description: Grupo académico
 *         example: "A"
 *     responses:
 *       200:
 *         description: Documento Word generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros faltantes o inválidos
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /backup:
 *   get:
 *     summary: Generar y descargar un respaldo de la base de datos
 *     tags:
 *       - [Descargas]
 *     responses:
 *       200:
 *         description: Archivo SQL generado correctamente
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error interno del servidor
 */
