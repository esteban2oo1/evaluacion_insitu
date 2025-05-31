// src/api/v1/controllers/evaluacion/configuracionEvaluacion.controller.js
const ConfiguracionEvaluacionModel = require('../../models/evaluacion/configuracionEvaluacion.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');
const moment = require('moment');

const getConfiguraciones = async (req, res, next) => {
  try {
    const configuraciones = await ConfiguracionEvaluacionModel.getAllConfiguraciones();
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.FETCH_SUCCESS, 
      data: configuraciones 
    });
  } catch (error) {
    next(error);
  }
};

const getConfiguracionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracion = await ConfiguracionEvaluacionModel.getConfiguracionById(id);

    if (!configuracion) {
      return errorResponse(res, { 
        code: 404, 
        message: MESSAGES.GENERAL.NOT_FOUND 
      });
    }

    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.FETCH_SUCCESS, 
      data: configuracion 
    });
  } catch (error) {
    next(error);
  }
};

const createConfiguracion = async (req, res, next) => {
  try {
    const configuracionData = req.body;

    // 👇 Lógica para ACTIVO:
    const inicio = moment.utc(configuracionData.FECHA_INICIO).startOf('day');
    const today = moment.utc().startOf('day');
    configuracionData.ACTIVO = inicio.isSame(today) ? 1 : 0;

    const newConfiguracion = await ConfiguracionEvaluacionModel.createConfiguracion(configuracionData);
    return successResponse(res, { 
      code: 201, 
      message: MESSAGES.GENERAL.CREATED, 
      data: newConfiguracion 
    });
  } catch (error) {
    next(error);
  }
};

const updateConfiguracion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const configuracionData = req.body;

    const configuracion = await ConfiguracionEvaluacionModel.getConfiguracionById(id);
    if (!configuracion) {
      return errorResponse(res, { 
        code: 404, 
        message: MESSAGES.GENERAL.NOT_FOUND 
      });
    }

    // 👇 Lógica para ACTIVO también en update:
    const inicio = moment.utc(configuracionData.FECHA_INICIO).startOf('day');
    const today = moment.utc().startOf('day');
    configuracionData.ACTIVO = inicio.isSame(today) ? 1 : 0;

    const updatedConfiguracion = await ConfiguracionEvaluacionModel.updateConfiguracion(id, configuracionData);
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.UPDATED, 
      data: updatedConfiguracion 
    });
  } catch (error) {
    next(error);
  }
};

const deleteConfiguracion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const configuracion = await ConfiguracionEvaluacionModel.getConfiguracionById(id);
    if (!configuracion) {
      return errorResponse(res, { 
        code: 404, 
        message: MESSAGES.GENERAL.NOT_FOUND 
      });
    }

    await ConfiguracionEvaluacionModel.deleteConfiguracion(id);
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.DELETED 
    });
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

    const configuracion = await ConfiguracionEvaluacionModel.getConfiguracionById(id);

    if (!configuracion) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const updated = await ConfiguracionEvaluacionModel.updateEstado(id, activo);

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
