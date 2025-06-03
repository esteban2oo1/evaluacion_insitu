const { getPool } = require('../../../../db');

const getDashboardStats = async (idConfiguracion) => {
    const pool = await getPool();
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
                        COUNT(DISTINCT CASE WHEN ed2.ID IS NOT NULL THEN CONCAT(va2.ID_ESTUDIANTE, '-', va2.COD_ASIGNATURA) END) AS completadas
                    FROM vista_academica_insitus va2
                    LEFT JOIN evaluaciones e2 
                        ON va2.ID_ESTUDIANTE = e2.DOCUMENTO_ESTUDIANTE 
                        AND va2.COD_ASIGNATURA = e2.CODIGO_MATERIA
                        AND e2.ID_CONFIGURACION = ?
                    LEFT JOIN evaluacion_detalle ed2 
                        ON e2.ID = ed2.EVALUACION_ID
                    GROUP BY va2.ID_DOCENTE
                    HAVING total = completadas
                ) docentes_completos
            ) AS docentes_evaluados,
            (
                SELECT COUNT(DISTINCT ID_DOCENTE)
                FROM vista_academica_insitus
            ) AS total_docentes,
            ROUND(
                100.0 * (
                    SELECT COUNT(DISTINCT ID_DOCENTE)
                    FROM (
                        SELECT 
                            va3.ID_DOCENTE,
                            COUNT(DISTINCT CONCAT(va3.ID_ESTUDIANTE, '-', va3.COD_ASIGNATURA)) AS total,
                            COUNT(DISTINCT CASE WHEN ed3.ID IS NOT NULL THEN CONCAT(va3.ID_ESTUDIANTE, '-', va3.COD_ASIGNATURA) END) AS completadas
                        FROM vista_academica_insitus va3
                        LEFT JOIN evaluaciones e3 
                            ON va3.ID_ESTUDIANTE = e3.DOCUMENTO_ESTUDIANTE 
                            AND va3.COD_ASIGNATURA = e3.CODIGO_MATERIA
                            AND e3.ID_CONFIGURACION = ?
                        LEFT JOIN evaluacion_detalle ed3 
                            ON e3.ID = ed3.EVALUACION_ID
                        GROUP BY va3.ID_DOCENTE
                        HAVING total = completadas
                    ) docentes_completos
                )
                / NULLIF((SELECT COUNT(DISTINCT ID_DOCENTE) FROM vista_academica_insitus), 0),
                2
            ) AS porcentaje_docentes_evaluados
        FROM vista_academica_insitus va
        LEFT JOIN evaluaciones e 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
            AND e.ID_CONFIGURACION = ?
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID;
    `;

    const [stats] = await pool.query(query, [idConfiguracion, idConfiguracion, idConfiguracion]);
    return stats;
};

const getAspectosPromedio = async (idConfiguracion) => {
    const pool = await getPool();
    const query = `
        SELECT 
            ae.ETIQUETA AS ASPECTO,
            ROUND(AVG(cv.PUNTAJE), 2) AS PROMEDIO_GENERAL
        FROM evaluaciones e
        JOIN configuracion_aspecto ca 
            ON e.ID_CONFIGURACION = ca.CONFIGURACION_EVALUACION_ID
        JOIN aspectos_evaluacion ae 
            ON ca.ASPECTO_ID = ae.ID
        JOIN configuracion_valoracion cv 
            ON ca.CONFIGURACION_EVALUACION_ID = cv.CONFIGURACION_EVALUACION_ID
        WHERE ca.ACTIVO = TRUE
        AND cv.ACTIVO = TRUE
        AND e.ID_CONFIGURACION = ?
        GROUP BY ae.ID, ae.ETIQUETA
        ORDER BY ae.ID;
    `;

    const [aspectos] = await pool.query(query, [idConfiguracion]);
    return aspectos;
};

const getRankingDocentes = async () => {
    const pool = await getPool();
    const query = `
        WITH DatosCompletos AS (
            SELECT 
                va.ID_DOCENTE, 
                va.DOCENTE, 
                COUNT(va.ID_DOCENTE) AS evaluaciones_esperadas,
                COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS evaluaciones_realizadas,
                COUNT(va.ID_DOCENTE) - COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS evaluaciones_pendientes,
                IFNULL(SUM(cv.PUNTAJE), 0) AS TOTAL_PUNTAJE,
                IFNULL(COUNT(DISTINCT ed.ID), 0) AS TOTAL_RESPUESTAS,
                IFNULL(ROUND(AVG(cv.PUNTAJE), 2), 0.00) AS PROMEDIO_GENERAL
            FROM vista_academica_insitus va
            LEFT JOIN evaluaciones e 
                ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
                AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
            LEFT JOIN evaluacion_detalle ed 
                ON e.ID = ed.EVALUACION_ID
            LEFT JOIN configuracion_valoracion cv 
                ON ed.VALORACION_ID = cv.VALORACION_ID
            GROUP BY va.ID_DOCENTE, va.DOCENTE
        )
        SELECT 
            ID_DOCENTE, 
            DOCENTE, 
            TOTAL_PUNTAJE,
            PROMEDIO_GENERAL,
            TOTAL_RESPUESTAS,
            evaluaciones_esperadas,
            evaluaciones_realizadas,
            evaluaciones_pendientes
        FROM DatosCompletos
        WHERE TOTAL_RESPUESTAS > 0
        ORDER BY PROMEDIO_GENERAL DESC;
    `;

    const [ranking] = await pool.query(query);
    return ranking;
};

const getPodioDocentes = async () => {
    const pool = await getPool();
    const query = `
        WITH DatosCompletos AS (
            SELECT 
                va.ID_DOCENTE, 
                va.DOCENTE, 
                COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) AS evaluaciones_esperadas,
                COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS evaluaciones_realizadas,
                COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) -
                COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS evaluaciones_pendientes,
                IFNULL(SUM(cv.PUNTAJE), 0) AS TOTAL_PUNTAJE,
                IFNULL(COUNT(DISTINCT ed.ID), 0) AS TOTAL_RESPUESTAS,
                IFNULL(ROUND(AVG(cv.PUNTAJE), 2), 0.00) AS PROMEDIO_GENERAL
            FROM vista_academica_insitus va
            LEFT JOIN evaluaciones e 
                ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
                AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
            LEFT JOIN evaluacion_detalle ed 
                ON e.ID = ed.EVALUACION_ID
            LEFT JOIN configuracion_valoracion cv 
                ON ed.VALORACION_ID = cv.VALORACION_ID
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

    const [podio] = await pool.query(query);
    return podio;
};

module.exports = {
    getDashboardStats,
    getAspectosPromedio,
    getRankingDocentes,
    getPodioDocentes
};
