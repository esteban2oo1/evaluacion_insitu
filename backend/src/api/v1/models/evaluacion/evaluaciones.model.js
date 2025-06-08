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
      const query = `
        WITH SEMESTRE_PREDOMINANTE AS (
            SELECT 
                COD_ASIGNATURA,
                ID_DOCENTE,
                SEMESTRE AS SEMESTRE_PREDOMINANTE,
                ROW_NUMBER() OVER (PARTITION BY COD_ASIGNATURA, ID_DOCENTE ORDER BY COUNT(*) DESC) AS rn
            FROM vista_academica_insitus
            GROUP BY COD_ASIGNATURA, ID_DOCENTE, SEMESTRE
        ),
        PROGRAMA_PREDOMINANTE AS (
            SELECT 
                COD_ASIGNATURA,
                ID_DOCENTE,
                NOM_PROGRAMA AS PROGRAMA_PREDOMINANTE,
                ROW_NUMBER() OVER (PARTITION BY COD_ASIGNATURA, ID_DOCENTE ORDER BY COUNT(*) DESC) AS rn
            FROM vista_academica_insitus
            GROUP BY COD_ASIGNATURA, ID_DOCENTE, NOM_PROGRAMA
        )
  
        SELECT DISTINCT
            e.ID,
            e.DOCUMENTO_ESTUDIANTE,
            e.DOCUMENTO_DOCENTE,
            vai.DOCENTE,
            vai.ASIGNATURA,
            e.CODIGO_MATERIA,
            e.ID_CONFIGURACION,
            sp.SEMESTRE_PREDOMINANTE,
            pp.PROGRAMA_PREDOMINANTE
        FROM EVALUACIONES e
        LEFT JOIN vista_academica_insitus vai 
            ON e.DOCUMENTO_DOCENTE = vai.ID_DOCENTE AND e.CODIGO_MATERIA = vai.COD_ASIGNATURA
        LEFT JOIN SEMESTRE_PREDOMINANTE sp 
            ON e.CODIGO_MATERIA = sp.COD_ASIGNATURA AND e.DOCUMENTO_DOCENTE = sp.ID_DOCENTE AND sp.rn = 1
        LEFT JOIN PROGRAMA_PREDOMINANTE pp 
            ON e.CODIGO_MATERIA = pp.COD_ASIGNATURA AND e.DOCUMENTO_DOCENTE = pp.ID_DOCENTE AND pp.rn = 1
        WHERE e.DOCUMENTO_ESTUDIANTE = ?
      `;
      
      const [rows] = await pool.query(query, [documentoEstudiante]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getEvaluacionesByEstudianteByConfiguracion: async (documentoEstudiante, configuracionId) => {
    try {
      const pool = getPool();
      const query = `
        WITH SEMESTRE_PREDOMINANTE AS (
            SELECT 
                COD_ASIGNATURA,
                ID_DOCENTE,
                SEMESTRE AS SEMESTRE_PREDOMINANTE,
                ROW_NUMBER() OVER (PARTITION BY COD_ASIGNATURA, ID_DOCENTE ORDER BY COUNT(*) DESC) AS rn
            FROM vista_academica_insitus
            GROUP BY COD_ASIGNATURA, ID_DOCENTE, SEMESTRE
        ),
        PROGRAMA_PREDOMINANTE AS (
            SELECT 
                COD_ASIGNATURA,
                ID_DOCENTE,
                NOM_PROGRAMA AS PROGRAMA_PREDOMINANTE,
                ROW_NUMBER() OVER (PARTITION BY COD_ASIGNATURA, ID_DOCENTE ORDER BY COUNT(*) DESC) AS rn
            FROM vista_academica_insitus
            GROUP BY COD_ASIGNATURA, ID_DOCENTE, NOM_PROGRAMA
        )
    
        SELECT DISTINCT
            e.ID,
            e.DOCUMENTO_ESTUDIANTE,
            e.DOCUMENTO_DOCENTE,
            vai.DOCENTE,
            vai.ASIGNATURA,
            e.CODIGO_MATERIA,
            e.ID_CONFIGURACION,
            sp.SEMESTRE_PREDOMINANTE,
            pp.PROGRAMA_PREDOMINANTE,
            CASE 
                WHEN ed.ID IS NOT NULL THEN 1 
                ELSE 0 
            END AS ACTIVO
        FROM EVALUACIONES e
        LEFT JOIN vista_academica_insitus vai 
            ON e.DOCUMENTO_DOCENTE = vai.ID_DOCENTE AND e.CODIGO_MATERIA = vai.COD_ASIGNATURA
        LEFT JOIN SEMESTRE_PREDOMINANTE sp 
            ON e.CODIGO_MATERIA = sp.COD_ASIGNATURA AND e.DOCUMENTO_DOCENTE = sp.ID_DOCENTE AND sp.rn = 1
        LEFT JOIN PROGRAMA_PREDOMINANTE pp 
            ON e.CODIGO_MATERIA = pp.COD_ASIGNATURA AND e.DOCUMENTO_DOCENTE = pp.ID_DOCENTE AND pp.rn = 1
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        WHERE e.DOCUMENTO_ESTUDIANTE = ? AND e.ID_CONFIGURACION = ?;
      `;
      
      const [rows] = await pool.query(query, [documentoEstudiante, configuracionId]);
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
