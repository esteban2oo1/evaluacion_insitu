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
    const { id } = req.params; // El 'id' es el documento que se busca
    const vistaAcademica = await VistaAcademicaModel.getVistaAcademicaById(id);
    
    // Si no se encuentra ninguna vista académica, responder con 404
    if (!vistaAcademica || vistaAcademica.length === 0) {
      return res.status(404).json({ success: false, message: 'Vista Académica no encontrada' });
    }
    
    // Si se encuentra la vista académica, responder con 200 y los datos
    return res.status(200).json({ success: true, data: vistaAcademica });
  } catch (error) {
    next(error);
  }
};

const getPeriodos = async (req, res, next) => {
  try {
    const periodos = await VistaAcademicaModel.getPeriodos();
    return res.status(200).json({ success: true, data: periodos });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al obtener los periodos', error: err.message });
  }
};

const getSedes = async (req, res, next) => {
  try {
    const sedes = await VistaAcademicaModel.getSedes();
    return res.status(200).json({ success: true, data: sedes });  
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al obtener las sedes', error: err.message });
  }
};

const getProgramas = async (req, res, next) => {
  try {
    const programas = await VistaAcademicaModel.getProgramas();
    return res.status(200).json({ success: true, data: programas }); 
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al obtener los programas', error: err.message });
  }
};

const getSemestres = async (req, res, next) => {
  try {
    const semestres = await VistaAcademicaModel.getSemestres();
    return res.status(200).json({ success: true, data: semestres });  
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al obtener los semestres', error: err.message });
  }
};

const getGrupos = async (req, res, next) => {
  try {
    const grupos = await VistaAcademicaModel.getGrupos();
    return res.status(200).json({ success: true, data: grupos }); 
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error al obtener los grupos', error: err.message });
  }
};

module.exports = {
  getVistaAcademica,
  getVistaAcademicaById,
  getPeriodos,
  getSedes,
  getProgramas,
  getSemestres,
  getGrupos
};
