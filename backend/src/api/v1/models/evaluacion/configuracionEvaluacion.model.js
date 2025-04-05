// src/api/v1/models/configuracionEvaluacion.model.js
const { getPool } = require('../../../../db');

const ConfiguracionEvaluacion = {
  getAllConfiguraciones: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`SELECT 
        CE.ID, 
        CE.TIPO_ENCUESTA_ID, 
        TIPO_ENCUESTA.NOMBRE AS NOMBRE_TIPO_ENCUESTA, 
        CE.FECHA_INICIO, 
        CE.FECHA_FIN, 
        CE.ACTIVO 
      FROM CE CONFIGURACION_EVALUACION
      JOIN TIPOS_ENCUESTA TE ON CONFIGURACION_EVALUACION.TIPO_ENCUESTA_ID = TIPO_ENCUESTA.ID
    `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getConfiguracionById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, TIPO_ENCUESTA_ID, FECHA_INICIO, FECHA_FIN, ACTIVO FROM CE WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createConfiguracion: async (configuracionData) => {
    try {
      const pool = getPool();
      const { TIPO_ENCUESTA_ID, FECHA_INICIO, FECHA_FIN, ACTIVO } = configuracionData;
      const [result] = await pool.query(
        'INSERT INTO CE (TIPO_ENCUESTA_ID, FECHA_INICIO, FECHA_FIN, ACTIVO) VALUES (?, ?, ?, ?)',
        [TIPO_ENCUESTA_ID, FECHA_INICIO, FECHA_FIN, ACTIVO]
      );
      return { id: result.insertId, ...configuracionData };
    } catch (error) {
      throw error;
    }
  },

  updateConfiguracion: async (id, configuracionData) => {
    try {
      const pool = getPool();
      const { FECHA_INICIO, FECHA_FIN, ACTIVO } = configuracionData;
      await pool.query(
        'UPDATE CE SET TIPO_ENCUESTA_ID = ?, FECHA_INICIO = ?, FECHA_FIN = ?, ACTIVO = ? WHERE ID = ?',
        [FECHA_INICIO, FECHA_FIN, ACTIVO, id]
      );
      return { id, ...configuracionData };
    } catch (error) {
      throw error;
    }
  },

  deleteConfiguracion: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM CE WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ConfiguracionEvaluacion;