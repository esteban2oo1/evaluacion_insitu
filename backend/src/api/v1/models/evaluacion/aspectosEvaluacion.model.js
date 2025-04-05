const { getPool } = require('../../../../db');

const AspectosEvaluacion = {
  getAllAspectos: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, ETIQUETA, DESCRIPCION FROM ASPECTOS_EVALUACION');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getAspectoById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT ID, ETIQUETA, DESCRIPCION FROM ASPECTOS_EVALUACION WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  createAspecto: async (aspectoData) => {
    try {
      const pool = getPool();
      const { ETIQUETA, DESCRIPCION } = aspectoData;
      const [result] = await pool.query(
        'INSERT INTO ASPECTOS_EVALUACION (ETIQUETA, DESCRIPCION) VALUES (?, ?)',
        [ETIQUETA, DESCRIPCION ?? true]
      );
      return { id: result.insertId, ...aspectoData };
    } catch (error) {
      throw error;
    }
  },

  updateAspecto: async (id, aspectoData) => {
    try {
      const pool = getPool();
      const { ETIQUETA, DESCRIPCION } = aspectoData;
      await pool.query(
        'UPDATE ASPECTOS_EVALUACION SET ETIQUETA = ?, DESCRIPCION = ? WHERE ID = ?',
        [ETIQUETA, DESCRIPCION, id]
      );
      return { id, ...aspectoData };
    } catch (error) {
      throw error;
    }
  },

  deleteAspecto: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM ASPECTOS_EVALUACION WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = AspectosEvaluacion;
