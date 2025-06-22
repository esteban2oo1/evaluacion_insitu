const { getPool, getRemotePool } = require('../../../../db');

const getEstudianteEvaluaciones = async (idEstudiante, idConfiguracion) => {
    console.log(`Obteniendo estadísticas de evaluaciones para el estudiante: ${idEstudiante} con configuración: ${idConfiguracion}`);
    
    try {
        // Pool remoto para vista_academica_insitus (datos académicos externos)
        const remotePool = await getRemotePool();
        
        // Pool local para evaluaciones y evaluacion_detalle (datos internos)
        const localPool = await getPool();
        
        // Primero obtenemos las materias del estudiante desde el sistema remoto
        const materiasQuery = `
            SELECT DISTINCT 
                COD_ASIGNATURA,
                ASIGNATURA,
                ID_ESTUDIANTE
            FROM vista_academica_insitus 
            WHERE ID_ESTUDIANTE = ?
        `;
        
        const [materias] = await remotePool.query(materiasQuery, [idEstudiante]);
        
        if (materias.length === 0) {
            console.log(`No se encontraron materias para el estudiante: ${idEstudiante}`);
            return {
                total_materias: 0,
                evaluaciones_completadas: 0,
                materias_pendientes: 0,
                porcentaje_completado: 0
            };
        }
        
        // Extraemos los códigos de asignatura para la consulta local
        const codigosAsignatura = materias.map(materia => materia.COD_ASIGNATURA);
        const placeholders = codigosAsignatura.map(() => '?').join(',');
        
        // Luego obtenemos las evaluaciones completadas desde el sistema local
        const evaluacionesQuery = `
            SELECT DISTINCT 
                e.CODIGO_MATERIA,
                e.DOCUMENTO_ESTUDIANTE,
                ed.ID as detalle_id
            FROM evaluaciones e
            INNER JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
            WHERE e.DOCUMENTO_ESTUDIANTE = ? 
                AND e.ID_CONFIGURACION = ?
                AND e.CODIGO_MATERIA IN (${placeholders})
        `;
        
        const queryParams = [idEstudiante, idConfiguracion, ...codigosAsignatura];
        const [evaluacionesCompletadas] = await localPool.query(evaluacionesQuery, queryParams);
        
        // Calculamos las estadísticas
        const totalMaterias = materias.length;
        const materiasCompletadas = new Set(evaluacionesCompletadas.map(ev => ev.CODIGO_MATERIA)).size;
        const materiasPendientes = totalMaterias - materiasCompletadas;
        const porcentajeCompletado = totalMaterias > 0 
            ? Math.round((materiasCompletadas / totalMaterias) * 100 * 100) / 100  // Redondeo a 2 decimales
            : 0;
        
        const resultado = {
            total_materias: totalMaterias,
            evaluaciones_completadas: materiasCompletadas,
            materias_pendientes: materiasPendientes,
            porcentaje_completado: porcentajeCompletado
        };
        
        console.log('Estadísticas calculadas:', resultado);
        return resultado;
        
    } catch (error) {
        console.error('Error al obtener estadísticas de evaluaciones:', error);
        throw new Error(`Error al procesar estadísticas del estudiante ${idEstudiante}: ${error.message}`);
    }
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