// src/api/v1/models/evaluacion/evaluacionDetalle.model.js
const { getPool } = require('../../../../db');

const EvaluacionDetalle = {
  getAllDetalles: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM EVALUACION_DETALLE');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getDetalleById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM EVALUACION_DETALLE WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createDetalle: async (detalleData) => {
    try {
      const pool = getPool();
      const { EVALUACION_ID, ASPECTO_ID, VALORACION_ID, COMENTARIO } = detalleData;
      const [result] = await pool.query(
        'INSERT INTO EVALUACION_DETALLE (EVALUACION_ID, ASPECTO_ID, VALORACION_ID, COMENTARIO) VALUES (?, ?, ?, ?)',
        [EVALUACION_ID, ASPECTO_ID, VALORACION_ID, COMENTARIO]
      );
      return { id: result.insertId, ...detalleData };
    } catch (error) {
      throw error;
    }
  },

  updateDetalle: async (id, detalleData) => {
    try {
      const pool = getPool();
      const { EVALUACION_ID, ASPECTO_ID, VALORACION_ID, COMENTARIO } = detalleData;
      await pool.query(
        'UPDATE EVALUACION_DETALLE SET EVALUACION_ID = ?, ASPECTO_ID = ?, VALORACION_ID = ?, COMENTARIO = ?, FECHA_ACTUALIZACION = CURRENT_TIMESTAMP WHERE ID = ?',
        [EVALUACION_ID, ASPECTO_ID, VALORACION_ID, COMENTARIO, id]
      );
      return { id, ...detalleData };
    } catch (error) {
      throw error;
    }
  },

  deleteDetalle: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM EVALUACION_DETALLE WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  bulkCreate: async (detalles) => {
    try {
      const pool = getPool();
      const values = detalles.map(detalle => [
        detalle.EVALUACION_ID,
        detalle.ASPECTO_ID,
        detalle.VALORACION_ID,
        detalle.COMENTARIO
      ]);

      const [result] = await pool.query(
        'INSERT INTO EVALUACION_DETALLE (EVALUACION_ID, ASPECTO_ID, VALORACION_ID, COMENTARIO) VALUES ?',
        [values]
      );

      return detalles.map((detalle, index) => ({
        id: result.insertId + index,
        ...detalle
      }));
    } catch (error) {
      throw error;
    }
  }
};

module.exports = EvaluacionDetalle;
