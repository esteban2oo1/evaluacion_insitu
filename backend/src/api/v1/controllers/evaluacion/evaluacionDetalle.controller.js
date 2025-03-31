// src/api/v1/controllers/evaluacion/evaluacionDetalle.controller.js
const EvaluacionDetalleModel = require('../../models/evaluacion/evaluacionDetalle.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const getDetalles = async (req, res, next) => {
  try {
    const detalles = await EvaluacionDetalleModel.getAllDetalles();
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: detalles });
  } catch (error) {
    next(error);
  }
};

const getDetalleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const detalle = await EvaluacionDetalleModel.getDetalleById(id);
    
    if (!detalle) {
      return errorResponse(res, { code: 404, message: MESSAGES.EVALUACION_DETALLE.NOT_FOUND });
    }
    
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: detalle });
  } catch (error) {
    next(error);
  }
};

const createDetalle = async (req, res, next) => {
  try {
    const detalleData = req.body;
    const newDetalle = await EvaluacionDetalleModel.createDetalle(detalleData);

    return successResponse(res, { code: 201, message: MESSAGES.GENERAL.CREATED, data: newDetalle });
  } catch (error) {
    next(error);
  }
};

const updateDetalle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const detalle = await EvaluacionDetalleModel.getDetalleById(id);

    if (!detalle) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const detalleData = req.body;
    const updatedDetalle = await EvaluacionDetalleModel.updateDetalle(id, detalleData);

    return successResponse(res, { message: MESSAGES.GENERAL.UPDATED, data: updatedDetalle });
  } catch (error) {
    next(error);
  }
};

const deleteDetalle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const detalle = await EvaluacionDetalleModel.getDetalleById(id);
    
    if (!detalle) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    await EvaluacionDetalleModel.deleteDetalle(id);
    return successResponse(res, { message: MESSAGES.GENERAL.DELETED });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDetalles,
  getDetalleById,
  createDetalle,
  updateDetalle,
  deleteDetalle
};
