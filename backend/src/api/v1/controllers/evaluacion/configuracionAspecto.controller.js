// src/api/v1/controllers/evaluacion/configuracionAspecto.controller.js
const ConfiguracionAspectoModel = require('../../models/evaluacion/configuracionAspecto.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const getConfiguracionesAspecto = async (req, res, next) => {
  try {
    const configuracionesAspecto = await ConfiguracionAspectoModel.getAllConfiguracionesAspecto();
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: configuracionesAspecto });
  } catch (error) {
    next(error);
  }
};

const getConfiguracionAspectoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracionAspecto = await ConfiguracionAspectoModel.getConfiguracionAspectoById(id);
    
    if (!configuracionAspecto) {
      return errorResponse(res, { code: 404, message: MESSAGES.CONFIGURACION_ASPECTO.NOT_FOUND });
    }
    
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: configuracionAspecto });
  } catch (error) {
    next(error);
  }
};

const createConfiguracionAspecto = async (req, res, next) => {
  try {
    const configuracionAspectoData = req.body;
    const newConfiguracionAspecto = await ConfiguracionAspectoModel.createConfiguracionAspecto(configuracionAspectoData);

    return successResponse(res, { code: 201, message: MESSAGES.GENERAL.CREATED, data: newConfiguracionAspecto });
  } catch (error) {
    next(error);
  }
};

const updateConfiguracionAspecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracionAspecto = await ConfiguracionAspectoModel.getConfiguracionAspectoById(id);

    if (!configuracionAspecto) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const configuracionAspectoData = req.body;
    const updatedConfiguracionAspecto = await ConfiguracionAspectoModel.updateConfiguracionAspecto(id, configuracionAspectoData);

    return successResponse(res, { message: MESSAGES.GENERAL.UPDATED, data: updatedConfiguracionAspecto });
  } catch (error) {
    next(error);
  }
};

const deleteConfiguracionAspecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracionAspecto = await ConfiguracionAspectoModel.getConfiguracionAspectoById(id);
    
    if (!configuracionAspecto) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    await ConfiguracionAspectoModel.deleteConfiguracionAspecto(id);
    return successResponse(res, { message: MESSAGES.GENERAL.DELETED });
  } catch (error) {
    next(error);
  }
};

const updateEstadoConfiguracionAspecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (typeof activo !== 'number' || (activo !== 0 && activo !== 1)) {
      return errorResponse(res, { code: 400, message: 'Valor de estado inválido' });
    }

    const configuracion = await ConfiguracionAspectoModel.getConfiguracionAspectoById(id);

    if (!configuracion) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const updated = await ConfiguracionAspectoModel.updateEstado(id, activo);

    return successResponse(res, {
      message: MESSAGES.GENERAL.UPDATED,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfiguracionesAspecto,
  getConfiguracionAspectoById,
  createConfiguracionAspecto,
  updateConfiguracionAspecto,
  deleteConfiguracionAspecto,
  updateEstadoConfiguracionAspecto
};
