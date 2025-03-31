// src/api/v1/models/vistaPrograma.model.js
const { getPool } = require('../../../../db');

const VistaPrograma = {
  getAllProgramas: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM VISTA_PROGRAMAS');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getProgramaById: async (codigoPrograma) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM VISTA_PROGRAMAS WHERE CODIGO_PROGRAMA = ?', [codigoPrograma]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = VistaPrograma;
