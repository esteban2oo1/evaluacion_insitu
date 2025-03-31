// src/api/v1/controllers/vistaAcademica.controller.js
const VistaAcademicaModel = require('../../models/vista/vistaAcademica.model');

const getVistaAcademica = async (req, res, next) => {
  try {
    const vistaAcademica = await VistaAcademicaModel.getAllVistaAcademica();
    return res.status(200).json({ success: true, data: vistaAcademica });
  } catch (error) {
    next(error);
  }
};

const getVistaAcademicaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vistaAcademica = await VistaAcademicaModel.getVistaAcademicaById(id);
    
    if (!vistaAcademica) {
      return res.status(404).json({ success: false, message: 'Vista Academica not found' });
    }
    
    return res.status(200).json({ success: true, data: vistaAcademica });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVistaAcademica,
  getVistaAcademicaById
};
