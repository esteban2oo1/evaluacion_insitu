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
 * Crea placeholders para consultas IN con pares de valores
 * @param {Array} items - Array de items
 * @returns {Object} - Placeholders y parámetros planos
 */
const createInPlaceholders = (items) => {
  const placeholders = items.map(() => '(?, ?)').join(', ');
  const params = items.flatMap(item => [item.estudiante || item.ID_ESTUDIANTE, item.asignatura || item.COD_ASIGNATURA]);
  return { placeholders, params };
};

/**
 * Calcula el promedio con redondeo a 2 decimales
 * @param {Array} valores - Array de números
 * @returns {number} - Promedio redondeado
 */
const calcularPromedio = (valores) => {
  if (valores.length === 0) return 0.00;
  const suma = valores.reduce((sum, valor) => sum + valor, 0);
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

// ======================================
// FUNCIONES DE PROCESAMIENTO DE DATOS
// ======================================

/**
 * Procesa datos académicos y crea mapas para estadísticas
 * @param {Array} academicData - Datos académicos
 * @returns {Object} - Mapas de estudiantes, evaluaciones, docentes y relaciones
 */
const processAcademicDataForStats = (academicData) => {
  const estudiantes = new Set();
  const evaluaciones = new Set();
  const docentes = new Set();
  const estudianteAsignatura = [];
  
  academicData.forEach(row => {
    estudiantes.add(row.ID_ESTUDIANTE);
    docentes.add(row.ID_DOCENTE);
    const evalKey = `${row.ID_ESTUDIANTE}-${row.COD_ASIGNATURA}`;
    evaluaciones.add(evalKey);
    estudianteAsignatura.push({
      estudiante: row.ID_ESTUDIANTE,
      asignatura: row.COD_ASIGNATURA,
      docente: row.ID_DOCENTE,
      key: evalKey
    });
  });
  
  return { estudiantes, evaluaciones, docentes, estudianteAsignatura };
};

/**
 * Obtiene evaluaciones completadas del pool principal
 * @param {number} idConfiguracion - ID de configuración
 * @param {Set} evaluaciones - Set de evaluaciones esperadas
 * @returns {Object} - Sets de evaluaciones completadas y pendientes
 */
const getCompletedEvaluations = async (idConfiguracion, evaluaciones) => {
  const pool = await getPool();
  
  const evaluacionesQuery = `
    SELECT 
      e.DOCUMENTO_ESTUDIANTE,
      e.CODIGO_MATERIA,
      ed.ID as detalle_id
    FROM evaluaciones e
    LEFT JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
    WHERE e.ID_CONFIGURACION = ?
      AND CONCAT(e.DOCUMENTO_ESTUDIANTE, '-', e.CODIGO_MATERIA) IN (${Array(evaluaciones.size).fill('?').join(',')})
  `;
  
  const evaluacionesParams = [idConfiguracion, ...Array.from(evaluaciones)];
  const [evaluacionesData] = await pool.query(evaluacionesQuery, evaluacionesParams);
  
  const evaluacionesCompletadas = new Set();
  const evaluacionesPendientes = new Set();
  
  evaluacionesData.forEach(row => {
    const evalKey = `${row.DOCUMENTO_ESTUDIANTE}-${row.CODIGO_MATERIA}`;
    if (row.detalle_id) {
      evaluacionesCompletadas.add(evalKey);
    }
  });
  
  evaluaciones.forEach(evalKey => {
    if (!evaluacionesCompletadas.has(evalKey)) {
      evaluacionesPendientes.add(evalKey);
    }
  });
  
  return { evaluacionesCompletadas, evaluacionesPendientes };
};

/**
 * Calcula docentes completamente evaluados
 * @param {Set} docentes - Set de docentes
 * @param {Array} estudianteAsignatura - Relaciones estudiante-asignatura-docente
 * @param {Set} evaluacionesCompletadas - Set de evaluaciones completadas
 * @returns {Set} - Set de docentes evaluados
 */
const calculateEvaluatedTeachers = (docentes, estudianteAsignatura, evaluacionesCompletadas) => {
  const docentesEvaluados = new Set();
  
  docentes.forEach(docente => {
    const evaluacionesDocente = estudianteAsignatura.filter(ea => ea.docente === docente);
    const totalEvaluacionesDocente = evaluacionesDocente.length;
    const completadasDocente = evaluacionesDocente.filter(ea => 
      evaluacionesCompletadas.has(ea.key)
    ).length;
    
    if (totalEvaluacionesDocente > 0 && totalEvaluacionesDocente === completadasDocente) {
      docentesEvaluados.add(docente);
    }
  });
  
  return docentesEvaluados;
};

// ======================================
// FUNCIONES DE PROCESAMIENTO PARA RANKING/PODIO
// ======================================

/**
 * Obtiene evaluaciones con puntajes para ranking/podio
 * @param {number} idConfiguracion - ID de configuración
 * @param {Array} estudiantesAsignaturasUnicos - Combinaciones únicas estudiante-asignatura
 * @returns {Array} - Datos de evaluaciones con puntajes
 */
const getEvaluationsWithScores = async (idConfiguracion, estudiantesAsignaturasUnicos) => {
  if (estudiantesAsignaturasUnicos.length === 0) return [];
  
  const pool = await getPool();
  const { placeholders, params } = createInPlaceholders(
    estudiantesAsignaturasUnicos.map(ea => ({
      estudiante: ea.estudiante,
      asignatura: ea.asignatura
    }))
  );

  const evaluacionesQuery = `
    SELECT 
      e.DOCUMENTO_ESTUDIANTE,
      e.CODIGO_MATERIA,
      cv.PUNTAJE,
      ca.ASPECTO_ID
    FROM evaluaciones e
    JOIN evaluacion_detalle ed ON e.ID = ed.EVALUACION_ID
    JOIN configuracion_valoracion cv ON ed.VALORACION_ID = cv.VALORACION_ID
    JOIN configuracion_aspecto ca ON ed.ASPECTO_ID = ca.ID
    WHERE e.ID_CONFIGURACION = ?
      AND (e.DOCUMENTO_ESTUDIANTE, e.CODIGO_MATERIA) IN (${placeholders})
      AND ca.ACTIVO = TRUE
      AND cv.ACTIVO = TRUE
  `;

  const [evaluacionesData] = await pool.query(evaluacionesQuery, [idConfiguracion, ...params]);
  return evaluacionesData;
};

/**
 * Inicializa la estructura de datos para docentes
 * @param {Array} vistaData - Datos de la vista académica
 * @returns {Map} - Mapa de docentes con datos inicializados
 */
const initializeTeachersMap = (vistaData) => {
  const docentesMap = new Map();

  vistaData.forEach(row => {
    const key = `${row.ID_DOCENTE}`;
    if (!docentesMap.has(key)) {
      docentesMap.set(key, {
        ID_DOCENTE: row.ID_DOCENTE,
        DOCENTE: row.DOCENTE,
        PERIODO: row.PERIODO,
        NOMBRE_SEDE: row.NOMBRE_SEDE,
        NOM_PROGRAMA: row.NOM_PROGRAMA,
        SEMESTRE: row.SEMESTRE,
        GRUPO: row.GRUPO,
        asignaturas: new Set(),
        estudiantes: new Set(),
        evaluaciones_esperadas: new Set(),
        evaluaciones_realizadas: new Set(),
        puntajes: [],
        total_respuestas: 0,
        estudiante_asignatura_docente: new Map()
      });
    }

    const docente = docentesMap.get(key);
    docente.asignaturas.add(row.COD_ASIGNATURA);
    docente.estudiantes.add(row.ID_ESTUDIANTE);
    
    const evaluacionKey = `${row.ID_ESTUDIANTE}-${row.COD_ASIGNATURA}`;
    docente.evaluaciones_esperadas.add(evaluacionKey);
    docente.estudiante_asignatura_docente.set(evaluacionKey, true);
  });

  return docentesMap;
};

/**
 * Procesa evaluaciones y las asocia con docentes
 * @param {Map} docentesMap - Mapa de docentes
 * @param {Array} evaluacionesData - Datos de evaluaciones
 */
const processEvaluationsForTeachers = (docentesMap, evaluacionesData) => {
  evaluacionesData.forEach(eval => {
    const estudianteAsignatura = `${eval.DOCUMENTO_ESTUDIANTE}-${eval.CODIGO_MATERIA}`;
    
    for (let [docenteKey, docente] of docentesMap) {
      if (docente.estudiante_asignatura_docente.has(estudianteAsignatura)) {
        docente.evaluaciones_realizadas.add(estudianteAsignatura);
        docente.total_respuestas++;
        
        const puntaje = parseFloat(eval.PUNTAJE);
        if (!isNaN(puntaje)) {
          docente.puntajes.push(puntaje);
        }
        
        break;
      }
    }
  });
};

/**
 * Calcula métricas finales para docentes
 * @param {Map} docentesMap - Mapa de docentes con datos procesados
 * @returns {Array} - Array de docentes con métricas calculadas
 */
const calculateTeacherMetrics = (docentesMap) => {
  return Array.from(docentesMap.values())
    .map(docente => {
      const evaluaciones_esperadas = docente.evaluaciones_esperadas.size;
      const evaluaciones_realizadas = docente.evaluaciones_realizadas.size;
      const evaluaciones_pendientes = evaluaciones_esperadas - evaluaciones_realizadas;
      const total_estudiantes = docente.estudiantes.size;
      const total_asignaturas = docente.asignaturas.size;
      
      const promedio_general = calcularPromedio(docente.puntajes);
      
      const respuestas_por_estudiante = total_estudiantes > 0 
        ? parseFloat((docente.total_respuestas / total_estudiantes).toFixed(2))
        : 0;
      
      const eficiencia_respuestas = evaluaciones_realizadas > 0 
        ? parseFloat((docente.total_respuestas / evaluaciones_realizadas).toFixed(2))
        : 0;

      return {
        ID_DOCENTE: docente.ID_DOCENTE,
        DOCENTE: docente.DOCENTE,
        PERIODO: docente.PERIODO,
        NOMBRE_SEDE: docente.NOMBRE_SEDE,
        NOM_PROGRAMA: docente.NOM_PROGRAMA,
        SEMESTRE: docente.SEMESTRE,
        GRUPO: docente.GRUPO,
        TOTAL_ESTUDIANTES: total_estudiantes,
        TOTAL_ASIGNATURAS: total_asignaturas,
        PROMEDIO_GENERAL: promedio_general,
        TOTAL_RESPUESTAS: docente.total_respuestas,
        EVALUACIONES_ESPERADAS: evaluaciones_esperadas,
        EVALUACIONES_REALIZADAS: evaluaciones_realizadas,
        EVALUACIONES_PENDIENTES: evaluaciones_pendientes,
        RESPUESTAS_POR_ESTUDIANTE: respuestas_por_estudiante,
        EFICIENCIA_RESPUESTAS: eficiencia_respuestas
      };
    })
    .filter(docente => docente.TOTAL_RESPUESTAS > 0);
};

/**
 * Ordena docentes para ranking
 * @param {Array} docentes - Array de docentes con métricas
 * @returns {Array} - Docentes ordenados para ranking
 */
const sortTeachersForRanking = (docentes) => {
  return docentes.sort((a, b) => {
    if (b.PROMEDIO_GENERAL !== a.PROMEDIO_GENERAL) {
      return b.PROMEDIO_GENERAL - a.PROMEDIO_GENERAL;
    }
    if (b.RESPUESTAS_POR_ESTUDIANTE !== a.RESPUESTAS_POR_ESTUDIANTE) {
      return b.RESPUESTAS_POR_ESTUDIANTE - a.RESPUESTAS_POR_ESTUDIANTE;
    }
    return a.ID_DOCENTE - b.ID_DOCENTE;
  });
};

/**
 * Crea el podio con mejores y peores docentes
 * @param {Array} docentes - Array de docentes con métricas
 * @returns {Array} - Podio con top mejores y peores
 */
const createPodium = (docentes) => {
  if (docentes.length === 0) return [];

  const ordenadosPorPromedio = [...docentes].sort((a, b) => {
    if (b.PROMEDIO_GENERAL !== a.PROMEDIO_GENERAL) {
      return b.PROMEDIO_GENERAL - a.PROMEDIO_GENERAL;
    }
    return a.ID_DOCENTE - b.ID_DOCENTE;
  });
  
  const topMejores = ordenadosPorPromedio.slice(0, 3).map((docente, index) => ({
    ...docente,
    POSICION: `TOP ${index + 1} MEJOR`
  }));

  let topPeores = [];
  if (ordenadosPorPromedio.length > 3) {
    const docentesParaPeores = ordenadosPorPromedio.filter(docente => 
      !topMejores.some(mejor => mejor.ID_DOCENTE === docente.ID_DOCENTE)
    );
    
    topPeores = docentesParaPeores
      .slice(-3)
      .reverse()
      .map((docente, index) => ({
        ...docente,
        POSICION: `TOP ${index + 1} PEOR`
      }));
  }

  return [...topMejores, ...topPeores];
};

// ======================================
// FUNCIONES PRINCIPALES DE NEGOCIO
// ======================================

/**
 * Obtiene estadísticas del dashboard
 */
const getDashboardStats = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  const filters = { periodo, nombreSede, nomPrograma, semestre, grupo };
  
  // Obtener datos académicos
  const academicData = await getAcademicData(filters);
  
  if (academicData.length === 0) {
    return {
      total_estudiantes: 0,
      total_evaluaciones: 0,
      evaluaciones_completadas: 0,
      evaluaciones_pendientes: 0,
      porcentaje_completado: 0,
      docentes_evaluados: 0,
      total_docentes: 0,
      porcentaje_docentes_evaluados: 0
    };
  }
  
  // Procesar datos académicos
  const { estudiantes, evaluaciones, docentes, estudianteAsignatura } = processAcademicDataForStats(academicData);
  
  // Obtener evaluaciones completadas
  const { evaluacionesCompletadas, evaluacionesPendientes } = await getCompletedEvaluations(idConfiguracion, evaluaciones);
  
  // Calcular docentes evaluados
  const docentesEvaluados = calculateEvaluatedTeachers(docentes, estudianteAsignatura, evaluacionesCompletadas);
  
  // Calcular estadísticas finales
  const totalEstudiantes = estudiantes.size;
  const totalEvaluaciones = evaluaciones.size;
  const totalEvaluacionesCompletadas = evaluacionesCompletadas.size;
  const totalEvaluacionesPendientes = evaluacionesPendientes.size;
  const porcentajeCompletado = calcularPorcentaje(totalEvaluacionesCompletadas, totalEvaluaciones);
  
  const totalDocentes = docentes.size;
  const totalDocentesEvaluados = docentesEvaluados.size;
  const porcentajeDocentesEvaluados = calcularPorcentaje(totalDocentesEvaluados, totalDocentes);
  
  return {
    total_estudiantes: totalEstudiantes,
    total_evaluaciones: totalEvaluaciones,
    evaluaciones_completadas: totalEvaluacionesCompletadas,
    evaluaciones_pendientes: totalEvaluacionesPendientes,
    porcentaje_completado: porcentajeCompletado,
    docentes_evaluados: totalDocentesEvaluados,
    total_docentes: totalDocentes,
    porcentaje_docentes_evaluados: porcentajeDocentesEvaluados
  };
};

/**
 * Obtiene el promedio por aspectos de evaluación
 */
const getAspectosPromedio = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  const pool = await getPool();
  const filters = { periodo, nombreSede, nomPrograma, semestre, grupo };
  
  // Obtener datos académicos filtrados
  const vistaData = await getAcademicData(filters, ['ID_ESTUDIANTE', 'COD_ASIGNATURA']);
  
  if (vistaData.length === 0) {
    return [];
  }
  
  // Crear placeholders para la consulta IN
  const { placeholders, params } = createInPlaceholders(vistaData);
  
  const mainQuery = `
    SELECT 
      ae.ETIQUETA AS ASPECTO,
      ROUND(
        AVG(cv.PUNTAJE), 2
      ) AS PROMEDIO_GENERAL
    FROM evaluaciones e
    JOIN configuracion_aspecto ca 
      ON e.ID_CONFIGURACION = ca.CONFIGURACION_EVALUACION_ID
    JOIN aspectos_evaluacion ae 
      ON ca.ASPECTO_ID = ae.ID
    JOIN evaluacion_detalle ed 
      ON e.ID = ed.EVALUACION_ID AND ed.ASPECTO_ID = ca.ID
    JOIN configuracion_valoracion cv 
      ON ed.VALORACION_ID = cv.VALORACION_ID
    WHERE ca.ACTIVO = TRUE
      AND cv.ACTIVO = TRUE
      AND e.ID_CONFIGURACION = ?
      AND (e.DOCUMENTO_ESTUDIANTE, e.CODIGO_MATERIA) IN (${placeholders})
    GROUP BY ae.ID, ae.ETIQUETA 
    ORDER BY ae.ID;
  `;
  
  const mainParams = [idConfiguracion, ...params];
  const [aspectos] = await pool.query(mainQuery, mainParams);
  return aspectos;
};

/**
 * Obtiene el ranking completo de docentes
 */
const getRankingDocentes = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  try {
    const filters = { periodo, nombreSede, nomPrograma, semestre, grupo };
    
    // Obtener datos académicos completos
    const vistaData = await getAcademicData(filters, [
      'ID_DOCENTE', 'DOCENTE', 'ID_ESTUDIANTE', 'COD_ASIGNATURA',
      'PERIODO', 'NOMBRE_SEDE', 'NOM_PROGRAMA', 'SEMESTRE', 'GRUPO'
    ]);

    if (vistaData.length === 0) {
      console.log('No se encontraron datos en vista_academica_insitus');
      return [];
    }

    console.log(`Se encontraron ${vistaData.length} registros en vista_academica_insitus`);

    // Crear lista de estudiantes y asignaturas únicas
    const estudiantesAsignaturasUnicos = vistaData
      .map(row => ({ estudiante: row.ID_ESTUDIANTE, asignatura: row.COD_ASIGNATURA }))
      .filter((item, index, self) =>
        index === self.findIndex(t => t.estudiante === item.estudiante && t.asignatura === item.asignatura)
      );

    console.log(`Combinaciones únicas estudiante-asignatura: ${estudiantesAsignaturasUnicos.length}`);

    // Obtener evaluaciones con puntajes
    const evaluacionesData = await getEvaluationsWithScores(idConfiguracion, estudiantesAsignaturasUnicos);
    console.log(`Se encontraron ${evaluacionesData.length} respuestas de evaluación`);

    // Inicializar y procesar datos de docentes
    const docentesMap = initializeTeachersMap(vistaData);
    console.log('Docentes inicializados:', docentesMap.size);

    // Procesar evaluaciones para docentes
    processEvaluationsForTeachers(docentesMap, evaluacionesData);

    // Calcular métricas y crear ranking
    const docentes = calculateTeacherMetrics(docentesMap);
    const ranking = sortTeachersForRanking(docentes);

    console.log(`Ranking final: ${ranking.length} docentes`);
    return ranking;

  } catch (error) {
    console.error("Error al obtener el ranking de docentes: ", error);
    throw error;
  }
};

/**
 * Obtiene el podio de mejores y peores docentes
 */
const getPodioDocentes = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  try {
    const filters = { periodo, nombreSede, nomPrograma, semestre, grupo };
    
    // Obtener datos académicos completos
    const vistaData = await getAcademicData(filters, [
      'ID_DOCENTE', 'DOCENTE', 'ID_ESTUDIANTE', 'COD_ASIGNATURA',
      'PERIODO', 'NOMBRE_SEDE', 'NOM_PROGRAMA', 'SEMESTRE', 'GRUPO'
    ]);

    if (vistaData.length === 0) {
      console.log('No se encontraron datos en vista_academica_insitus para podio');
      return [];
    }

    console.log(`Se encontraron ${vistaData.length} registros para podio`);

    // Crear lista de estudiantes y asignaturas únicas
    const estudiantesAsignaturasUnicos = vistaData
      .map(row => ({ estudiante: row.ID_ESTUDIANTE, asignatura: row.COD_ASIGNATURA }))
      .filter((item, index, self) =>
        index === self.findIndex(t => t.estudiante === item.estudiante && t.asignatura === item.asignatura)
      );

    // Obtener evaluaciones con puntajes
    const evaluacionesData = await getEvaluationsWithScores(idConfiguracion, estudiantesAsignaturasUnicos);
    console.log(`Se encontraron ${evaluacionesData.length} respuestas de evaluación (Podio)`);

    // Inicializar y procesar datos de docentes
    const docentesMap = initializeTeachersMap(vistaData);
    processEvaluationsForTeachers(docentesMap, evaluacionesData);

    // Calcular métricas y crear podio
    const docentes = calculateTeacherMetrics(docentesMap);
    const podio = createPodium(docentes);

    console.log(`Podio creado con ${podio.length} docentes`);
    return podio;

  } catch (error) {
    console.error("Error al obtener el podio de docentes: ", error);
    throw error;
  }
};

module.exports = {
  getDashboardStats,
  getAspectosPromedio,
  getRankingDocentes,
  getPodioDocentes
};