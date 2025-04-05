const RolesModel = require('../../models/auth/roles.model');

const getRoles = async (req, res, next) => {
  try {
    const roles = await RolesModel.getAllRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

const getRolById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rol = await RolesModel.getRolById(id);

    if (!rol) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    return res.status(200).json({ success: true, data: rol });
  } catch (error) {
    next(error);
  }
};

const createRol = async (req, res, next) => {
  try {
    const rolData = req.body;
    const newRol = await RolesModel.createRol(rolData);
    return res.status(201).json({ success: true, data: newRol });
  } catch (error) {
    next(error);
  }
};

const updateRol = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rolData = req.body;

    const rol = await RolesModel.getRolById(id);
    if (!rol) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    const updatedRol = await RolesModel.updateRol(id, rolData);
    return res.status(200).json({ success: true, data: updatedRol });
  } catch (error) {
    next(error);
  }
};

const deleteRol = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rol = await RolesModel.getRolById(id);
    if (!rol) {
      return res.status(404).json({ success: false, message: 'Rol no encontrado' });
    }

    await RolesModel.deleteRol(id);
    return res.status(200).json({ success: true, message: 'Rol eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol,
};