const { getRemotePool } = require('../../../../db');

const VistaAcademica = {
  getAllVistaAcademica: async () => {
    try {
      const pool = getRemotePool();
      const [rows] = await pool.query('SELECT * FROM vista_academica_insitus');
      return rows;
    } catch (error) {
      console.error(`Error al obtener todos los registros: ${error.message}`);
      throw error;
    }
  },

  getVistaAcademicaById: async (documento) => {
    try {
      const pool = getRemotePool();
      if (!documento) {
        throw new Error('El documento del estudiante o docente es requerido');
      }

      // Intentar buscar en ID_ESTUDIANTE
      let query = `
        SELECT 
          PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, 
          ASIGNATURA, COD_ASIGNATURA, SEMESTRE, GRUPO, 
          DOCENTE, NOMBRE_SEDE, PERIODO, NOTA_FINAL 
        FROM vista_academica_insitus 
        WHERE ID_ESTUDIANTE = ?;
      `;
      let [rows] = await pool.query(query, [documento]);

      // Si no se encontró en ID_ESTUDIANTE, buscar en ID_DOCENTE
      if (rows.length === 0) {
        query = `
          SELECT 
            PRIMER_NOMBRE, SEGUNDO_NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, 
            ASIGNATURA, COD_ASIGNATURA, SEMESTRE, GRUPO, 
            DOCENTE, NOMBRE_SEDE, PERIODO, NOTA_FINAL 
          FROM vista_academica_insitus 
          WHERE ID_DOCENTE = ?;
        `;
        [rows] = await pool.query(query, [documento]);
      }

      return rows;
    } catch (error) {
      console.error(`Error en la consulta de VistaAcademicaById: ${error.message}`);
      throw error;
    }
  },

  getPeriodos: async () => {
    try {
      const pool = getRemotePool();
      const [rows] = await pool.query('SELECT DISTINCT PERIODO FROM vista_academica_insitus');
      return rows;
    } catch (error) {
      console.error(`Error al obtener periodos: ${error.message}`);
      throw error;
    }
  },

  getSedes: async () => {
    try {
      const pool = getRemotePool();
      const [rows] = await pool.query('SELECT DISTINCT NOMBRE_SEDE FROM vista_academica_insitus');
      return rows;
    } catch (error) {
      console.error(`Error al obtener sedes: ${error.message}`);
      throw error;
    }
  },

  getProgramas: async () => {
    try {
      const pool = getRemotePool();
      const [rows] = await pool.query('SELECT DISTINCT NOM_PROGRAMA FROM vista_academica_insitus');
      return rows;
    } catch (error) {
      console.error(`Error al obtener programas: ${error.message}`);
      throw error;
    }
  },
  
  getSemestres: async () => {
    try {
      const pool = getRemotePool();
      const [rows] = await pool.query('SELECT DISTINCT SEMESTRE FROM vista_academica_insitus');
      return rows;
    } catch (error) {
      console.error(`Error al obtener semestres: ${error.message}`);
      throw error;
    }
  },

  getGrupos: async () => {
    try {
      const pool = getRemotePool();
      const [rows] = await pool.query('SELECT DISTINCT GRUPO FROM vista_academica_insitus');
      return rows;
    } catch (error) {
      console.error(`Error al obtener grupos: ${error.message}`);
      throw error;
    }
  }
};

module.exports = VistaAcademica;
