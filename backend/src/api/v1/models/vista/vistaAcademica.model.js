// src/api/v1/models/vistaAcademica.model.js
const { getPool } = require('../../../../db');

const VistaAcademica = {
  getAllVistaAcademica: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM VISTA_ACADEMICA');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getDocenteByDocumento: async (documentoDocente) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`
        SELECT NOMBRE_DOCENTE, NOMBRE_MATERIA 
        FROM VISTA_ACADEMICA 
        WHERE DOCUMENTO_DOCENTE = ?;
      `, [documentoDocente]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = VistaAcademica;