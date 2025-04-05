// src/api/v1/controllers/evaluacion/aspectosEvaluacion.controller.js
const AspectosEvaluacionModel = require('../../models/evaluacion/aspectosEvaluacion.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const getAspectos = async (req, res, next) => {
  try {
    const aspectos = await AspectosEvaluacionModel.getAllAspectos();
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: aspectos });
  } catch (error) {
    next(error);
  }
};

const getAspectoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aspecto = await AspectosEvaluacionModel.getAspectoById(id);
    
    if (!aspecto) {
      return errorResponse(res, { code: 404, message: MESSAGES.ASPECTOS.NOT_FOUND });
    }
    
    return successResponse(res, { message: MESSAGES.GENERAL.FETCH_SUCCESS, data: aspecto });
  } catch (error) {
    next(error);
  }
};

const createAspecto = async (req, res, next) => {
  try {
    const aspectoData = req.body;
    const newAspecto = await AspectosEvaluacionModel.createAspecto(aspectoData);

    return successResponse(res, { code: 201, message: MESSAGES.GENERAL.CREATED, data: newAspecto });
  } catch (error) {
    next(error);
  }
};

const updateAspecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aspecto = await AspectosEvaluacionModel.getAspectoById(id);

    if (!aspecto) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    const aspectoData = req.body;
    const updatedAspecto = await AspectosEvaluacionModel.updateAspecto(id, aspectoData);

    return successResponse(res, { message: MESSAGES.GENERAL.UPDATED, data: updatedAspecto });
  } catch (error) {
    next(error);
  }
};

const deleteAspecto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aspecto = await AspectosEvaluacionModel.getAspectoById(id);
    
    if (!aspecto) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }

    await AspectosEvaluacionModel.deleteAspecto(id);
    return successResponse(res, { message: MESSAGES.GENERAL.DELETED });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAspectos,
  getAspectoById,
  createAspecto,
  updateAspecto,
  deleteAspecto
};
