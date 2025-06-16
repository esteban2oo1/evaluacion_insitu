const { getPool } = require("../../../../db");
const { getRemotePool } = require('../../../../db');
const { getSecurityPool } = require('../../../../db');

const VistaProfileModel = {

  // INFORMACION DE ESTUDIANTE

  async getEstudianteInfo(documento) {
    const remotePool = await getRemotePool(); // sigedin_ies
    const securityPool = await getSecurityPool(); // sigedin_seguridad
    
    // Consulta principal de estudiante desde sigedin_ies
    const [estudianteInfo] = await remotePool.query(
      `SELECT 
          e.SEDE,
          e.TIPO_DOC,
          e.DOCUMENTO_ESTUDIANTE,
          e.ESTADO_MATRICULA,
          p.NOM_PROGRAMA,
          e.SEMESTRE_MATRICULA,
          p.SEMESTRE,
          p.GRUPO
      FROM vista_estudiantes e
      JOIN vista_academica_insitus p 
          ON e.DOCUMENTO_ESTUDIANTE = p.ID_ESTUDIANTE
      WHERE e.DOCUMENTO_ESTUDIANTE = ?
      GROUP BY 
          e.SEMESTRE_MATRICULA,
          e.SEDE,
          e.TIPO_DOC,
          e.DOCUMENTO_ESTUDIANTE,
          e.ESTADO_MATRICULA,
          p.NOM_PROGRAMA,
          p.SEMESTRE,
          p.GRUPO`,
      [documento]
    );

    // Consulta de datos de login desde sigedin_seguridad
    const [loginInfo] = await securityPool.query(
      `SELECT 
          dl.user_name,
          dl.user_idrole,
          dl.role_name AS ROL_PRINCIPAL,
          dl.user_id
      FROM datalogin dl 
      WHERE dl.user_username = ?`,
      [documento]
    );

    // Si no hay información de estudiante o login, retornar array vacío
    if (estudianteInfo.length === 0 || loginInfo.length === 0) {
      return [];
    }

    // Obtener roles adicionales desde base local
    const localPool = await getPool();
    const [additionalRoles] = await localPool.query(
      `SELECT 
          r.ID AS ID_ROL_ADICIONAL,
          r.NOMBRE_ROL AS ROL_ADICIONAL
      FROM users_roles ur 
      JOIN roles r ON ur.rol_id = r.ID
      WHERE ur.user_id = ? AND r.NOMBRE_ROL != ?`,
      [loginInfo[0].user_id, loginInfo[0].ROL_PRINCIPAL]
    );

    // Crear el resultado combinando estudiante info con roles adicionales
    const resultado = [];
    const infoBase = {
      ...estudianteInfo[0],
      user_name: loginInfo[0].user_name,
      user_idrole: loginInfo[0].user_idrole,
      ROL_PRINCIPAL: loginInfo[0].ROL_PRINCIPAL
    };

    // Si hay roles adicionales, crear una fila por cada rol adicional
    if (additionalRoles.length > 0) {
      additionalRoles.forEach(rol => {
        resultado.push({
          ...infoBase,
          ID_ROL_ADICIONAL: rol.ID_ROL_ADICIONAL,
          ROL_ADICIONAL: rol.ROL_ADICIONAL
        });
      });
    } else {
      // Si no hay roles adicionales, agregar solo la información base
      resultado.push({
        ...infoBase,
        ID_ROL_ADICIONAL: null,
        ROL_ADICIONAL: null
      });
    }

    console.log(resultado);
    return resultado;
  },

  // MATERIAS DE ESTUDIANTE

  async getMateriasEstudiante(documento) {
    const remotePool = await getRemotePool();
    const [materias] = await remotePool.query(
      `SELECT DISTINCT 
         ai.COD_ASIGNATURA as CODIGO_MATERIA,
         ai.ASIGNATURA as NOMBRE_MATERIA,
         ai.ID_DOCENTE as DOCUMENTO_DOCENTE,
         ai.DOCENTE as NOMBRE_DOCENTE
       FROM vista_academica_insitus ai
       WHERE ai.ID_ESTUDIANTE = ?`,
      [documento]
    );
    return materias;
  },

  // INFORMACION DE DOCENTE

  async getDocenteInfo(documento) {
    const remotePool = await getRemotePool(); // sigedin_ies
    const securityPool = await getSecurityPool(); // sigedin_seguridad
    
    // Consulta principal de docente desde sigedin_ies
    const [docenteInfo] = await remotePool.query(
      `SELECT DISTINCT
         ai.ID_DOCENTE AS DOCUMENTO_DOCENTE,
         ai.DOCENTE AS NOMBRE_DOCENTE,
         ai.NOMBRE_SEDE AS SEDE,
         ai.PERIODO
       FROM vista_academica_insitus ai
       WHERE ai.ID_DOCENTE = ?
       GROUP BY 
          ai.ID_DOCENTE,
          ai.DOCENTE,
          ai.NOMBRE_SEDE,
          ai.PERIODO`,
      [documento]
    );

    // Consulta de datos de login desde sigedin_seguridad
    const [loginInfo] = await securityPool.query(
      `SELECT 
          dl.user_name,
          dl.user_idrole,
          dl.role_name AS ROL_PRINCIPAL,
          dl.user_id
      FROM datalogin dl 
      WHERE dl.user_username = ?`,
      [documento]
    );

    // Si no hay información de docente o login, retornar array vacío
    if (docenteInfo.length === 0 || loginInfo.length === 0) {
      return [];
    }

    // Obtener roles adicionales desde base local
    const localPool = await getPool();
    const [additionalRoles] = await localPool.query(
      `SELECT 
          r.ID AS ID_ROL_ADICIONAL,
          r.NOMBRE_ROL AS ROL_ADICIONAL
      FROM users_roles ur 
      JOIN roles r ON ur.rol_id = r.ID
      WHERE ur.user_id = ? AND r.NOMBRE_ROL != ?`,
      [loginInfo[0].user_id, loginInfo[0].ROL_PRINCIPAL]
    );

    // Crear el resultado combinando docente info con roles adicionales
    const resultado = [];
    const infoBase = {
      ...docenteInfo[0],
      user_name: loginInfo[0].user_name,
      user_idrole: loginInfo[0].user_idrole,
      ROL_PRINCIPAL: loginInfo[0].ROL_PRINCIPAL
    };

    // Si hay roles adicionales, crear una fila por cada rol adicional
    if (additionalRoles.length > 0) {
      additionalRoles.forEach(rol => {
        resultado.push({
          ...infoBase,
          ID_ROL_ADICIONAL: rol.ID_ROL_ADICIONAL,
          ROL_ADICIONAL: rol.ROL_ADICIONAL
        });
      });
    } else {
      // Si no hay roles adicionales, agregar solo la información base
      resultado.push({
        ...infoBase,
        ID_ROL_ADICIONAL: null,
        ROL_ADICIONAL: null
      });
    }

    return resultado;
  },

  // MATERIAS DE DOCENTE

  async getMateriasDocente(documento) {
    const remotePool = await getRemotePool();
    const [materias] = await remotePool.query(
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

  // OBTENER ROLES ADICIONALES (desde base local)

  async getRolesAdicionales(userId) {
    const localPool = await getPool();
    const [additionalRoles] = await localPool.query(
      `SELECT r.NOMBRE_ROL 
       FROM users_roles ur 
       JOIN ROLES r ON ur.rol_id = r.ID 
       WHERE ur.user_id = ?`,
      [userId]
    );
    return additionalRoles;
  },

  // OBTENER INFORMACION DE LOGIN (desde sigedin_seguridad)

  async getLoginInfo(username) {
    const securityPool = await getSecurityPool();
    const [loginInfo] = await securityPool.query(
      `SELECT 
          user_id,
          user_name,
          user_username,
          user_idrole,
          role_name
      FROM datalogin 
      WHERE user_username = ?`,
      [username]
    );
    return loginInfo;
  }
};

module.exports = VistaProfileModel;