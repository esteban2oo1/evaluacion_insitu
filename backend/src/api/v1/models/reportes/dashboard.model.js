const { getPool } = require('../../../../db');

const getDashboardStats = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo}) => {
  const pool = await getPool();
  
  // Construir condiciones WHERE dinámicamente
  const buildWhereClause = (alias = 'va') => {
    let conditions = [];
    let params = [];
    
    // 1. ID_CONFIGURACION (siempre presente)
    // Esta condición se maneja en los JOINs, no en WHERE principal
    
    // 2. PERIODO
    if (periodo) {
      conditions.push(`${alias}.PERIODO = ?`);
      params.push(periodo);
    }
    
    // 3. NOMBRE_SEDE
    if (nombreSede) {
      conditions.push(`${alias}.NOMBRE_SEDE = ?`);
      params.push(nombreSede);
    }
    
    // 4. NOM_PROGRAMA
    if (nomPrograma) {
      conditions.push(`${alias}.NOM_PROGRAMA = ?`);
      params.push(nomPrograma);
    }
    
    // 5. SEMESTRE
    if (semestre) {
      conditions.push(`${alias}.SEMESTRE = ?`);
      params.push(semestre);
    }
    
    // 6. GRUPO
    if (grupo) {
      conditions.push(`${alias}.GRUPO = ?`);
      params.push(grupo);
    }
    
    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  };

  // Construir las condiciones para cada parte de la consulta
  const mainWhere = buildWhereClause('va');
  const subQuery1Where = buildWhereClause('va2');
  const subQuery2Where = buildWhereClause();
  const subQuery3Where = buildWhereClause('va3');
  const subQuery4Where = buildWhereClause();

  const query = `
    SELECT 
      COUNT(DISTINCT va.ID_ESTUDIANTE) AS total_estudiantes,
      COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) AS total_evaluaciones,
      COUNT(DISTINCT CASE 
          WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)
      END) AS evaluaciones_completadas,
      COUNT(DISTINCT CASE 
          WHEN ed.ID IS NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)
      END) AS evaluaciones_pendientes,
      ROUND(
          100.0 * COUNT(DISTINCT CASE 
              WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)
          END) 
          / NULLIF(COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)), 0),
          2
      ) AS porcentaje_completado,

      (
          SELECT COUNT(DISTINCT ID_DOCENTE)
          FROM (
              SELECT 
                  va2.ID_DOCENTE,
                  COUNT(DISTINCT CONCAT(va2.ID_ESTUDIANTE, '-', va2.COD_ASIGNATURA)) AS total,
                  COUNT(DISTINCT CASE 
                      WHEN ed2.ID IS NOT NULL THEN CONCAT(va2.ID_ESTUDIANTE, '-', va2.COD_ASIGNATURA) 
                  END) AS completadas
              FROM vista_academica_insitus va2
              LEFT JOIN evaluaciones e2 
                  ON va2.ID_ESTUDIANTE = e2.DOCUMENTO_ESTUDIANTE 
                  AND va2.COD_ASIGNATURA = e2.CODIGO_MATERIA
                  AND e2.ID_CONFIGURACION = ?
              LEFT JOIN evaluacion_detalle ed2 
                  ON e2.ID = ed2.EVALUACION_ID
              ${subQuery1Where.clause}
              GROUP BY va2.ID_DOCENTE
              HAVING total = completadas
          ) docentes_completos
      ) AS docentes_evaluados,

      (
          SELECT COUNT(DISTINCT ID_DOCENTE)
          FROM vista_academica_insitus
          ${subQuery2Where.clause}
      ) AS total_docentes,

      ROUND(
          100.0 * (
              SELECT COUNT(DISTINCT ID_DOCENTE)
              FROM (
                  SELECT 
                      va3.ID_DOCENTE,
                      COUNT(DISTINCT CONCAT(va3.ID_ESTUDIANTE, '-', va3.COD_ASIGNATURA)) AS total,
                      COUNT(DISTINCT CASE 
                          WHEN ed3.ID IS NOT NULL THEN CONCAT(va3.ID_ESTUDIANTE, '-', va3.COD_ASIGNATURA) 
                      END) AS completadas
                  FROM vista_academica_insitus va3
                  LEFT JOIN evaluaciones e3 
                      ON va3.ID_ESTUDIANTE = e3.DOCUMENTO_ESTUDIANTE 
                      AND va3.COD_ASIGNATURA = e3.CODIGO_MATERIA
                      AND e3.ID_CONFIGURACION = ?
                  LEFT JOIN evaluacion_detalle ed3 
                      ON e3.ID = ed3.EVALUACION_ID
                  ${subQuery3Where.clause}
                  GROUP BY va3.ID_DOCENTE
                  HAVING total = completadas
              ) docentes_completos
          )
          / NULLIF((
              SELECT COUNT(DISTINCT ID_DOCENTE)
              FROM vista_academica_insitus
              ${subQuery4Where.clause}
          ), 0),
          2
      ) AS porcentaje_docentes_evaluados

    FROM vista_academica_insitus va
    LEFT JOIN evaluaciones e 
        ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
        AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        AND e.ID_CONFIGURACION = ?
    LEFT JOIN evaluacion_detalle ed 
        ON e.ID = ed.EVALUACION_ID
    ${mainWhere.clause};
  `;

  // Construir array de valores para los parámetros
  const values = [
    idConfiguracion, // Para subQuery1
    ...subQuery1Where.params,
    ...subQuery2Where.params,
    idConfiguracion, // Para subQuery3
    ...subQuery3Where.params,
    ...subQuery4Where.params,
    idConfiguracion, // Para consulta principal
    ...mainWhere.params
  ];

  const [rows] = await pool.query(query, values);
  return rows[0];
};

const getAspectosPromedio = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
    const pool = await getPool();

    // Construir condiciones WHERE dinámicamente
    const buildWhereClause = (alias = 'va') => {
        let conditions = [];
        let params = [];

        // 1. ID_CONFIGURACION (siempre presente)
        conditions.push(`e.ID_CONFIGURACION = ?`);
        params.push(idConfiguracion);

        // 2. PERIODO
        if (periodo) {
            conditions.push(`${alias}.PERIODO = ?`);
            params.push(periodo);
        }

        // 3. NOMBRE_SEDE
        if (nombreSede) {
            conditions.push(`${alias}.NOMBRE_SEDE = ?`);
            params.push(nombreSede);
        }

        // 4. NOM_PROGRAMA
        if (nomPrograma) {
            conditions.push(`${alias}.NOM_PROGRAMA = ?`);
            params.push(nomPrograma);
        }

        // 5. SEMESTRE
        if (semestre) {
            conditions.push(`${alias}.SEMESTRE = ?`);
            params.push(semestre);
        }

        // 6. GRUPO
        if (grupo) {
            conditions.push(`${alias}.GRUPO = ?`);
            params.push(grupo);
        }

        return {
            clause: conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '',
            params
        };
    };

    // Construir la condición WHERE para la consulta principal
    const mainWhere = buildWhereClause('va');

    // Consulta SQL con filtros dinámicos
    const query = `
        SELECT 
            ae.ETIQUETA AS ASPECTO,
            ROUND(
                SUM(cv.PUNTAJE) / 
                (
                    COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) *
                    (
                        SELECT COUNT(*) 
                        FROM configuracion_aspecto 
                        WHERE ACTIVO = TRUE 
                          AND CONFIGURACION_EVALUACION_ID = ?
                    )
                ), 
            2) AS PROMEDIO_GENERAL
        FROM evaluaciones e
        JOIN configuracion_aspecto ca 
            ON e.ID_CONFIGURACION = ca.CONFIGURACION_EVALUACION_ID
        JOIN aspectos_evaluacion ae 
            ON ca.ASPECTO_ID = ae.ID
        JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        JOIN configuracion_valoracion cv 
            ON ed.VALORACION_ID = cv.VALORACION_ID
        JOIN vista_academica_insitus va 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        WHERE ca.ACTIVO = TRUE
          AND cv.ACTIVO = TRUE
          AND e.ID_CONFIGURACION = ?
          ${mainWhere.clause}
        GROUP BY ae.ID, ae.ETIQUETA 
        ORDER BY ae.ID;
    `;

    // Construir los valores de los parámetros para la consulta
    const values = [
        idConfiguracion,  // Para el subquery COUNT(*) de configuracion_aspecto
        idConfiguracion,  // Para la consulta principal (e.ID_CONFIGURACION)
        ...mainWhere.params
    ];

    const [aspectos] = await pool.query(query, values);
    return aspectos;
};

const getRankingDocentes = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  const pool = await getPool();

  // Construir condiciones WHERE dinámicamente para la consulta final
  const buildWhereClause = () => {
    let conditions = [];
    let params = [];
    
    // Siempre incluir la condición de TOTAL_RESPUESTAS > 0
    conditions.push("TOTAL_RESPUESTAS > 0");
    
    // 2. PERIODO
    if (periodo) {
      conditions.push(`PERIODO = ?`);
      params.push(periodo);
    }
    
    // 3. NOMBRE_SEDE
    if (nombreSede) {
      conditions.push(`NOMBRE_SEDE = ?`);
      params.push(nombreSede);
    }
    
    // 4. NOM_PROGRAMA
    if (nomPrograma) {
      conditions.push(`NOM_PROGRAMA = ?`);
      params.push(nomPrograma);
    }
    
    // 5. SEMESTRE
    if (semestre) {
      conditions.push(`SEMESTRE = ?`);
      params.push(semestre);
    }
    
    // 6. GRUPO
    if (grupo) {
      conditions.push(`GRUPO = ?`);
      params.push(grupo);
    }
    
    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params
    };
  };

  const finalWhere = buildWhereClause();

  // Consulta SQL
  const query = `
    WITH DatosCompletos AS (
      SELECT 
          va.ID_DOCENTE, 
          va.DOCENTE, 
          COUNT(DISTINCT CONCAT(va.COD_ASIGNATURA)) AS evaluaciones_esperadas,
  
          -- Evaluaciones únicas por estudiante y asignatura
          COUNT(DISTINCT CASE 
              WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) 
          END) AS evaluaciones_realizadas,
  
          -- Pendientes = esperadas - realizadas
          COUNT(DISTINCT CONCAT(va.COD_ASIGNATURA)) - COUNT(DISTINCT CASE 
              WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) 
          END) AS evaluaciones_pendientes,
  
          -- Puntaje total obtenido por el docente
          IFNULL(SUM(cv.PUNTAJE), 0) AS TOTAL_PUNTAJE,
  
          -- Total de respuestas registradas
          IFNULL(COUNT(ed.ID), 0) AS TOTAL_RESPUESTAS,
  
          -- Total de estudiantes únicos
          IFNULL(COUNT(DISTINCT va.ID_ESTUDIANTE), 0) AS TOTAL_ESTUDIANTES,
  
          -- PROMEDIO GENERAL: puntaje total / (evaluaciones realizadas × aspectos activos)
          IFNULL(ROUND(SUM(cv.PUNTAJE) / 
              (
                  COUNT(DISTINCT CASE 
                      WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) 
                  END)
                  * (SELECT COUNT(*) 
                     FROM configuracion_aspecto 
                     WHERE ACTIVO = TRUE AND CONFIGURACION_EVALUACION_ID = 1)
              ), 2), 0.00) AS PROMEDIO_GENERAL,
  
          e.ID_CONFIGURACION,
          va.PERIODO,
          va.NOMBRE_SEDE, 
          va.NOM_PROGRAMA,
          va.SEMESTRE,
          va.GRUPO
      FROM vista_academica_insitus va
      LEFT JOIN evaluaciones e 
          ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
          AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
      LEFT JOIN evaluacion_detalle ed 
          ON e.ID = ed.EVALUACION_ID
      LEFT JOIN configuracion_valoracion cv 
          ON ed.VALORACION_ID = cv.VALORACION_ID
      WHERE e.ID_CONFIGURACION = ?
      GROUP BY 
          va.ID_DOCENTE, 
          va.DOCENTE, 
          e.ID_CONFIGURACION, 
          va.PERIODO,
          va.NOMBRE_SEDE, 
          va.NOM_PROGRAMA, 
          va.SEMESTRE, 
          va.GRUPO
    )
  
    SELECT 
        ID_DOCENTE, 
        DOCENTE, 
        TOTAL_PUNTAJE,
        PROMEDIO_GENERAL,
        TOTAL_RESPUESTAS,
        evaluaciones_esperadas,
        evaluaciones_realizadas,
        evaluaciones_pendientes,
  
        -- Promedio de respuestas por estudiante
        IFNULL(TOTAL_RESPUESTAS / NULLIF(TOTAL_ESTUDIANTES, 0), 0) AS RESPUESTAS_POR_ESTUDIANTE,
  
        -- Índice de eficiencia (respuestas / evaluaciones realizadas)
        IFNULL(TOTAL_RESPUESTAS / NULLIF(evaluaciones_realizadas, 0), 0) AS EFICIENCIA_RESPUESTAS
  
    FROM DatosCompletos
    ${finalWhere.clause}
    ORDER BY 
        RESPUESTAS_POR_ESTUDIANTE DESC, 
        EFICIENCIA_RESPUESTAS DESC, 
        ID_DOCENTE;
  `;

  try {
    const values = [idConfiguracion, ...finalWhere.params];
    const [ranking] = await pool.query(query, values);
    return ranking;
  } catch (error) {
    console.error("Error al obtener el ranking de docentes: ", error);
    throw error;
  }
};

const getPodioDocentes = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
    const pool = await getPool();

    // Construir condiciones WHERE dinámicamente
    const buildWhereClause = (alias = 'va') => {
        let conditions = [];
        let params = [];

        // 1. ID_CONFIGURACION (siempre presente)
        conditions.push(`e.ID_CONFIGURACION = ?`);
        params.push(idConfiguracion);

        // 2. PERIODO
        if (periodo) {
            conditions.push(`${alias}.PERIODO = ?`);
            params.push(periodo);
        }

        // 3. NOMBRE_SEDE
        if (nombreSede) {
            conditions.push(`${alias}.NOMBRE_SEDE = ?`);
            params.push(nombreSede);
        }

        // 4. NOM_PROGRAMA
        if (nomPrograma) {
            conditions.push(`${alias}.NOM_PROGRAMA = ?`);
            params.push(nomPrograma);
        }

        // 5. SEMESTRE
        if (semestre) {
            conditions.push(`${alias}.SEMESTRE = ?`);
            params.push(semestre);
        }

        // 6. GRUPO
        if (grupo) {
            conditions.push(`${alias}.GRUPO = ?`);
            params.push(grupo);
        }

        return {
            clause: conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '',
            params
        };
    };

    // Construir la condición WHERE para la consulta principal
    const mainWhere = buildWhereClause('va');

    // Consulta SQL con filtros dinámicos
    const query = `
        WITH DatosCompletos AS (
            SELECT 
                va.ID_DOCENTE, 
                va.DOCENTE, 
                COUNT(DISTINCT CONCAT(va.COD_ASIGNATURA)) AS evaluaciones_esperadas,
                COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS evaluaciones_realizadas,
                COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) -
                COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS evaluaciones_pendientes,
                IFNULL(SUM(cv.PUNTAJE), 0) AS TOTAL_PUNTAJE,
                IFNULL(COUNT(DISTINCT ed.ID), 0) AS TOTAL_RESPUESTAS,
                IFNULL(ROUND(SUM(cv.PUNTAJE) / 
                    (
                        COUNT(DISTINCT CASE 
                            WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) 
                        END)
                        * (SELECT COUNT(*) 
                             FROM configuracion_aspecto 
                             WHERE ACTIVO = TRUE AND CONFIGURACION_EVALUACION_ID = ?)
                    ), 2), 0.00) AS PROMEDIO_GENERAL
            FROM vista_academica_insitus va
            LEFT JOIN evaluaciones e 
                ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
                AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
            LEFT JOIN evaluacion_detalle ed 
                ON e.ID = ed.EVALUACION_ID
            LEFT JOIN configuracion_valoracion cv 
                ON ed.VALORACION_id = cv.VALORACION_ID
            WHERE e.ID_CONFIGURACION = ?
              ${mainWhere.clause} 
            GROUP BY va.ID_DOCENTE, va.DOCENTE
        ),
        Filtrados AS (
            SELECT *
            FROM DatosCompletos
            WHERE TOTAL_RESPUESTAS > 0
        ),
        TopMejores AS (
            SELECT 
                *, 
                ROW_NUMBER() OVER (ORDER BY PROMEDIO_GENERAL DESC) AS RANKING
            FROM Filtrados
        ),
        TopPeores AS (
            SELECT 
                *, 
                ROW_NUMBER() OVER (ORDER BY PROMEDIO_GENERAL ASC) AS RANKING
            FROM Filtrados
            WHERE ID_DOCENTE NOT IN (
                SELECT ID_DOCENTE FROM TopMejores WHERE RANKING <= 3
            )
        ),
        TopFinal AS (
            SELECT 
                ID_DOCENTE, 
                DOCENTE, 
                TOTAL_PUNTAJE,
                TOTAL_RESPUESTAS,
                PROMEDIO_GENERAL,
                evaluaciones_esperadas,
                evaluaciones_realizadas,
                evaluaciones_pendientes,
                CONCAT('TOP ', RANKING, ' MEJOR') AS POSICION,
                RANKING AS orden_podio
            FROM TopMejores
            WHERE RANKING <= 3

            UNION ALL

            SELECT 
                ID_DOCENTE, 
                DOCENTE, 
                TOTAL_PUNTAJE,
                TOTAL_RESPUESTAS,
                PROMEDIO_GENERAL,
                evaluaciones_esperadas,
                evaluaciones_realizadas,
                evaluaciones_pendientes,
                CONCAT('TOP ', RANKING, ' PEOR') AS POSICION,
                3 + RANKING AS orden_podio
            FROM TopPeores
            WHERE RANKING <= 3
        )
        SELECT 
            ID_DOCENTE, 
            DOCENTE, 
            TOTAL_PUNTAJE,
            TOTAL_RESPUESTAS,
            PROMEDIO_GENERAL,
            evaluaciones_esperadas,
            evaluaciones_realizadas,
            evaluaciones_pendientes,
            POSICION
        FROM TopFinal
        ORDER BY orden_podio;
    `;

    // Valores para los parámetros de la consulta
    const values = [
        idConfiguracion, // Para el subquery COUNT(*) de configuracion_aspecto
        idConfiguracion, // Para la consulta principal (e.ID_CONFIGURACION)
        ...mainWhere.params, // Parámetros de los filtros dinámicos
    ];

    const [podio] = await pool.query(query, values);
    return podio;
};

module.exports = {
    getDashboardStats,
    getAspectosPromedio,
    getRankingDocentes,
    getPodioDocentes
};
