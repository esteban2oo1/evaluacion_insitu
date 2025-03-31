// src/api/v1/controllers/vistaEstudiante.controller.js
const VistaEstudianteModel = require('../../models/vista/vistaEstudiante.model');

const getEstudiantes = async (req, res, next) => {
  try {
    const estudiantes = await VistaEstudianteModel.getAllEstudiantes();
    return res.status(200).json({ success: true, data: estudiantes });
  } catch (error) {
    next(error);
  }
};

const getEstudianteById = async (req, res, next) => {
  try {
    const { documentoEstudiante } = req.params;
    const estudiante = await VistaEstudianteModel.getEstudianteById(documentoEstudiante);
    
    if (!estudiante) {
      return res.status(404).json({ success: false, message: 'Estudiante not found' });
    }
    
    return res.status(200).json({ success: true, data: estudiante });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEstudiantes,
  getEstudianteById
};