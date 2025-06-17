const { getPool, getRemotePool } = require('../../../../db');

const getDocentesAsignaturasModel = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
    // Pools separados para diferentes bases de datos
    const remotePool = await getRemotePool(); // Para vista_academica_insitus
    const localPool = await getPool(); // Para evaluaciones y evaluacion_detalle

    // Condiciones separadas para bases de datos remotas y locales
    let remoteConditions = [];
    let remoteParams = [];
    let localConditions = [];
    let localParams = [];

    // Filtros para base de datos remota (vista_academica_insitus)
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

    // Filtros para base de datos local (evaluaciones)
    if (idConfiguracion) {
        localConditions.push(`ID_CONFIGURACION = ?`);
        localParams.push(idConfiguracion);
    }

    const remoteWhereClause = remoteConditions.length > 0 ? `WHERE ${remoteConditions.join(' AND ')}` : '';
    const localWhereClause = localConditions.length > 0 ? `WHERE ${localConditions.join(' AND ')}` : '';

    try {
        // Paso 1: Obtener datos académicos básicos de vista_academica_insitus (base de datos remota)
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

        // Paso 2: Obtener datos de evaluaciones de la base de datos local
        const evaluationQuery = `
            SELECT 
                e.DOCUMENTO_ESTUDIANTE,
                e.CODIGO_MATERIA,
                e.ID_CONFIGURACION,
                ed.ID as evaluacion_detalle_id
            FROM evaluaciones e
            LEFT JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
            ${localWhereClause}
        `;

        const [evaluationData] = await localPool.query(evaluationQuery, localParams);

        // Paso 3: Crear mapa de evaluaciones completadas (solo las que tienen evaluacion_detalle)
        const evaluationMap = new Map();
        evaluationData.forEach(eval => {
            const key = `${eval.DOCUMENTO_ESTUDIANTE}-${eval.CODIGO_MATERIA}`;
            // Solo contar como completada si tiene evaluacion_detalle (ed.ID no es null)
            if (eval.evaluacion_detalle_id !== null) {
                evaluationMap.set(key, true);
            }
        });

        // Paso 4: Procesar datos académicos para encontrar semestre y programa predominantes
        const processedData = new Map();
        
        // Primer paso: recopilar todos los datos y contar ocurrencias
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
                    sedeGrupoData: new Map()
                });
            }
            
            const data = processedData.get(key);
            
            // Contar semestres para encontrar el predominante
            const semCount = data.semesterCounts.get(academic.SEMESTRE) || 0;
            data.semesterCounts.set(academic.SEMESTRE, semCount + 1);
            
            // Contar programas para encontrar el predominante
            const progCount = data.programCounts.get(academic.NOM_PROGRAMA) || 0;
            data.programCounts.set(academic.NOM_PROGRAMA, progCount + 1);
            
            // Agrupar por sede y grupo (como en el primer código)
            const sedeGrupoKey = `${academic.NOMBRE_SEDE}-${academic.GRUPO}`;
            if (!data.sedeGrupoData.has(sedeGrupoKey)) {
                data.sedeGrupoData.set(sedeGrupoKey, {
                    NOMBRE_SEDE: academic.NOMBRE_SEDE,
                    GRUPO: academic.GRUPO,
                    estudiantes: new Set()
                });
            }
            
            // Usar el mismo concepto de concatenación única del primer código
            const uniqueKey = `${academic.ID_ESTUDIANTE}-${academic.COD_ASIGNATURA}`;
            data.sedeGrupoData.get(sedeGrupoKey).estudiantes.add(uniqueKey);
        });
        
        // Paso 5: Construir resultados finales con valores predominantes
        const resultMap = new Map();
        
        processedData.forEach((data, key) => {
            // Encontrar semestre predominante
            let maxSemCount = 0;
            let predominantSemester = null;
            data.semesterCounts.forEach((count, semester) => {
                if (count > maxSemCount) {
                    maxSemCount = count;
                    predominantSemester = semester;
                }
            });
            
            // Encontrar programa predominante
            let maxProgCount = 0;
            let predominantProgram = null;
            data.programCounts.forEach((count, program) => {
                if (count > maxProgCount) {
                    maxProgCount = count;
                    predominantProgram = program;
                }
            });
            
            // Crear resultados para cada combinación sede-grupo
            data.sedeGrupoData.forEach((sedeGrupoInfo, sedeGrupoKey) => {
                const resultKey = `${key}-${sedeGrupoKey}`;
                
                let evaluaciones_completadas = 0;
                
                // Contar evaluaciones completadas usando la misma lógica del primer código
                sedeGrupoInfo.estudiantes.forEach(uniqueStudentKey => {
                    if (evaluationMap.has(uniqueStudentKey)) {
                        evaluaciones_completadas++;
                    }
                });
                
                const total_evaluaciones_esperadas = sedeGrupoInfo.estudiantes.size;
                const evaluaciones_pendientes = total_evaluaciones_esperadas - evaluaciones_completadas;
                
                // Calcular porcentaje como en el primer código
                const porcentaje_completado = total_evaluaciones_esperadas > 0 
                    ? Math.round((evaluaciones_completadas / total_evaluaciones_esperadas) * 100 * 100) / 100
                    : 0;
                
                // Determinar estado de evaluación con la misma lógica del primer código
                let estado_evaluacion;
                if (evaluaciones_pendientes === 0 && total_evaluaciones_esperadas > 0) {
                    estado_evaluacion = 'COMPLETADO';
                } else if (evaluaciones_completadas === 0) {
                    estado_evaluacion = 'NO INICIADO';
                } else {
                    estado_evaluacion = 'EN PROGRESO';
                }
                
                resultMap.set(resultKey, {
                    COD_ASIGNATURA: data.COD_ASIGNATURA,
                    ASIGNATURA: data.ASIGNATURA,
                    ID_DOCENTE: data.ID_DOCENTE,
                    DOCENTE: data.DOCENTE,
                    SEMESTRE_PREDOMINANTE: predominantSemester,
                    PROGRAMA_PREDOMINANTE: predominantProgram,
                    NOMBRE_SEDE: sedeGrupoInfo.NOMBRE_SEDE,
                    GRUPO: sedeGrupoInfo.GRUPO,
                    total_evaluaciones_esperadas,
                    evaluaciones_completadas,
                    evaluaciones_pendientes,
                    porcentaje_completado,
                    estado_evaluacion
                });
            });
        });

        // Paso 6: Convertir a array y ordenar por porcentaje completado (descendente)
        const finalResults = Array.from(resultMap.values());
        finalResults.sort((a, b) => b.porcentaje_completado - a.porcentaje_completado);

        return finalResults;

    } catch (error) {
        console.error('Error in getDocentesAsignaturasModel:', error);
        throw error;
    }
};

const getEstudiantesEvaluadosModel = async (idDocente, codAsignatura, grupo) => {
    // Pool remoto para vista_academica_insitus
    const remotePool = await getRemotePool();
    // Pool local para las demás tablas
    const localPool = await getPool();
    
    // Consulta 1: Obtener estudiantes desde vista_academica_insitus (pool remoto)
    const estudiantesQuery = `
        SELECT DISTINCT ID_ESTUDIANTE
        FROM vista_academica_insitus
        WHERE ID_DOCENTE = ? 
            AND COD_ASIGNATURA = ? 
            AND GRUPO = ?
    `;
    const [estudiantes] = await remotePool.query(estudiantesQuery, [idDocente, codAsignatura, grupo]);
    
    if (estudiantes.length === 0) {
        return {
            total_estudiantes: 0,
            evaluaciones_realizadas: 0,
            evaluaciones_sin_realizar: 0
        };
    }
    
    // Extraer los IDs de estudiantes para la segunda consulta
    const estudianteIds = estudiantes.map(est => est.ID_ESTUDIANTE);
    const placeholders = estudianteIds.map(() => '?').join(',');
    
    // Consulta 2: Obtener evaluaciones desde el pool local
    const evaluacionesQuery = `
        SELECT 
            e.DOCUMENTO_ESTUDIANTE,
            COUNT(DISTINCT ed.ID) as tiene_evaluacion
        FROM evaluaciones e
        LEFT JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
        WHERE e.DOCUMENTO_ESTUDIANTE IN (${placeholders})
            AND e.CODIGO_MATERIA = ?
        GROUP BY e.DOCUMENTO_ESTUDIANTE
    `;
    const [evaluaciones] = await localPool.query(evaluacionesQuery, [...estudianteIds, codAsignatura]);
    
    // Procesar resultados
    const total_estudiantes = estudiantes.length;
    const estudiantesConEvaluacion = new Set(
        evaluaciones
            .filter(ev => ev.tiene_evaluacion > 0)
            .map(ev => ev.DOCUMENTO_ESTUDIANTE)
    );
    
    const evaluaciones_realizadas = estudiantesConEvaluacion.size;
    const evaluaciones_sin_realizar = total_estudiantes - evaluaciones_realizadas;
    
    return {
        total_estudiantes,
        evaluaciones_realizadas,
        evaluaciones_sin_realizar
    };
};

const getAspectosPuntajeModel = async (idDocente) => {
    // Pool para vista_academica_insitus
    const remotePool = await getRemotePool();
    
    // Pool para evaluaciones y tablas relacionadas
    const localPool = await getPool();
    
    try {
        // Paso 1: Obtener datos de la vista académica desde el pool remoto
        const vistaQuery = `
            SELECT 
                ID_DOCENTE, 
                DOCENTE, 
                ID_ESTUDIANTE, 
                COD_ASIGNATURA
            FROM vista_academica_insitus 
            WHERE ID_DOCENTE = ?
        `;
        
        const [vistaData] = await remotePool.query(vistaQuery, [idDocente]);
        
        if (vistaData.length === 0) {
            return []; // No hay datos para este docente
        }
        
        // Extraer los IDs únicos de estudiantes y códigos de asignatura
        const estudiantesIds = [...new Set(vistaData.map(row => row.ID_ESTUDIANTE))];
        const asignaturaCodes = [...new Set(vistaData.map(row => row.COD_ASIGNATURA))];
        
        // Crear placeholders para las consultas IN
        const estudiantesPlaceholders = estudiantesIds.map(() => '?').join(',');
        const asignaturasPlaceholders = asignaturaCodes.map(() => '?').join(',');
        
        // Paso 2: Obtener datos de evaluaciones desde el pool local
        const evaluacionesQuery = `
            SELECT 
                e.DOCUMENTO_ESTUDIANTE,
                e.CODIGO_MATERIA,
                a.ETIQUETA AS ASPECTO,
                a.descripcion,
                cv.PUNTAJE
            FROM evaluaciones e
            JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
            JOIN aspectos_evaluacion a ON ed.ASPECTO_ID = a.ID
            JOIN configuracion_valoracion cv ON ed.VALORACION_ID = cv.VALORACION_ID
            WHERE 
                e.DOCUMENTO_ESTUDIANTE IN (${estudiantesPlaceholders})
                AND e.CODIGO_MATERIA IN (${asignaturasPlaceholders})
        `;
        
        const queryParams = [...estudiantesIds, ...asignaturaCodes];
        const [evaluacionesData] = await localPool.query(evaluacionesQuery, queryParams);
        
        // Paso 3: Combinar los datos y calcular promedios
        const resultMap = new Map();
        
        // Crear un mapa de combinaciones estudiante-asignatura válidas
        const validCombinations = new Set();
        vistaData.forEach(row => {
            validCombinations.add(`${row.ID_ESTUDIANTE}-${row.COD_ASIGNATURA}`);
        });
        
        // Procesar evaluaciones y calcular promedios por aspecto
        evaluacionesData.forEach(eval => {
            const combination = `${eval.DOCUMENTO_ESTUDIANTE}-${eval.CODIGO_MATERIA}`;
            
            // Solo procesar si la combinación es válida según la vista académica
            if (validCombinations.has(combination)) {
                const key = eval.ASPECTO;
                
                if (!resultMap.has(key)) {
                    resultMap.set(key, {
                        ID_DOCENTE: idDocente,
                        DOCENTE: vistaData[0].DOCENTE, // Tomar el nombre del primer registro
                        ASPECTO: eval.ASPECTO,
                        descripcion: eval.descripcion,
                        puntajes: []
                    });
                }
                
                // Convertir puntaje a número antes de agregarlo
                const puntajeNum = parseFloat(eval.PUNTAJE) || 0;
                resultMap.get(key).puntajes.push(puntajeNum);
            }
        });
        
        // Debug: Mostrar información de los puntajes encontrados
        console.log('Datos para debugging:', {
            docenteId: idDocente,
            vistaDataCount: vistaData.length,
            evaluacionesDataCount: evaluacionesData.length,
            validCombinationsCount: validCombinations.size,
            aspectosEncontrados: Array.from(resultMap.keys()),
            puntajesPorAspecto: Array.from(resultMap.entries()).map(([aspecto, data]) => ({
                aspecto,
                cantidadPuntajes: data.puntajes.length,
                puntajes: data.puntajes
            }))
        });
        
        // Paso 4: Calcular promedios y formatear resultado final
        const result = Array.from(resultMap.values()).map(item => {
            let promedio = 0;
            if (item.puntajes.length > 0) {
                const suma = item.puntajes.reduce((sum, puntaje) => {
                    // Asegurar que el puntaje sea numérico
                    const puntajeNum = parseFloat(puntaje) || 0;
                    return sum + puntajeNum;
                }, 0);
                promedio = parseFloat((suma / item.puntajes.length).toFixed(2));
            }
            
            return {
                ID_DOCENTE: item.ID_DOCENTE,
                DOCENTE: item.DOCENTE,
                ASPECTO: item.ASPECTO,
                descripcion: item.descripcion,
                PUNTAJE_PROMEDIO: promedio
            };
        });
        
        // Ordenar por aspecto
        result.sort((a, b) => a.ASPECTO.localeCompare(b.ASPECTO));
        
        return result;
        
    } catch (error) {
        console.error('Error en getAspectosPuntajeModel:', error);
        throw error;
    }
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