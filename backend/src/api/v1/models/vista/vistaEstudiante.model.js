// src/api/v1/models/vistaEstudiante.model.js
const { getPool } = require('../../../../db');

const VistaEstudiante = {
  getAllEstudiantes: async () => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM VISTA_ESTUDIANTE');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getEstudianteById: async (documentoEstudiante) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query(`
        SELECT 
          SEMESTRE_MATRICULA,
          SEDE,
          CODIGO_ESTUDIANTE,
          COD_PROGRAMA,
          DOBLE_PROGRAMA,
          SEMESTRE_INGRESO,
          PERIODO_INGRESO,
          SEMESTRE_CREDITOS,
          PRIMER_APELLIDO,
          SEGUNDO_APELLIDO,
          PRIMER_NOMBRE,
          SEGUNDO_NOMBRE,
          TIPO_DOC,
          DOCUMENTO_ESTUDIANTE,
          FECHA_NACIMIENTO,
          SEXO,
          TELEFONO,
          CELULAR,
          EMAIL_PNAL,
          EMAIL_IES,
          DIRECCION,
          ESTADO_CIVIL,
          JORNADA,
          PERSONA_CONTACTO,
          NUMERO_CONTACTO,
          ESTADO_MATRICULA,
          ESTADO_ACADEMICO,
          PROMEDIO_ACUMULADO,
          CREDITOS_CURSADOS,
          CREDITOS_PROGRAMA
        FROM VISTA_ESTUDIANTE
        WHERE DOCUMENTO_ESTUDIANTE = ?;
      `, [documentoEstudiante]);
  
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  getEstudianteByDocumento: async (documentoEstudiante) => {
    try {
      const pool = getPool();
      const query = `
      SELECT
        SEMESTRE,
        ASIGNATURA,
        COD_ASIGNATURA,
        DOCENTE,
        NOM_PROGRAMA,
        ID_DOCENTE,
        CONCAT(
          PRIMER_NOMBRE,
          IF(SEGUNDO_NOMBRE IS NOT NULL AND SEGUNDO_NOMBRE != '', CONCAT(' ', SEGUNDO_NOMBRE), ''),
          ' ',
          PRIMER_APELLIDO,
          IF(SEGUNDO_APELLIDO IS NOT NULL AND SEGUNDO_APELLIDO != '', CONCAT(' ', SEGUNDO_APELLIDO), '')
        ) AS NOMBRE_ESTUDIANTE
      FROM
        vista_academica_insitus
      WHERE
        ID_ESTUDIANTE = ?
      `;
      
      const [rows] = await pool.query(query, [documentoEstudiante]);
  
      return rows; // Retorna los resultados de la consulta
    } catch (error) {
      throw error; // Lanzar el error para manejarlo en el controlador
    }
  }
};

module.exports = VistaEstudiante;