const { getPool } = require('../../../../db');

const getEstudianteEvaluaciones = async (idEstudiante) => {
    const pool = await getPool();
    const query = `
        SELECT 
            COUNT(DISTINCT va.COD_ASIGNATURA) AS total_materias,
            COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.COD_ASIGNATURA END) AS evaluaciones_completadas,
            COUNT(DISTINCT CASE WHEN ed.ID IS NULL THEN va.COD_ASIGNATURA END) AS materias_pendientes,
            ROUND(
                100.0 * COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.COD_ASIGNATURA END) 
                / NULLIF(COUNT(DISTINCT va.COD_ASIGNATURA), 0), 
                2
            ) AS porcentaje_completado
        FROM vista_academica_insitus va
        LEFT JOIN evaluaciones e 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        WHERE va.ID_ESTUDIANTE = ?;
    `;

    const [stats] = await pool.query(query, [idEstudiante]);
    return stats;
};

const getEstudiantesEvaluaciones = async () => {
    const pool = await getPool();
    const query = `
        SELECT 
            va.ID_ESTUDIANTE,
            CONCAT(va.PRIMER_NOMBRE, ' ', IFNULL(va.SEGUNDO_NOMBRE, ''), ' ', va.PRIMER_APELLIDO, ' ', IFNULL(va.SEGUNDO_APELLIDO, '')) AS NOMBRE_COMPLETO,
            COUNT(DISTINCT va.COD_ASIGNATURA) AS total_materias,
            COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.COD_ASIGNATURA END) AS evaluaciones_completadas,
            COUNT(DISTINCT CASE WHEN ed.ID IS NULL THEN va.COD_ASIGNATURA END) AS materias_pendientes,
            ROUND(
                100.0 * COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.COD_ASIGNATURA END)
                / NULLIF(COUNT(DISTINCT va.COD_ASIGNATURA), 0),
                2
            ) AS porcentaje_completado
        FROM vista_academica_insitus va
        LEFT JOIN evaluaciones e 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        GROUP BY 
            va.ID_ESTUDIANTE,
            va.PRIMER_NOMBRE, va.SEGUNDO_NOMBRE, va.PRIMER_APELLIDO, va.SEGUNDO_APELLIDO
        ORDER BY porcentaje_completado DESC;
    `;

    const [estudiantes] = await pool.query(query);
    return estudiantes;
};

const getEstudiantesByDocenteMateriaGrupo = async (idDocente, codAsignatura, grupo) => {
    const pool = await getPool();
    const query = `
        SELECT 
            va.ID_ESTUDIANTE,
            CONCAT(
                va.PRIMER_NOMBRE, ' ',
                IFNULL(va.SEGUNDO_NOMBRE, ''), ' ',
                va.PRIMER_APELLIDO, ' ',
                IFNULL(va.SEGUNDO_APELLIDO, '')
            ) AS NOMBRE_COMPLETO,
            va.COD_ASIGNATURA,
            va.ASIGNATURA,
            va.PERIODO,
            va.GRUPO,
            va.SEMESTRE,
            COUNT(DISTINCT va.COD_ASIGNATURA) AS total_materias,
            COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.COD_ASIGNATURA END) AS evaluaciones_completadas,
            COUNT(DISTINCT CASE WHEN ed.ID IS NULL THEN va.COD_ASIGNATURA END) AS materias_pendientes,
            ROUND(
                100.0 * COUNT(DISTINCT CASE WHEN ed.ID IS NOT NULL THEN va.COD_ASIGNATURA END) 
                / NULLIF(COUNT(DISTINCT va.COD_ASIGNATURA), 0), 2
            ) AS porcentaje_completado
        FROM vista_academica_insitus va
        LEFT JOIN evaluaciones e 
            ON va.ID_ESTUDIANTE = e.DOCUMENTO_ESTUDIANTE 
            AND va.COD_ASIGNATURA = e.CODIGO_MATERIA
        LEFT JOIN evaluacion_detalle ed 
            ON e.ID = ed.EVALUACION_ID
        WHERE 
            va.ID_DOCENTE = ? 
            AND va.COD_ASIGNATURA = ? 
            AND va.GRUPO = ?
        GROUP BY 
            va.ID_ESTUDIANTE,
            va.PRIMER_NOMBRE, va.SEGUNDO_NOMBRE, va.PRIMER_APELLIDO, va.SEGUNDO_APELLIDO,
            va.COD_ASIGNATURA, va.ASIGNATURA, va.PERIODO, va.GRUPO, va.SEMESTRE
        ORDER BY 
            porcentaje_completado DESC,
            va.PRIMER_APELLIDO, va.SEGUNDO_APELLIDO, va.PRIMER_NOMBRE;
    `;

    const [estudiantes] = await pool.query(query, [idDocente, codAsignatura, grupo]);
    return estudiantes;
};

module.exports = {
    getEstudianteEvaluaciones,
    getEstudiantesEvaluaciones,
    getEstudiantesByDocenteMateriaGrupo
}; 