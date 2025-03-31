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

  getEstudianteByDocumento: async (documentoEstudiante) => {
    try {
      const pool = getPool();
      const query = `
      SELECT
        VA.SEMESTRE_MATRICULA,
        VA.NOMBRE_MATERIA,
        VA.CODIGO_MATERIA,
        VA.NOMBRE_DOCENTE,
        VP.NOMBRE_PROGRAMA,
        VA.DOCUMENTO_DOCENTE,
        CONCAT(
          VE.PRIMER_NOMBRE,
          IF(VE.SEGUNDO_NOMBRE IS NOT NULL AND VE.SEGUNDO_NOMBRE != '', CONCAT(' ', VE.SEGUNDO_NOMBRE), ''),
          ' ',
          VE.PRIMER_APELLIDO,
          IF(VE.SEGUNDO_APELLIDO IS NOT NULL AND VE.SEGUNDO_APELLIDO != '', CONCAT(' ', VE.SEGUNDO_APELLIDO), '')
        ) AS NOMBRE_ESTUDIANTE,
        VE.ESTADO_MATRICULA
      FROM
        VISTA_ACADEMICA VA
      INNER JOIN
        VISTA_ESTUDIANTE VE ON VA.DOCUMENTO_ESTUDIANTE = VE.DOCUMENTO_ESTUDIANTE
      INNER JOIN
        VISTA_PROGRAMAS VP ON VE.COD_PROGRAMA = VP.CODIGO_PROGRAMA 
      WHERE
        VA.DOCUMENTO_ESTUDIANTE = ?
      `;
      
      const [rows] = await pool.query(query, [documentoEstudiante]);
  
      return rows; // Retorna los resultados de la consulta
    } catch (error) {
      throw error; // Lanzar el error para manejarlo en el controlador
    }
  }


};

module.exports = VistaEstudiante;