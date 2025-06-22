const UserRoleModel = require('../../models/auth/userRole.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

// Obtener roles de un usuario específico
const getUserRoles = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const roles = await UserRoleModel.getUserRoles(userId);
    return successResponse(res, {
      data: roles,
      message: MESSAGES.GENERAL.FETCH_SUCCESS
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    next(error);
  }
};

// Obtener todos los roles asignados
const getAllUserRoles = async (req, res, next) => {
  try {
    const allRoles = await UserRoleModel.getAllUserRoles();
    return successResponse(res, {
      data: allRoles,
      message: MESSAGES.GENERAL.FETCH_SUCCESS
    });
  } catch (error) {
    console.error('Error fetching all user roles:', error);
    next(error);
  }
};

const searchUser = async (req, res, next) => {
  try {
    // Obtener el username desde los parámetros de la URL o query string
    const { username } = req.params; // Si viene por URL: /search/:username
    // O si prefieres por query: const { username } = req.query; // /search?username=valor
    
    // Validar que se proporcione el username
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Buscar el usuario
    const user = await UserRoleModel.searchUser(username);
    
    // Verificar si se encontró el usuario
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return successResponse(res, {
      data: user,
      message: MESSAGES.GENERAL.FETCH_SUCCESS
    });
  } catch (error) {
    console.error('Error searching user:', error);
    next(error);
  }
};

// Asignar un rol a un usuario
const assignRole = async (req, res, next) => {
  try {
    const { userId, roleId } = req.body;

    const hasRole = await UserRoleModel.hasRole(userId, roleId);
    if (hasRole) {
      return errorResponse(res, {
        code: 400,
        message: 'El usuario ya tiene asignado este rol.'
      });
    }

    const newRole = await UserRoleModel.assignRole(userId, roleId);
    return successResponse(res, {
      data: newRole,
      message: MESSAGES.GENERAL.CREATED
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    next(error);
  }
};

// Actualizar el rol asignado
const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const updatedRole = await UserRoleModel.updateRoleAssignment(id, roleId);
    return successResponse(res, {
      data: updatedRole,
      message: MESSAGES.GENERAL.UPDATED
    });
  } catch (error) {
    console.error('Error updating role:', error);
    next(error);
  }
};

// Eliminar un rol asignado
const removeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    await UserRoleModel.removeRole(id);
    return successResponse(res, {
      message: MESSAGES.GENERAL.DELETED
    });
  } catch (error) {
    console.error('Error removing role:', error);
    next(error);
  }
};

module.exports = {
  getUserRoles,
  getAllUserRoles,
  searchUser,
  assignRole,
  updateRole,
  removeRole
};
