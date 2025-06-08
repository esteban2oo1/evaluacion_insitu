/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la asignación de rol
 *         user_id:
 *           type: integer
 *           description: ID del usuario
 *         role_name:
 *           type: string
 *           description: Nombre del rol
 *         CREATED_AT:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         UPDATED_AT:
 *           type: string
 *           format: date-time
 *           description: Fecha de actualización
 *     UserRoleResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserRole'
 *     UserRoleError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *         message:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalles del error
 */

/**
 * @swagger
 * /user-roles:
 *   get:
 *     summary: Obtener todos los roles asignados
 *     tags: [User Roles]
 *     responses:
 *       200:
 *         description: Lista de roles asignados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 */

/**
 * @swagger
 * /user-roles/{userId}:
 *   get:
 *     summary: Obtener roles de un usuario específico
 *     tags: [User Roles]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Roles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleResponse'
 *       404:
 *         description: No se encontraron roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 */

/**
 * @swagger
 * /user-roles:
 *   post:
 *     summary: Asignar un rol a un usuario
 *     tags: [User Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario
 *               roleId:
 *                 type: integer
 *                 description: ID del rol a asignar
 *     responses:
 *       201:
 *         description: Rol asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 */

/**
 * @swagger
 * /user-roles/{id}:
 *   put:
 *     summary: Actualizar un rol asignado
 *     tags: [User Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación de rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 description: Nuevo ID del rol
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 */

/**
 * @swagger
 * /user-roles/{id}:
 *   delete:
 *     summary: Eliminar un rol asignado
 *     tags: [User Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación de rol
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleResponse'
 *       404:
 *         description: No se encontró la asignación de rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRoleError'
 */ 