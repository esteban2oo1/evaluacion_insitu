// src/api/v1/models/configuracionEvaluacion.model.js
const { getPool } = require('../../../../db');

const ConfiguracionEvaluacion = {
  getAllConfiguraciones: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`SELECT 
        CE.ID, 
        CE.TIPO_EVALUACION_ID, 
        TE.NOMBRE as TIPO_EVALUACION_NOMBRE,
        TE.DESCRIPCION as TIPO_EVALUACION_DESCRIPCION,
        CE.FECHA_INICIO, 
        CE.FECHA_FIN, 
        CE.ACTIVO 
      FROM CONFIGURACION_EVALUACION CE
      JOIN TIPOS_EVALUACIONES TE ON CE.TIPO_EVALUACION_ID = TE.ID
    `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getConfiguracionById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`SELECT 
        CE.ID, 
        CE.TIPO_EVALUACION_ID, 
        TE.NOMBRE as TIPO_EVALUACION_NOMBRE,
        TE.DESCRIPCION as TIPO_EVALUACION_DESCRIPCION,
        CE.FECHA_INICIO, 
        CE.FECHA_FIN, 
        CE.ACTIVO 
      FROM CONFIGURACION_EVALUACION CE
      JOIN TIPOS_EVALUACIONES TE ON CE.TIPO_EVALUACION_ID = TE.ID
      WHERE CE.ID = ?`, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createConfiguracion: async (configuracionData) => {
    try {
      const pool = getPool();
      const { TIPO_EVALUACION_ID, FECHA_INICIO, FECHA_FIN, ACTIVO } = configuracionData;
      const [result] = await pool.query(
        'INSERT INTO CONFIGURACION_EVALUACION (TIPO_EVALUACION_ID, FECHA_INICIO, FECHA_FIN, ACTIVO) VALUES (?, ?, ?, ?)',
        [TIPO_EVALUACION_ID, FECHA_INICIO, FECHA_FIN, ACTIVO]
      );
      return { id: result.insertId, ...configuracionData };
    } catch (error) {
      throw error;
    }
  },

  updateConfiguracion: async (id, configuracionData) => {
    try {
      const pool = getPool();
      const { TIPO_EVALUACION_ID, FECHA_INICIO, FECHA_FIN, ACTIVO } = configuracionData;
      await pool.query(
        'UPDATE CONFIGURACION_EVALUACION SET TIPO_EVALUACION_ID = ?, FECHA_INICIO = ?, FECHA_FIN = ?, ACTIVO = ? WHERE ID = ?',
        [TIPO_EVALUACION_ID, FECHA_INICIO, FECHA_FIN, ACTIVO, id]
      );
      return { id, ...configuracionData };
    } catch (error) {
      throw error;
    }
  },

  deleteConfiguracion: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM CONFIGURACION_EVALUACION WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ConfiguracionEvaluacion;