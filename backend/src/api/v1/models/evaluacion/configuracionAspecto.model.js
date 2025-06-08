// src/models/evaluacion/configuracionAspecto.model.js
const { getPool } = require('../../../../db');

const ConfiguracionAspecto = {
  getAllConfiguracionesAspecto: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT ID, CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO FROM CONFIGURACION_ASPECTO'
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getConfiguracionAspectoById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT ID, CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO FROM CONFIGURACION_ASPECTO WHERE ID = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createConfiguracionAspecto: async (configuracionAspectoData) => {
    try {
      const pool = getPool();
      const { CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO } = configuracionAspectoData;
      const [result] = await pool.query(
        'INSERT INTO CONFIGURACION_ASPECTO (CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO) VALUES (?, ?, ?, ?)',
        [CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO ?? true]
      );
      return { id: result.insertId, ...configuracionAspectoData };
    } catch (error) {
      throw error;
    }
  },

  updateConfiguracionAspecto: async (id, configuracionAspectoData) => {
    try {
      const pool = getPool();
      const { CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO } = configuracionAspectoData;
      await pool.query(
        'UPDATE CONFIGURACION_ASPECTO SET CONFIGURACION_EVALUACION_ID = ?, ASPECTO_ID = ?, ORDEN = ?, ACTIVO = ? WHERE ID = ?',
        [CONFIGURACION_EVALUACION_ID, ASPECTO_ID, ORDEN, ACTIVO, id]
      );
      return { id, ...configuracionAspectoData };
    } catch (error) {
      throw error;
    }
  },

  deleteConfiguracionAspecto: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM CONFIGURACION_ASPECTO WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  updateEstado: async (id, activo) => {
    try {
      const pool = getPool();
      await pool.query(
        'UPDATE CONFIGURACION_ASPECTO SET ACTIVO = ? WHERE ID = ?',
        [activo, id]
      );
      return { id, activo };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ConfiguracionAspecto;
