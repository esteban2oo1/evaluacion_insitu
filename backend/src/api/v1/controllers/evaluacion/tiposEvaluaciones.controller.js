const TiposEvaluacionModel = require('../../models/evaluacion/tiposEvaluaciones.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const getConfiguracionDetalles = async (req, res, next) => {
  try {
    const { id } = req.params; // Obtener el ID de la configuración desde los parámetros de la URL
    
    // Obtener los detalles de la configuración
    const detalles = await TiposEvaluacionModel.getConfiguracionDetalles(id);
    
    return successResponse(res, {
      message: MESSAGES.GENERAL.FETCH_SUCCESS,
      data: detalles
    });
  } catch (error) {
    next(error);
  }
};

const getTipos = async (req, res, next) => {
  try {
    const tipos = await TiposEvaluacionModel.getAllTipos();
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: tipos });
  } catch (error) {
    next(error);
  }
};

const getTipoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipo = await TiposEvaluacionModel.getTipoById(id);

    if (!tipo) {
      return errorResponse(res, { code: 404, message: MESSAGES.TIPOS_NOT_FOUND });
    }

    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: tipo });
  } catch (error) {
    next(error);
  }
};

const createTipo = async (req, res, next) => {
  try {
    const tipoData = req.body;
    const newTipo = await TiposEvaluacionModel.createTipo(tipoData);

    return successResponse(res, { code: 201, message: MESSAGES.GENERAL.CREATED, data: newTipo });
  } catch (error) {
    next(error);
  }
};

const updateTipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipo = await TiposEvaluacionModel.getTipoById(id);

    if (!tipo) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const tipoData = req.body;
    const updatedTipo = await TiposEvaluacionModel.updateTipo(id, tipoData);

    return successResponse(res, { message: MESSAGES.GENERAL.UPDATED, data: updatedTipo });
  } catch (error) {
    next(error);
  }
};

const deleteTipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tipo = await TiposEvaluacionModel.getTipoById(id);

    if (!tipo) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    await TiposEvaluacionModel.deleteTipo(id);
    return successResponse(res, { message: MESSAGES.GENERAL.DELETED });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfiguracionDetalles,
  getTipos,
  getTipoById,
  createTipo,
  updateTipo,
  deleteTipo
};
