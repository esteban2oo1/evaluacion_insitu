// src/api/v1/models/evaluacion/configuracionValoracion.model.js
const { getPool } = require('../../../../db');

const ConfiguracionValoracion = {
  getAllConfiguraciones: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM CONFIGURACION_VALORACION WHERE ACTIVO = TRUE ORDER BY ORDEN');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getConfiguracionById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM CONFIGURACION_VALORACION WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createConfiguracion: async (configuracionData) => {
    try {
      const pool = getPool();
      const { CONFIGURACION_EVALUACION_ID, VALORACION_ID, PUNTAJE, ORDEN, ACTIVO } = configuracionData;
      const [result] = await pool.query(
        'INSERT INTO CONFIGURACION_VALORACION (CONFIGURACION_EVALUACION_ID, VALORACION_ID, PUNTAJE, ORDEN, ACTIVO) VALUES (?, ?, ?, ?, ?)',
        [CONFIGURACION_EVALUACION_ID, VALORACION_ID, PUNTAJE, ORDEN, ACTIVO ?? true]
      );
      return { id: result.insertId, ...configuracionData };
    } catch (error) {
      throw error;
    }
  },

  updateConfiguracion: async (id, configuracionData) => {
    try {
      const pool = getPool();
      const { CONFIGURACION_EVALUACION_ID, VALORACION_ID, PUNTAJE, ORDEN, ACTIVO } = configuracionData;
      await pool.query(
        'UPDATE CONFIGURACION_VALORACION SET CONFIGURACION_EVALUACION_ID = ?, VALORACION_ID = ?, PUNTAJE = ?, ORDEN = ?, ACTIVO = ? WHERE ID = ?',
        [CONFIGURACION_EVALUACION_ID, VALORACION_ID, PUNTAJE, ORDEN, ACTIVO, id]
      );
      return { id, ...configuracionData };
    } catch (error) {
      throw error;
    }
  },

  deleteConfiguracion: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM CONFIGURACION_VALORACION WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = ConfiguracionValoracion;
