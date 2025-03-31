// src/api/v1/models/escalaValoracion.model.js
const { getPool } = require('../../../../db');

const EscalaValoracion = {
  getAllEscalas: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO FROM ESCALA_VALORACION ORDER BY ORDEN');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getEscalaById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO FROM ESCALA_VALORACION WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createEscala: async (escalaData) => {
    try {
      const pool = getPool();
      const { VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO } = escalaData;
      const [result] = await pool.query(
        'INSERT INTO ESCALA_VALORACION (VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO) VALUES (?, ?, ?, ?, ?, ?)',
        [VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO ?? true]
      );
      return { id: result.insertId, ...escalaData };
    } catch (error) {
      throw error;
    }
  },

  updateEscala: async (id, escalaData) => {
    try {
      const pool = getPool();
      const { VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO } = escalaData;
      await pool.query(
        'UPDATE ESCALA_VALORACION SET VALOR = ?, ETIQUETA = ?, DESCRIPCION = ?, PUNTAJE = ?, ORDEN = ?, ACTIVO = ? WHERE ID = ?',
        [VALOR, ETIQUETA, DESCRIPCION, PUNTAJE, ORDEN, ACTIVO, id]
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