/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - user_username
 *         - user_password
 *       properties:
 *         user_username:
 *           type: string
 *           example: "1000001"
 *         user_password:
 *           type: string
 *           example: "1000001"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Inicio de sesión exitoso"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error al procesar la solicitud"
 *         error:
 *           type: string
 *           example: "Mensaje específico del error"
 */

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
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Campos requeridos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuario inactivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *                 message:
 *                   type: string
 *                   example: "Perfil obtenido exitosamente"
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
 *                         NOMBRE_PROGRAMA:
 *                           type: string
 *                           example: "Ingeniería de Sistemas"
 *                         MATERIAS:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               AI:
 *                                 type: integer
 *                                 example: 1
 *                               CODIGO_MATERIA:
 *                                 type: string
 *                                 example: "MAT101"
 *                               NOMBRE_MATERIA:
 *                                 type: string
 *                                 example: "Matemáticas I"
 *                               docente:
 *                                 type: object
 *                                 properties:
 *                                   DOCUMENTO_DOCENTE:
 *                                     type: string
 *                                     example: "9000001"
 *                                   NOMBRE_DOCENTE:
 *                                     type: string
 *                                     example: "Pedro Salazar"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Rol no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
