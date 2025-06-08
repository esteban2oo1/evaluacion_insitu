const { getPool } = require("../../../../db");

const VistaProfileModel = {

  // INFORMACION DE ESTUDIANTE

  async getEstudianteInfo(documento) {
    const pool = await getPool();
    const [estudianteInfo] = await pool.query(
      `SELECT 
          e.SEDE,
          dl.user_name,
          e.TIPO_DOC,
          e.DOCUMENTO_ESTUDIANTE,
          e.ESTADO_MATRICULA,
          p.NOM_PROGRAMA,
          e.SEMESTRE_MATRICULA,
          p.SEMESTRE,
          p.GRUPO,
          dl.user_idrole,
          dl.role_name AS ROL_PRINCIPAL,
          r.ID AS ID_ROL_ADICIONAL,
          r.NOMBRE_ROL AS ROL_ADICIONAL
      FROM VISTA_ESTUDIANTE e
      JOIN VISTA_ACADEMICA_INSITUS p 
          ON e.DOCUMENTO_ESTUDIANTE = p.ID_ESTUDIANTE
      JOIN DATALOGIN dl 
          ON dl.user_username = e.DOCUMENTO_ESTUDIANTE
      LEFT JOIN users_roles ur 
          ON ur.user_id = dl.user_id
      LEFT JOIN roles r 
          ON ur.rol_id = r.ID
      WHERE e.DOCUMENTO_ESTUDIANTE = ?
        AND (r.NOMBRE_ROL IS NULL OR r.NOMBRE_ROL != dl.role_name)
      GROUP BY 
          e.SEMESTRE_MATRICULA,
          e.SEDE,
          e.TIPO_DOC,
          e.DOCUMENTO_ESTUDIANTE,
          e.ESTADO_MATRICULA,
          p.NOM_PROGRAMA,
          p.SEMESTRE,
          p.GRUPO,
          dl.user_name,
          dl.user_idrole,
          dl.role_name,
          r.ID,
          r.NOMBRE_ROL;`,
      [documento]
    );
    console.log(estudianteInfo);
    return estudianteInfo;
  },

  // MATERIAS DE ESTUDIANTE

  async getMateriasEstudiante(documento) {
    const pool = await getPool();
    const [materias] = await pool.query(
      `SELECT DISTINCT 
         ai.COD_ASIGNATURA as CODIGO_MATERIA,
         ai.ASIGNATURA as NOMBRE_MATERIA,
         ai.ID_DOCENTE as DOCUMENTO_DOCENTE,
         ai.DOCENTE as NOMBRE_DOCENTE
       FROM VISTA_ACADEMICA_INSITUS ai
       WHERE ai.ID_ESTUDIANTE = ?`,
      [documento]
    );
    return materias;
  },

  // INFORMACION DE DOCENTE

  async getDocenteInfo(documento) {
    const pool = await getPool();
    const [docenteInfo] = await pool.query(
      `SELECT DISTINCT
         ai.ID_DOCENTE AS DOCUMENTO_DOCENTE,
         ai.DOCENTE AS NOMBRE_DOCENTE,
         ai.NOMBRE_SEDE AS SEDE,
         ai.PERIODO,
         dl.user_idrole,
         dl.role_name AS ROL_PRINCIPAL,
         r.ID AS ID_ROL_ADICIONAL,
         r.NOMBRE_ROL AS ROL_ADICIONAL
       FROM VISTA_ACADEMICA_INSITUS ai
       JOIN DATALOGIN dl ON dl.user_username = ai.ID_DOCENTE
       LEFT JOIN users_roles ur ON ur.user_id = dl.user_id
       LEFT JOIN roles r ON ur.rol_id = r.ID
       WHERE ai.ID_DOCENTE = ?
       GROUP BY 
          ai.ID_DOCENTE,
          ai.DOCENTE,
          ai.NOMBRE_SEDE,
          ai.PERIODO,
          dl.user_idrole,
          dl.role_name,
          r.ID,
          r.NOMBRE_ROL;`,
      [documento]
    );
    return docenteInfo;
  },

  // MATERIAS DE DOCENTE

  async getMateriasDocente(documento) {
    const pool = await getPool();
    const [materias] = await pool.query(
      `WITH ASIGNATURA_SEMESTRES AS (
          SELECT 
              COD_ASIGNATURA,
              ASIGNATURA,
              ID_DOCENTE,
              SEMESTRE,
              COUNT(*) AS TOTAL_ESTUDIANTES
          FROM vista_academica_insitus
          GROUP BY COD_ASIGNATURA, ASIGNATURA, ID_DOCENTE, SEMESTRE
      ),
      SEMESTRE_PREDOMINANTE AS (
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
  
      SELECT 
          ai.COD_ASIGNATURA,
          ai.ASIGNATURA,
          sp.SEMESTRE_PREDOMINANTE,
          pp.PROGRAMA_PREDOMINANTE
      FROM (
          SELECT DISTINCT COD_ASIGNATURA, ASIGNATURA, ID_DOCENTE
          FROM vista_academica_insitus
      ) ai
      LEFT JOIN SEMESTRE_PREDOMINANTE sp 
          ON ai.COD_ASIGNATURA = sp.COD_ASIGNATURA AND ai.ID_DOCENTE = sp.ID_DOCENTE AND sp.rn = 1
      LEFT JOIN PROGRAMA_PREDOMINANTE pp 
          ON ai.COD_ASIGNATURA = pp.COD_ASIGNATURA AND ai.ID_DOCENTE = pp.ID_DOCENTE AND pp.rn = 1
      WHERE (? IS NULL OR ai.ID_DOCENTE = ?)
      ORDER BY ai.ASIGNATURA`,
      [documento, documento]
    );
    return materias;
  },

  //

  async getRolesAdicionales(userId) {
    const pool = await getPool();
    const [additionalRoles] = await pool.query(
      `SELECT r.NOMBRE_ROL 
       FROM users_roles ur 
       JOIN ROLES r ON ur.rol_id = r.ID 
       WHERE ur.user_id = ?`,
      [userId]
    );
    return additionalRoles;
  },
};

module.exports = VistaProfileModel;
