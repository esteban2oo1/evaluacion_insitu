/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DOCUMENTO_USUARIO:
 *                 type: string
 *                 example: "1234567890"
 *               CONTRASEÑA:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales incorrectas
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         NOMBRE_DOCENTE:
 *                           type: string
 *                           example: "Pedro Salazar"
 *                         DOCUMENTO_DOCENTE:
 *                           type: string
 *                           example: "9000001"
 *                         MATERIAS:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               NOMBRE_MATERIA:
 *                                 type: string
 *                                 example: "Matemáticas I"
 *                         ROL:
 *                           type: object
 *                           properties:
 *                             NOMBRE_ROL:
 *                               type: string
 *                               example: "Docente"
 *                     - type: object
 *                       properties:
 *                         NOMBRE_ESTUDIANTE:
 *                           type: string
 *                           example: "Juan Carlos Gómez López"
 *                         DOCUMENTO_ESTUDIANTE:
 *                           type: string
 *                           example: "1000001"
 *                         SEMESTRE_MATRICULA:
 *                           type: string
 *                           example: "2025-1"
 *                         MATERIAS_DOCENTE:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               NOMBRE_MATERIA:
 *                                 type: string
 *                                 example: "Matemáticas I"
 *                               NOMBRE_DOCENTE:
 *                                 type: string
 *                                 example: "Pedro Salazar"
 *                               DOCUMENTO_DOCENTE:
 *                                 type: string
 *                                 example: "9000001"
 *                         ESTADO_MATRICULA:
 *                           type: string
 *                           example: "MATRICULADO"
 *                         ROL:
 *                           type: object
 *                           properties:
 *                             NOMBRE_ROL:
 *                               type: string
 *                               example: "Estudiante"
 *       401:
 *         description: Token inválido o expirado
 *       403:
 *         description: Rol no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
