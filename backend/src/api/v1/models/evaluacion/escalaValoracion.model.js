// src/api/v1/models/escalaValoracion.model.js
const { getPool } = require('../../../../db');

const EscalaValoracion = {
  getAllEscalas: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, VALOR, ETIQUETA, DESCRIPCION FROM ESCALA_VALORACION');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getEscalaById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, VALOR, ETIQUETA, DESCRIPCION FROM ESCALA_VALORACION WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createEscala: async (escalaData) => {
    try {
      const pool = getPool();
      const { VALOR, ETIQUETA, DESCRIPCION } = escalaData;
      const [result] = await pool.query(
        'INSERT INTO ESCALA_VALORACION (VALOR, ETIQUETA, DESCRIPCION) VALUES (?, ?,?)',
        [VALOR, ETIQUETA, DESCRIPCION]
      );
      return { id: result.insertId, ...escalaData };
    } catch (error) {
      throw error;
    }
  },

  updateEscala: async (id, escalaData) => {
    try {
      const pool = getPool();
      const { VALOR, ETIQUETA, DESCRIPCION } = escalaData;
      await pool.query(
        'UPDATE ESCALA_VALORACION SET VALOR = ?, ETIQUETA = ?, DESCRIPCION = ? WHERE ID = ?',
        [VALOR, ETIQUETA, DESCRIPCION, id]
      );
      return { id, ...escalaData };
    } catch (error) {
      throw error;
    }
  },

  deleteEscala: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM ESCALA_VALORACION WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = EscalaValoracion;