const { getPool } = require('../../../../db');

const Evaluaciones = {

  findOne: async (configuracionId, documentoEstudiante, codigoMateria) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM EVALUACIONES WHERE ID_CONFIGURACION = ? AND DOCUMENTO_ESTUDIANTE = ? AND CODIGO_MATERIA = ?', 
            [configuracionId, documentoEstudiante, codigoMateria]
        );
        return rows;
    } catch (error) {
        throw error;
    }
  },

  getAllEvaluaciones: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM EVALUACIONES');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getEvaluacionById: async (id) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM EVALUACIONES WHERE ID = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getEvaluacionesByEstudiante: async (documentoEstudiante) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM EVALUACIONES WHERE DOCUMENTO_ESTUDIANTE = ?', [documentoEstudiante]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getEvaluacionesByDocente: async (documentoDocente) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM EVALUACIONES WHERE DOCUMENTO_DOCENTE = ?', [documentoDocente]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  createEvaluacion: async (evaluacionData) => {
    try {
      const pool = getPool();
      const { DOCUMENTO_ESTUDIANTE, DOCUMENTO_DOCENTE, CODIGO_MATERIA, COMENTARIO_GENERAL, ID_CONFIGURACION, } = evaluacionData;
      
      const [result] = await pool.query(
        'INSERT INTO EVALUACIONES (DOCUMENTO_ESTUDIANTE, DOCUMENTO_DOCENTE, CODIGO_MATERIA, COMENTARIO_GENERAL, ID_CONFIGURACION) VALUES (?, ?, ?, ?, ?)',
        [DOCUMENTO_ESTUDIANTE, DOCUMENTO_DOCENTE, CODIGO_MATERIA, COMENTARIO_GENERAL, ID_CONFIGURACION]
      );
      
      return { id: result.insertId, ...evaluacionData };
    } catch (error) {
      throw error;
    }
  },

  updateEvaluacion: async (id, evaluacionData) => {
    try {
      const pool = getPool();
      const { DOCUMENTO_ESTUDIANTE, DOCUMENTO_DOCENTE, CODIGO_MATERIA, COMENTARIO_GENERAL, ID_CONFIGURACION } = evaluacionData;
      
      await pool.query(
        'UPDATE EVALUACIONES SET DOCUMENTO_ESTUDIANTE = ?, DOCUMENTO_DOCENTE = ?, CODIGO_MATERIA = ?, COMENTARIO_GENERAL = ?, ID_CONFIGURACION = ? WHERE ID = ?',
        [DOCUMENTO_ESTUDIANTE, DOCUMENTO_DOCENTE, CODIGO_MATERIA, COMENTARIO_GENERAL, ID_CONFIGURACION, id]
      );
      
      return { id, ...evaluacionData };
    } catch (error) {
      throw error;
    }
  },

  deleteEvaluacion: async (id) => {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM EVALUACIONES WHERE ID = ?', [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Evaluaciones;
