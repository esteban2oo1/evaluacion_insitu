const { getPool } = require('../../../../db');

const getDashboardStats = async () => {
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
                        va.ID_DOCENTE,
                        COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) AS total,
                        COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS completadas
                    FROM vista_academica_insitus va
                    LEFT JOIN evaluaciones e 
                        ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
                        AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
                    LEFT JOIN evaluacion_detalle ed 
                        ON e.ID = ed.EVALUACION_ID
                    GROUP BY va.ID_DOCENTE
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
                            va.ID_DOCENTE,
                            COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) AS total,
                            COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) END) AS completadas
                        FROM vista_academica_insitus va
                        LEFT JOIN evaluaciones e 
                            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
                            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
                        LEFT JOIN evaluacion_detalle ed 
                            ON e.ID = ed.EVALUACION_ID
                        GROUP BY va.ID_DOCENTE
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
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID;
    `;

    const [stats] = await pool.query(query);
    return stats;
};

const getAspectosPromedio = async () => {
    const pool = await getPool();
    const query = `
        SELECT 
            a.ETIQUETA AS ASPECTO, 
            ROUND(AVG(cv.PUNTAJE), 2) AS PROMEDIO_GENERAL
        FROM vista_academica_insitus va
        JOIN evaluaciones e
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        JOIN evaluacion_detalle ed
            ON e.ID = ed.EVALUACION_ID
        JOIN aspectos_evaluacion a
            ON ed.ASPECTO_ID = a.ID
        JOIN configuracion_valoracion cv
            ON ed.VALORACION_ID = cv.VALORACION_ID
        GROUP BY 
            a.ID, a.ETIQUETA
        ORDER BY 
            a.ID;
    `;

    const [aspectos] = await pool.query(query);
    return aspectos;
};

const getRankingDocentes = async () => {
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
