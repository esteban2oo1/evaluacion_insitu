const { getPool, getRemotePool } = require('../../../../db');

const getDocentesAsignaturasModel = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
    // Separate pools for different databases
    const remotePool = await getRemotePool(); // For vista_academica_insitus
    const localPool = await getPool(); // For evaluaciones and evaluacion_detalle

    // Separate conditions for remote and local databases
    let remoteConditions = [];
    let remoteParams = [];
    let localConditions = [];
    let localParams = [];

    // Remote database filters (vista_academica_insitus)
    if (periodo) {
        remoteConditions.push(`PERIODO = ?`);
        remoteParams.push(periodo);
    }

    if (nombreSede) {
        remoteConditions.push(`NOMBRE_SEDE = ?`);
        remoteParams.push(nombreSede);
    }

    if (nomPrograma) {
        remoteConditions.push(`NOM_PROGRAMA = ?`);
        remoteParams.push(nomPrograma);
    }

    if (semestre) {
        remoteConditions.push(`SEMESTRE = ?`);
        remoteParams.push(semestre);
    }

    if (grupo) {
        remoteConditions.push(`GRUPO = ?`);
        remoteParams.push(grupo);
    }

    // Local database filters (evaluaciones)
    if (idConfiguracion) {
        localConditions.push(`ID_CONFIGURACION = ?`);
        localParams.push(idConfiguracion);
    }

    const remoteWhereClause = remoteConditions.length > 0 ? `WHERE ${remoteConditions.join(' AND ')}` : '';
    const localWhereClause = localConditions.length > 0 ? `WHERE ${localConditions.join(' AND ')}` : '';

    try {
        // Step 1: Get basic academic data from vista_academica_insitus (remote database)
        const academicDataQuery = `
            SELECT 
                COD_ASIGNATURA,
                ASIGNATURA,
                ID_DOCENTE,
                DOCENTE,
                SEMESTRE,
                NOM_PROGRAMA,
                NOMBRE_SEDE,
                GRUPO,
                ID_ESTUDIANTE
            FROM vista_academica_insitus
            ${remoteWhereClause}
            ORDER BY COD_ASIGNATURA, ID_DOCENTE
        `;

        const [academicData] = await remotePool.query(academicDataQuery, remoteParams);

        // Step 2: Get evaluation data from local database
        const evaluationQuery = `
            SELECT 
                e.DOCUMENTO_ESTUDIANTE,
                e.CODIGO_MATERIA,
                e.ID_CONFIGURACION,
                COUNT(DISTINCT ed.ID) AS evaluaciones_completadas
            FROM evaluaciones e
            LEFT JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
            ${localWhereClause}
            GROUP BY e.DOCUMENTO_ESTUDIANTE, e.CODIGO_MATERIA, e.ID_CONFIGURACION
        `;

        const [evaluationData] = await localPool.query(evaluationQuery, localParams);

        // Step 3: Combine data in application layer
        const evaluationMap = new Map();
        evaluationData.forEach(eval => {
            const key = `${eval.DOCUMENTO_ESTUDIANTE}-${eval.CODIGO_MATERIA}`;
            evaluationMap.set(key, eval.evaluaciones_completadas);
        });

        // Step 4: Process academic data to find predominant semester and program
        const processedData = new Map();
        
        // First pass: collect all data and count occurrences
        academicData.forEach(academic => {
            const key = `${academic.COD_ASIGNATURA}-${academic.ID_DOCENTE}`;
            
            if (!processedData.has(key)) {
                processedData.set(key, {
                    COD_ASIGNATURA: academic.COD_ASIGNATURA,
                    ASIGNATURA: academic.ASIGNATURA,
                    ID_DOCENTE: academic.ID_DOCENTE,
                    DOCENTE: academic.DOCENTE,
                    semesterCounts: new Map(),
                    programCounts: new Map(),
                    students: new Map()
                });
            }
            
            const data = processedData.get(key);
            
            // Count semesters
            const semCount = data.semesterCounts.get(academic.SEMESTRE) || 0;
            data.semesterCounts.set(academic.SEMESTRE, semCount + 1);
            
            // Count programs
            const progCount = data.programCounts.get(academic.NOM_PROGRAMA) || 0;
            data.programCounts.set(academic.NOM_PROGRAMA, progCount + 1);
            
            // Store student data by group and sede
            const studentKey = `${academic.NOMBRE_SEDE}-${academic.GRUPO}`;
            if (!data.students.has(studentKey)) {
                data.students.set(studentKey, {
                    NOMBRE_SEDE: academic.NOMBRE_SEDE,
                    GRUPO: academic.GRUPO,
                    studentIds: new Set()
                });
            }
            data.students.get(studentKey).studentIds.add(academic.ID_ESTUDIANTE);
        });
        
        // Step 5: Build final results with predominant values
        const resultMap = new Map();
        
        processedData.forEach((data, key) => {
            // Find predominant semester
            let maxSemCount = 0;
            let predominantSemester = null;
            data.semesterCounts.forEach((count, semester) => {
                if (count > maxSemCount) {
                    maxSemCount = count;
                    predominantSemester = semester;
                }
            });
            
            // Find predominant program
            let maxProgCount = 0;
            let predominantProgram = null;
            data.programCounts.forEach((count, program) => {
                if (count > maxProgCount) {
                    maxProgCount = count;
                    predominantProgram = program;
                }
            });
            
            // Create results for each sede-grupo combination
            data.students.forEach((studentData, studentKey) => {
                const resultKey = `${key}-${studentKey}`;
                
                let evaluaciones_completadas = 0;
                let evaluaciones_pendientes = 0;
                
                studentData.studentIds.forEach(studentId => {
                    const evalKey = `${studentId}-${data.COD_ASIGNATURA}`;
                    if (evaluationMap.has(evalKey)) {
                        evaluaciones_completadas++;
                    } else {
                        evaluaciones_pendientes++;
                    }
                });
                
                const total_evaluaciones_esperadas = studentData.studentIds.size;
                
                resultMap.set(resultKey, {
                    COD_ASIGNATURA: data.COD_ASIGNATURA,
                    ASIGNATURA: data.ASIGNATURA,
                    ID_DOCENTE: data.ID_DOCENTE,
                    DOCENTE: data.DOCENTE,
                    SEMESTRE_PREDOMINANTE: predominantSemester,
                    PROGRAMA_PREDOMINANTE: predominantProgram,
                    NOMBRE_SEDE: studentData.NOMBRE_SEDE,
                    GRUPO: studentData.GRUPO,
                    total_evaluaciones_esperadas,
                    evaluaciones_completadas,
                    evaluaciones_pendientes
                });
            });
        });

        // Step 6: Calculate percentages and status
        const finalResults = Array.from(resultMap.values()).map(result => ({
            ...result,
            porcentaje_completado: result.total_evaluaciones_esperadas > 0 
                ? Math.round((result.evaluaciones_completadas / result.total_evaluaciones_esperadas) * 100 * 100) / 100
                : 0,
            estado_evaluacion: result.evaluaciones_pendientes === 0 && result.total_evaluaciones_esperadas > 0
                ? 'COMPLETADO'
                : result.evaluaciones_completadas === 0
                ? 'NO INICIADO'
                : 'EN PROGRESO'
        }));

        // Sort by percentage completed (descending)
        finalResults.sort((a, b) => b.porcentaje_completado - a.porcentaje_completado);

        return finalResults;

    } catch (error) {
        console.error('Error in getDocentesAsignaturasModel:', error);
        throw error;
    }
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