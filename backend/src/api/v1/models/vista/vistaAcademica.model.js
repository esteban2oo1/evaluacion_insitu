// src/api/v1/models/vistaAcademica.model.js
const { getPool } = require('../../../../db');

const VistaAcademica = {
  getAllVistaAcademica: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM VISTA_ACADEMICA_INSITUS');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getVistaAcademicaById: async (documento, tipo) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`
        SELECT NOMBRE_DOCENTE, NOMBRE_MATERIA 
        FROM VISTA_ACADEMICA_INSITUS 
        WHERE ${tipo === 'docente' ? 'DOCUMENTO_DOCENTE' : 'DOCUMENTO_ESTUDIANTE'} = ?;
      `, [documento]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = VistaAcademica;