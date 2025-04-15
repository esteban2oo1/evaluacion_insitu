const { getPool } = require('../../../../db');

const getDocentesAsignaturasModel = async () => {
    const pool = await getPool();
    const query = `
        WITH ASIGNATURA_SEMESTRES AS (
            SELECT 
                COD_ASIGNATURA,
                ASIGNATURA,
                ID_DOCENTE,
                DOCENTE,
                SEMESTRE,
                COUNT(*) AS TOTAL_ESTUDIANTES
            FROM vista_academica_insitus
            GROUP BY COD_ASIGNATURA, ASIGNATURA, ID_DOCENTE, DOCENTE, SEMESTRE
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
            ai.ID_DOCENTE,
            ai.DOCENTE,
            sp.SEMESTRE_PREDOMINANTE,
            pp.PROGRAMA_PREDOMINANTE,
            COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) AS total_evaluaciones_esperadas,
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
            CASE 
                WHEN COUNT(DISTINCT CASE 
                    WHEN ed.ID IS NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) 
                END) = 0 
                    AND COUNT(DISTINCT CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA)) > 0 THEN 'COMPLETADO'
                WHEN COUNT(DISTINCT CASE 
                    WHEN ed.ID IS NOT NULL THEN CONCAT(va.ID_ESTUDIANTE, '-', va.COD_ASIGNATURA) 
                END) = 0 THEN 'NO INICIADO'
                ELSE 'EN PROGRESO'
            END AS estado_evaluacion
        FROM 
            vista_academica_insitus va
        LEFT JOIN evaluaciones e 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        LEFT JOIN ASIGNATURA_SEMESTRES ai 
            ON va.COD_ASIGNATURA = ai.COD_ASIGNATURA AND va.ID_DOCENTE = ai.ID_DOCENTE
        LEFT JOIN SEMESTRE_PREDOMINANTE sp 
            ON ai.COD_ASIGNATURA = sp.COD_ASIGNATURA 
            AND ai.ID_DOCENTE = sp.ID_DOCENTE 
            AND sp.rn = 1
        LEFT JOIN PROGRAMA_PREDOMINANTE pp 
            ON ai.COD_ASIGNATURA = pp.COD_ASIGNATURA 
            AND ai.ID_DOCENTE = pp.ID_DOCENTE 
            AND pp.rn = 1
        GROUP BY 
            ai.COD_ASIGNATURA,
            ai.ASIGNATURA,
            ai.ID_DOCENTE,
            ai.DOCENTE,
            sp.SEMESTRE_PREDOMINANTE,
            pp.PROGRAMA_PREDOMINANTE
        ORDER BY porcentaje_completado DESC;
    `;
    const [result] = await pool.query(query);
    return result;
};

const getEstudiantesEvaluadosModel = async (idDocente, codAsignatura, grupo) => {
    const pool = await getPool();
    const query = `
        SELECT 
            COUNT(DISTINCT va.ID_ESTUDIANTE) AS total_estudiantes,
            COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.ID_ESTUDIANTE END) AS evaluaciones_realizadas,
            COUNT(DISTINCT CASE WHEN ed.ID IS NULL THEN va.ID_ESTUDIANTE END) AS evaluaciones_sin_realizar
        FROM vista_academica_insitus va
        LEFT JOIN evaluaciones e 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        WHERE 
            va.ID_DOCENTE = ? 
            AND va.COD_ASIGNATURA = ? 
            AND va.GRUPO = ?;
    `;
    const [result] = await pool.query(query, [idDocente, codAsignatura, grupo]);
    return result[0];
};

const getAspectosPuntajeModel = async (idDocente) => {
    const pool = await getPool();
    const query = `
        SELECT 
            va.ID_DOCENTE, 
            va.DOCENTE, 
            a.ETIQUETA AS ASPECTO, 
            a.descripcion,
            AVG(cv.PUNTAJE) AS PUNTAJE_PROMEDIO
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
        WHERE 
            va.ID_DOCENTE = ?
        GROUP BY 
            va.ID_DOCENTE, 
            va.DOCENTE, 
            a.ID
        ORDER BY 
            va.ID_DOCENTE, 
            a.ETIQUETA;
    `;
    const [result] = await pool.query(query, [idDocente]);
    return result;
};

const getComentariosModel = async (idDocente) => {
    const pool = await getPool();
    const query = `
        SELECT 
            va.ID_DOCENTE, 
            va.DOCENTE, 
            a.ETIQUETA AS ASPECTO, 
            a.descripcion,
            e.COMENTARIO_GENERAL, 
            ed.COMENTARIO
        FROM vista_academica_insitus va
        JOIN evaluaciones e
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        JOIN evaluacion_detalle ed
            ON e.ID = ed.EVALUACION_ID
        JOIN aspectos_evaluacion a
            ON ed.ASPECTO_ID = a.ID
        WHERE 
            va.ID_DOCENTE = ?
        ORDER BY va.ID_DOCENTE, a.ETIQUETA;
    `;
    const [result] = await pool.query(query, [idDocente]);
    return result;
};

module.exports = {
    getDocentesAsignaturasModel,
    getEstudiantesEvaluadosModel,
    getAspectosPuntajeModel,
    getComentariosModel
}; 