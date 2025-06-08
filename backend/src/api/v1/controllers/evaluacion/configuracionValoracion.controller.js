// src/api/v1/controllers/evaluacion/configuracionValoracion.controller.js
const ConfiguracionValoracionModel = require('../../models/evaluacion/configuracionValoracion.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const getConfiguraciones = async (req, res, next) => {
  try {
    const configuraciones = await ConfiguracionValoracionModel.getAllConfiguraciones();
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: configuraciones });
  } catch (error) {
    next(error);
  }
};

const getConfiguracionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracion = await ConfiguracionValoracionModel.getConfiguracionById(id);
    
    if (!configuracion) {
      return errorResponse(res, { code: 404, message: MESSAGES.CONFIGURACION_VALORACION.NOT_FOUND });
    }
    
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: configuracion });
  } catch (error) {
    next(error);
  }
};

const createConfiguracion = async (req, res, next) => {
  try {
    const configuracionData = req.body;
    const newConfiguracion = await ConfiguracionValoracionModel.createConfiguracion(configuracionData);

    return successResponse(res, { code: 201, message: MESSAGES.GENERAL.CREATED, data: newConfiguracion });
  } catch (error) {
    next(error);
  }
};

const updateConfiguracion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracion = await ConfiguracionValoracionModel.getConfiguracionById(id);

    if (!configuracion) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const configuracionData = req.body;
    const updatedConfiguracion = await ConfiguracionValoracionModel.updateConfiguracion(id, configuracionData);

    return successResponse(res, { message: MESSAGES.GENERAL.UPDATED, data: updatedConfiguracion });
  } catch (error) {
    next(error);
  }
};

const deleteConfiguracion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracion = await ConfiguracionValoracionModel.getConfiguracionById(id);
    
    if (!configuracion) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    await ConfiguracionValoracionModel.deleteConfiguracion(id);
    return successResponse(res, { message: MESSAGES.GENERAL.DELETED });
  } catch (error) {
    next(error);
  }
};

const updateEstadoConfiguracion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (typeof activo !== 'number' || (activo !== 0 && activo !== 1)) {
      return errorResponse(res, { code: 400, message: 'Valor de estado inválido' });
    }

    const configuracion = await ConfiguracionValoracionModel.getConfiguracionById(id);

    if (!configuracion) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const updated = await ConfiguracionValoracionModel.updateEstado(id, activo);

    return successResponse(res, {
      message: MESSAGES.GENERAL.UPDATED,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfiguraciones,
  getConfiguracionById,
  createConfiguracion,
  updateConfiguracion,
  deleteConfiguracion,
  updateEstadoConfiguracion
};
