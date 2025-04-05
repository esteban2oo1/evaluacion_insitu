// src/api/v1/controllers/vistaProgramas.controller.js
const VistaProgramaModel = require('../../models/vista/vistaPrograma.model');

const getProgramas = async (req, res, next) => {
  try {
    const programas = await VistaProgramaModel.getAllProgramas();
    return res.status(200).json({ success: true, data: programas });
  } catch (error) {
    next(error);
  }
};

const getProgramaById = async (req, res, next) => {
  try {
    const { codigoPrograma } = req.params;
    const programa = await VistaProgramaModel.getProgramaById(codigoPrograma);
    
    if (!programa) {
      return res.status(404).json({ success: false, message: 'Programa not found' });
    }
    
    return res.status(200).json({ success: true, data: programa });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProgramas,
  getProgramaById
};