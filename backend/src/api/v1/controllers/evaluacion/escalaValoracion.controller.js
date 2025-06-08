// src/api/v1/controllers/evaluacion/escalaValoracion.controller.js
const EscalaValoracionModel = require('../../models/evaluacion/escalaValoracion.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

const getEscalas = async (req, res, next) => {
  try {
    const escalas = await EscalaValoracionModel.getAllEscalas();
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.FETCH_SUCCESS, 
      data: escalas 
    });
  } catch (error) {
    next(error);
  }
};

const getEscalaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const escala = await EscalaValoracionModel.getEscalaById(id);
    
    if (!escala) {
      return errorResponse(res, { 
        code: 404, 
        message: MESSAGES.GENERAL.NOT_FOUND 
      });
    }
    
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.FETCH_SUCCESS, 
      data: escala 
    });
  } catch (error) {
    next(error);
  }
};

const createEscala = async (req, res, next) => {
  try {
    const escalaData = req.body;

    const newEscala = await EscalaValoracionModel.createEscala(escalaData);
    return successResponse(res, { 
      code: 201, 
      message: MESSAGES.GENERAL.CREATED, 
      data: newEscala 
    });
  } catch (error) {
    next(error);
  }
};

const updateEscala = async (req, res, next) => {
  try {
    const { id } = req.params;
    const escalaData = req.body;
    
    const escala = await EscalaValoracionModel.getEscalaById(id);
    if (!escala) {
      return errorResponse(res, { 
        code: 404, 
        message: MESSAGES.GENERAL.NOT_FOUND 
      });
    }

    const updatedEscala = await EscalaValoracionModel.updateEscala(id, escalaData);
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.UPDATED, 
      data: updatedEscala 
    });
  } catch (error) {
    next(error);
  }
};

const deleteEscala = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const escala = await EscalaValoracionModel.getEscalaById(id);
    if (!escala) {
      return errorResponse(res, { 
        code: 404, 
        message: MESSAGES.GENERAL.NOT_FOUND 
      });
    }
    
    await EscalaValoracionModel.deleteEscala(id);
    return successResponse(res, { 
      code: 200, 
      message: MESSAGES.GENERAL.DELETED 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEscalas,
  getEscalaById,
  createEscala,
  updateEscala,
  deleteEscala
};
