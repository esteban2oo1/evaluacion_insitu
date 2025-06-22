const { getPool, getRemotePool } = require('../../../../db');

// ======================================
// UTILIDADES COMPARTIDAS
// ======================================

/**
 * Construye las condiciones WHERE dinámicamente para filtrado académico
 * @param {Object} filters - Filtros de consulta
 * @param {string} alias - Alias de la tabla (por defecto 'va')
 * @returns {Object} - Objeto con clause y params
 */
const buildWhereClause = (filters, alias = 'va') => {
  const { periodo, nombreSede, nomPrograma, semestre, grupo } = filters;
  let conditions = [];
  let params = [];
  
  if (periodo) {
    conditions.push(`${alias}.PERIODO = ?`);
    params.push(periodo);
  }
  
  if (nombreSede) {
    conditions.push(`${alias}.NOMBRE_SEDE = ?`);
    params.push(nombreSede);
  }
  
  if (nomPrograma) {
    conditions.push(`${alias}.NOM_PROGRAMA = ?`);
    params.push(nomPrograma);
  }
  
  if (semestre) {
    conditions.push(`${alias}.SEMESTRE = ?`);
    params.push(semestre);
  }
  
  if (grupo) {
    conditions.push(`${alias}.GRUPO = ?`);
    params.push(grupo);
  }
  
  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};

/**
 * Obtiene datos académicos filtrados de la vista remota
 * @param {Object} filters - Filtros de consulta
 * @param {Array} campos - Campos a seleccionar
 * @returns {Array} - Datos académicos filtrados
 */
const getAcademicData = async (filters, campos = ['ID_ESTUDIANTE', 'COD_ASIGNATURA', 'ID_DOCENTE']) => {
  const remotePool = await getRemotePool();
  const whereClause = buildWhereClause(filters, 'va');
  
  const query = `
    SELECT ${campos.join(', ')}
    FROM vista_academica_insitus va
    ${whereClause.clause}
  `;
  
  const [data] = await remotePool.query(query, whereClause.params);
  return data;
};

/**
 * Crea placeholders para consultas IN con arrays simples
 * @param {Array} items - Array de items
 * @returns {Object} - Placeholders y parámetros
 */
const createSimpleInPlaceholders = (items) => {
  const placeholders = items.map(() => '?').join(', ');
  return { placeholders, params: items };
};

/**
 * Crea placeholders para consultas IN con pares de valores
 * @param {Array} items - Array de items con estudiante y asignatura
 * @returns {Object} - Placeholders y parámetros planos
 */
const createInPlaceholders = (items) => {
  const placeholders = items.map(() => '(?, ?)').join(', ');
  const params = items.flatMap(item => [
    item.estudiante || item.ID_ESTUDIANTE, 
    item.asignatura || item.COD_ASIGNATURA
  ]);
  return { placeholders, params };
};

/**
 * Calcula el promedio con redondeo a 2 decimales
 * @param {Array} valores - Array de números
 * @returns {number} - Promedio redondeado
 */
const calcularPromedio = (valores) => {
  if (valores.length === 0) return 0.00;
  const suma = valores.reduce((sum, valor) => sum + parseFloat(valor || 0), 0);
  return parseFloat((suma / valores.length).toFixed(2));
};

/**
 * Calcula porcentaje con redondeo a 2 decimales
 * @param {number} numerador 
 * @param {number} denominador 
 * @returns {number} - Porcentaje redondeado
 */
const calcularPorcentaje = (numerador, denominador) => {
  if (denominador === 0) return 0;
  return Math.round((numerador / denominador) * 100 * 100) / 100;
};

/**
 * Obtiene evaluaciones completadas del pool principal
 * @param {number} idConfiguracion - ID de configuración
 * @param {Array} combinaciones - Array de combinaciones estudiante-asignatura
 * @returns {Map} - Mapa de evaluaciones completadas
 */
const getCompletedEvaluationsMap = async (idConfiguracion, combinaciones) => {
  if (combinaciones.length === 0) return new Map();
  
  const pool = await getPool();
  const { placeholders, params } = createInPlaceholders(combinaciones);
  
  const evaluacionesQuery = `
    SELECT 
      e.DOCUMENTO_ESTUDIANTE,
      e.CODIGO_MATERIA,
      ed.ID as detalle_id
    FROM evaluaciones e
    LEFT JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
    WHERE e.ID_CONFIGURACION = ?
      AND (e.DOCUMENTO_ESTUDIANTE, e.CODIGO_MATERIA) IN (${placeholders})
  `;
  
  const evaluacionesParams = [idConfiguracion, ...params];
  const [evaluacionesData] = await pool.query(evaluacionesQuery, evaluacionesParams);
  
  const evaluationMap = new Map();
  evaluacionesData.forEach(row => {
    const key = `${row.DOCUMENTO_ESTUDIANTE}-${row.CODIGO_MATERIA}`;
    // Solo contar como completada si tiene evaluacion_detalle
    if (row.detalle_id !== null) {
      evaluationMap.set(key, true);
    }
  });
  
  return evaluationMap;
};

// ======================================
// FUNCIONES DE PROCESAMIENTO DE DATOS
// ======================================

/**
 * Encuentra el valor predominante en un Map de contadores
 * @param {Map} countsMap - Map con contadores
 * @returns {*} - Valor predominante
 */
const findPredominantValue = (countsMap) => {
  let maxCount = 0;
  let predominantValue = null;
  
  countsMap.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      predominantValue = value;
    }
  });
  
  return predominantValue;
};

/**
 * Procesa datos académicos para docentes-asignaturas
 * @param {Array} academicData - Datos académicos
 * @returns {Map} - Mapa procesado de docentes-asignaturas
 */
const processAcademicDataForTeachersAssignments = (academicData) => {
  const processedData = new Map();
  
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
    
    // Agrupar por sede y grupo
    const sedeGrupoKey = `${academic.NOMBRE_SEDE}-${academic.GRUPO}`;
    if (!data.sedeGrupoData.has(sedeGrupoKey)) {
      data.sedeGrupoData.set(sedeGrupoKey, {
        NOMBRE_SEDE: academic.NOMBRE_SEDE,
        GRUPO: academic.GRUPO,
        estudiantes: new Set()
      });
    }
    
    // Agregar estudiante único por asignatura
    const uniqueKey = `${academic.ID_ESTUDIANTE}-${academic.COD_ASIGNATURA}`;
    data.sedeGrupoData.get(sedeGrupoKey).estudiantes.add(uniqueKey);
  });
  
  return processedData;
};

/**
 * Construye resultados finales para docentes-asignaturas
 * @param {Map} processedData - Datos procesados
 * @param {Map} evaluationMap - Mapa de evaluaciones completadas
 * @returns {Array} - Array de resultados finales
 */
const buildTeachersAssignmentsResults = (processedData, evaluationMap) => {
  const resultMap = new Map();
  
  processedData.forEach((data, key) => {
    // Encontrar valores predominantes
    const predominantSemester = findPredominantValue(data.semesterCounts);
    const predominantProgram = findPredominantValue(data.programCounts);
    
    // Crear resultados para cada combinación sede-grupo
    data.sedeGrupoData.forEach((sedeGrupoInfo, sedeGrupoKey) => {
      const resultKey = `${key}-${sedeGrupoKey}`;
      
      let evaluaciones_completadas = 0;
      
      // Contar evaluaciones completadas
      sedeGrupoInfo.estudiantes.forEach(uniqueStudentKey => {
        if (evaluationMap.has(uniqueStudentKey)) {
          evaluaciones_completadas++;
        }
      });
      
      const total_evaluaciones_esperadas = sedeGrupoInfo.estudiantes.size;
      const evaluaciones_pendientes = total_evaluaciones_esperadas - evaluaciones_completadas;
      const porcentaje_completado = calcularPorcentaje(evaluaciones_completadas, total_evaluaciones_esperadas);
      
      // Determinar estado de evaluación
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
  
  return Array.from(resultMap.values());
};

// ======================================
// FUNCIONES PRINCIPALES DE NEGOCIO
// ======================================

/**
 * Obtiene datos de docentes y asignaturas con estadísticas
 */
const getDocentesAsignaturasModel = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  try {
    const filters = { periodo, nombreSede, nomPrograma, semestre, grupo };
    
    // Obtener datos académicos completos
    const academicData = await getAcademicData(filters, [
      'COD_ASIGNATURA', 'ASIGNATURA', 'ID_DOCENTE', 'DOCENTE',
      'SEMESTRE', 'NOM_PROGRAMA', 'NOMBRE_SEDE', 'GRUPO', 'ID_ESTUDIANTE'
    ]);

    if (academicData.length === 0) {
      return [];
    }

    // Crear combinaciones únicas estudiante-asignatura para obtener evaluaciones
    const combinaciones = academicData
      .map(row => ({ estudiante: row.ID_ESTUDIANTE, asignatura: row.COD_ASIGNATURA }))
      .filter((item, index, self) =>
        index === self.findIndex(t => t.estudiante === item.estudiante && t.asignatura === item.asignatura)
      );

    // Obtener mapa de evaluaciones completadas
    const evaluationMap = await getCompletedEvaluationsMap(idConfiguracion, combinaciones);

    // Procesar datos académicos
    const processedData = processAcademicDataForTeachersAssignments(academicData);

    // Construir y ordenar resultados finales
    const finalResults = buildTeachersAssignmentsResults(processedData, evaluationMap);
    finalResults.sort((a, b) => b.porcentaje_completado - a.porcentaje_completado);

    return finalResults;

  } catch (error) {
    console.error('Error in getDocentesAsignaturasModel:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de estudiantes evaluados por docente
 */
const getEstudiantesEvaluadosModel = async (idDocente, codAsignatura, grupo) => {
  try {
    const remotePool = await getRemotePool();
    const localPool = await getPool();
    
    // Obtener estudiantes desde vista_academica_insitus
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
    
    // Crear combinaciones para consulta de evaluaciones
    const combinaciones = estudiantes.map(est => ({
      estudiante: est.ID_ESTUDIANTE,
      asignatura: codAsignatura
    }));
    
    const { placeholders, params } = createInPlaceholders(combinaciones);
    
    // Obtener evaluaciones completadas
    const evaluacionesQuery = `
      SELECT 
        e.DOCUMENTO_ESTUDIANTE,
        COUNT(DISTINCT ed.ID) as tiene_evaluacion
      FROM evaluaciones e
      LEFT JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
      WHERE (e.DOCUMENTO_ESTUDIANTE, e.CODIGO_MATERIA) IN (${placeholders})
      GROUP BY e.DOCUMENTO_ESTUDIANTE
    `;
    const [evaluaciones] = await localPool.query(evaluacionesQuery, params);
    
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

  } catch (error) {
    console.error('Error in getEstudiantesEvaluadosModel:', error);
    throw error;
  }
};

/**
 * Obtiene puntajes promedio por aspectos de evaluación para un docente
 */
const getAspectosPuntajeModel = async (idDocente) => {
  try {
    const remotePool = await getRemotePool();
    const localPool = await getPool();
    
    // Obtener datos de la vista académica
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
      return [];
    }
    
    // Crear combinaciones únicas estudiante-asignatura
    const combinaciones = vistaData
      .map(row => ({ estudiante: row.ID_ESTUDIANTE, asignatura: row.COD_ASIGNATURA }))
      .filter((item, index, self) =>
        index === self.findIndex(t => t.estudiante === item.estudiante && t.asignatura === item.asignatura)
      );

    if (combinaciones.length === 0) {
      return [];
    }

    const { placeholders, params } = createInPlaceholders(combinaciones);
    
    // Obtener datos de evaluaciones con aspectos y puntajes
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
      WHERE (e.DOCUMENTO_ESTUDIANTE, e.CODIGO_MATERIA) IN (${placeholders})
    `;
    
    const [evaluacionesData] = await localPool.query(evaluacionesQuery, params);
    
    // Procesar evaluaciones y calcular promedios por aspecto
    const resultMap = new Map();
    
    evaluacionesData.forEach(eval => {
      const key = eval.ASPECTO;
      
      if (!resultMap.has(key)) {
        resultMap.set(key, {
          ID_DOCENTE: idDocente,
          DOCENTE: vistaData[0].DOCENTE,
          ASPECTO: eval.ASPECTO,
          descripcion: eval.descripcion,
          puntajes: []
        });
      }
      
      const puntajeNum = parseFloat(eval.PUNTAJE) || 0;
      resultMap.get(key).puntajes.push(puntajeNum);
    });
    
    // Calcular promedios y formatear resultado final
    const result = Array.from(resultMap.values()).map(item => ({
      ID_DOCENTE: item.ID_DOCENTE,
      DOCENTE: item.DOCENTE,
      ASPECTO: item.ASPECTO,
      descripcion: item.descripcion,
      PUNTAJE_PROMEDIO: calcularPromedio(item.puntajes)
    }));
    
    // Ordenar por aspecto
    result.sort((a, b) => a.ASPECTO.localeCompare(b.ASPECTO));
    
    return result;
    
  } catch (error) {
    console.error('Error en getAspectosPuntajeModel:', error);
    throw error;
  }
};

module.exports = {
  getDocentesAsignaturasModel,
  getEstudiantesEvaluadosModel,
  getAspectosPuntajeModel
};