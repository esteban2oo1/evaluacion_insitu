const { getPool, getRemotePool } = require('../../../../db');

const getDashboardStats = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo}) => {
  // Obtener ambos pools
  const pool = await getPool(); // Para evaluaciones y evaluacion_detalle
  const remotePool = await getRemotePool(); // Para vista_academica_insitus
  
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

  // Primero obtenemos los datos académicos del remote pool
  const academicWhere = buildWhereClause('va');
  
  const academicDataQuery = `
    SELECT 
      ID_ESTUDIANTE,
      COD_ASIGNATURA,
      ID_DOCENTE
    FROM vista_academica_insitus va
    ${academicWhere.clause}
  `;
  
  const [academicData] = await remotePool.query(academicDataQuery, academicWhere.params);
  
  // Si no hay datos académicos, retornar estadísticas vacías
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
  
  // Crear mapas para facilitar el procesamiento
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
  
  // Ahora consultamos las evaluaciones del pool principal
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
  
  // Procesar resultados de evaluaciones
  const evaluacionesCompletadas = new Set();
  const evaluacionesPendientes = new Set();
  
  evaluacionesData.forEach(row => {
    const evalKey = `${row.DOCUMENTO_ESTUDIANTE}-${row.CODIGO_MATERIA}`;
    if (row.detalle_id) {
      evaluacionesCompletadas.add(evalKey);
    }
  });
  
  // Identificar evaluaciones pendientes
  evaluaciones.forEach(evalKey => {
    if (!evaluacionesCompletadas.has(evalKey)) {
      evaluacionesPendientes.add(evalKey);
    }
  });
  
  // Calcular docentes evaluados
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
  
  // Calcular estadísticas finales
  const totalEstudiantes = estudiantes.size;
  const totalEvaluaciones = evaluaciones.size;
  const totalEvaluacionesCompletadas = evaluacionesCompletadas.size;
  const totalEvaluacionesPendientes = evaluacionesPendientes.size;
  const porcentajeCompletado = totalEvaluaciones > 0 ? 
    Math.round((totalEvaluacionesCompletadas / totalEvaluaciones) * 100 * 100) / 100 : 0;
  
  const totalDocentes = docentes.size;
  const totalDocentesEvaluados = docentesEvaluados.size;
  const porcentajeDocentesEvaluados = totalDocentes > 0 ? 
    Math.round((totalDocentesEvaluados / totalDocentes) * 100 * 100) / 100 : 0;
  
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

const getAspectosPromedio = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
    const pool = await getPool();
    const remotePool = await getRemotePool();
    
    // Construir condiciones WHERE dinámicamente para vista_academica_insitus
    const buildWhereClause = () => {
        let conditions = [];
        let params = [];
        
        // 1. PERIODO
        if (periodo) {
            conditions.push(`PERIODO = ?`);
            params.push(periodo);
        }
        
        // 2. NOMBRE_SEDE
        if (nombreSede) {
            conditions.push(`NOMBRE_SEDE = ?`);
            params.push(nombreSede);
        }
        
        // 3. NOM_PROGRAMA
        if (nomPrograma) {
            conditions.push(`NOM_PROGRAMA = ?`);
            params.push(nomPrograma);
        }
        
        // 4. SEMESTRE
        if (semestre) {
            conditions.push(`SEMESTRE = ?`);
            params.push(semestre);
        }
        
        // 5. GRUPO
        if (grupo) {
            conditions.push(`GRUPO = ?`);
            params.push(grupo);
        }
        
        return {
            clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
            params
        };
    };

    // Paso 1: Obtener datos filtrados de vista_academica_insitus (usando remotePool)
    const vistaWhere = buildWhereClause();
    const vistaQuery = `
        SELECT DISTINCT ID_ESTUDIANTE, COD_ASIGNATURA
        FROM vista_academica_insitus
        ${vistaWhere.clause}
    `;
    
    const [vistaData] = await remotePool.query(vistaQuery, vistaWhere.params);
    
    // Si no hay datos en vista_academica_insitus con los filtros, retornar array vacío
    if (vistaData.length === 0) {
        return [];
    }
    
    // Crear placeholders para la consulta IN
    const placeholders = vistaData.map(() => '(?, ?)').join(', ');
    const vistaParams = vistaData.flatMap(row => [row.ID_ESTUDIANTE, row.COD_ASIGNATURA]);
    
    // Paso 2: Consulta principal - PROMEDIO GENERAL POR ASPECTO (todos los docentes)
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
    
    // Construir parámetros para la consulta principal
    const mainParams = [
        idConfiguracion,  // Para la consulta principal (e.ID_CONFIGURACION)
        ...vistaParams    // Parámetros para la cláusula IN
    ];
    
    const [aspectos] = await pool.query(mainQuery, mainParams);
    return aspectos;
};

const getRankingDocentes = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  const pool = await getPool();
  const remotePool = await getRemotePool();

  try {
    // Construir condiciones WHERE dinámicamente
    const buildWhereClause = (alias = 'va') => {
      let conditions = [];
      let params = [];
      
      // 1. PERIODO
      if (periodo) {
        conditions.push(`${alias}.PERIODO = ?`);
        params.push(periodo);
      }
      
      // 2. NOMBRE_SEDE
      if (nombreSede) {
        conditions.push(`${alias}.NOMBRE_SEDE = ?`);
        params.push(nombreSede);
      }
      
      // 3. NOM_PROGRAMA
      if (nomPrograma) {
        conditions.push(`${alias}.NOM_PROGRAMA = ?`);
        params.push(nomPrograma);
      }
      
      // 4. SEMESTRE
      if (semestre) {
        conditions.push(`${alias}.SEMESTRE = ?`);
        params.push(semestre);
      }
      
      // 5. GRUPO
      if (grupo) {
        conditions.push(`${alias}.GRUPO = ?`);
        params.push(grupo);
      }
      
      return {
        clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
        params
      };
    };

    const vistaWhereClause = buildWhereClause('va');

    // 1. Obtener datos de vista_academica_insitus con filtros
    const vistaQuery = `
      SELECT 
        ID_DOCENTE, 
        DOCENTE, 
        ID_ESTUDIANTE,
        COD_ASIGNATURA,
        PERIODO,
        NOMBRE_SEDE, 
        NOM_PROGRAMA,
        SEMESTRE,
        GRUPO
      FROM vista_academica_insitus va
      ${vistaWhereClause.clause}
    `;

    console.log('Vista Query:', vistaQuery);
    console.log('Vista Params:', vistaWhereClause.params);

    const [vistaData] = await remotePool.query(vistaQuery, vistaWhereClause.params);

    if (vistaData.length === 0) {
      console.log('No se encontraron datos en vista_academica_insitus');
      return [];
    }

    console.log(`Se encontraron ${vistaData.length} registros en vista_academica_insitus`);

    // 2. Crear lista de estudiantes y asignaturas únicas para buscar evaluaciones
    const estudiantesAsignaturas = vistaData.map(row => ({
      estudiante: row.ID_ESTUDIANTE,
      asignatura: row.COD_ASIGNATURA
    }));

    // Eliminar duplicados
    const estudiantesAsignaturasUnicos = estudiantesAsignaturas.filter((item, index, self) =>
      index === self.findIndex(t => t.estudiante === item.estudiante && t.asignatura === item.asignatura)
    );

    console.log(`Combinaciones únicas estudiante-asignatura: ${estudiantesAsignaturasUnicos.length}`);

    // 3. Obtener evaluaciones existentes con sus puntajes
    if (estudiantesAsignaturasUnicos.length === 0) {
      return [];
    }

    const placeholders = estudiantesAsignaturasUnicos.map(() => '(?, ?)').join(', ');
    const evaluacionesParams = [];
    estudiantesAsignaturasUnicos.forEach(ea => {
      evaluacionesParams.push(ea.estudiante, ea.asignatura);
    });

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

    console.log('Evaluaciones Query:', evaluacionesQuery);
    const [evaluacionesData] = await pool.query(evaluacionesQuery, [idConfiguracion, ...evaluacionesParams]);
    console.log(`Se encontraron ${evaluacionesData.length} respuestas de evaluación`);

    // 4. Procesar datos y calcular métricas por docente
    const docentesMap = new Map();

    // Inicializar estructura de datos por docente
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
          puntajes: [], // Array para almacenar todos los puntajes del docente
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

    console.log('Docentes inicializados:', docentesMap.size);

    // Procesar evaluaciones realizadas y asociarlas con docentes
    evaluacionesData.forEach(eval => {
      const estudianteAsignatura = `${eval.DOCUMENTO_ESTUDIANTE}-${eval.CODIGO_MATERIA}`;
      
      // Buscar qué docente corresponde a esta combinación estudiante-asignatura
      for (let [docenteKey, docente] of docentesMap) {
        if (docente.estudiante_asignatura_docente.has(estudianteAsignatura)) {
          docente.evaluaciones_realizadas.add(estudianteAsignatura);
          docente.total_respuestas++;
          
          // Agregar puntaje al array si es válido
          const puntaje = parseFloat(eval.PUNTAJE);
          if (!isNaN(puntaje)) {
            docente.puntajes.push(puntaje);
          }
          
          break; // Solo debe pertenecer a un docente
        }
      }
    });

    // Debug: mostrar datos procesados
    for (let [key, docente] of docentesMap) {
      console.log(`Docente ${docente.DOCENTE}:`, {
        total_puntajes: docente.puntajes.length,
        total_respuestas: docente.total_respuestas,
        evaluaciones_esperadas: docente.evaluaciones_esperadas.size,
        evaluaciones_realizadas: docente.evaluaciones_realizadas.size
      });
    }

    // 5. Convertir a array y calcular métricas finales
    const ranking = Array.from(docentesMap.values())
      .map(docente => {
        const evaluaciones_esperadas = docente.evaluaciones_esperadas.size;
        const evaluaciones_realizadas = docente.evaluaciones_realizadas.size;
        const evaluaciones_pendientes = evaluaciones_esperadas - evaluaciones_realizadas;
        const total_estudiantes = docente.estudiantes.size;
        const total_asignaturas = docente.asignaturas.size;
        
        // Calcular promedio individual del docente: promedio de todos sus puntajes
        let promedio_general = 0.00;
        if (docente.puntajes.length > 0) {
          const suma_puntajes = docente.puntajes.reduce((sum, puntaje) => sum + puntaje, 0);
          promedio_general = parseFloat((suma_puntajes / docente.puntajes.length).toFixed(2));
        }
        
        // Calcular respuestas por estudiante
        const respuestas_por_estudiante = total_estudiantes > 0 
          ? parseFloat((docente.total_respuestas / total_estudiantes).toFixed(2))
          : 0;
        
        // Calcular eficiencia de respuestas (respuestas por evaluación realizada)
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
          PROMEDIO_GENERAL: promedio_general, // Promedio individual del docente
          TOTAL_RESPUESTAS: docente.total_respuestas,
          EVALUACIONES_ESPERADAS: evaluaciones_esperadas,
          EVALUACIONES_REALIZADAS: evaluaciones_realizadas,
          EVALUACIONES_PENDIENTES: evaluaciones_pendientes,
          RESPUESTAS_POR_ESTUDIANTE: respuestas_por_estudiante,
          EFICIENCIA_RESPUESTAS: eficiencia_respuestas
        };
      })
      .filter(docente => docente.TOTAL_RESPUESTAS > 0) // Solo docentes con respuestas > 0
      .sort((a, b) => {
        // Ordenar por PROMEDIO_GENERAL DESC, luego RESPUESTAS_POR_ESTUDIANTE DESC, luego ID_DOCENTE ASC
        if (b.PROMEDIO_GENERAL !== a.PROMEDIO_GENERAL) {
          return b.PROMEDIO_GENERAL - a.PROMEDIO_GENERAL;
        }
        if (b.RESPUESTAS_POR_ESTUDIANTE !== a.RESPUESTAS_POR_ESTUDIANTE) {
          return b.RESPUESTAS_POR_ESTUDIANTE - a.RESPUESTAS_POR_ESTUDIANTE;
        }
        return a.ID_DOCENTE - b.ID_DOCENTE;
      });

    console.log(`Ranking final: ${ranking.length} docentes`);
    return ranking;

  } catch (error) {
    console.error("Error al obtener el ranking de docentes: ", error);
    throw error;
  }
};

const getPodioDocentes = async ({ idConfiguracion, periodo, nombreSede, nomPrograma, semestre, grupo }) => {
  const pool = await getPool();
  const remotePool = await getRemotePool();

  try {
    // Construir condiciones WHERE dinámicamente
    const buildWhereClause = (alias = 'va') => {
      let conditions = [];
      let params = [];
      
      // 1. PERIODO
      if (periodo) {
        conditions.push(`${alias}.PERIODO = ?`);
        params.push(periodo);
      }
      
      // 2. NOMBRE_SEDE
      if (nombreSede) {
        conditions.push(`${alias}.NOMBRE_SEDE = ?`);
        params.push(nombreSede);
      }
      
      // 3. NOM_PROGRAMA
      if (nomPrograma) {
        conditions.push(`${alias}.NOM_PROGRAMA = ?`);
        params.push(nomPrograma);
      }
      
      // 4. SEMESTRE
      if (semestre) {
        conditions.push(`${alias}.SEMESTRE = ?`);
        params.push(semestre);
      }
      
      // 5. GRUPO
      if (grupo) {
        conditions.push(`${alias}.GRUPO = ?`);
        params.push(grupo);
      }
      
      return {
        clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
        params
      };
    };

    const vistaWhereClause = buildWhereClause('va');

    // 1. Obtener datos de vista_academica_insitus con filtros
    const vistaQuery = `
      SELECT 
        ID_DOCENTE, 
        DOCENTE, 
        ID_ESTUDIANTE,
        COD_ASIGNATURA,
        PERIODO,
        NOMBRE_SEDE, 
        NOM_PROGRAMA,
        SEMESTRE,
        GRUPO
      FROM vista_academica_insitus va
      ${vistaWhereClause.clause}
    `;

    console.log('Vista Query (Podio):', vistaQuery);
    const [vistaData] = await remotePool.query(vistaQuery, vistaWhereClause.params);

    if (vistaData.length === 0) {
      console.log('No se encontraron datos en vista_academica_insitus para podio');
      return [];
    }

    console.log(`Se encontraron ${vistaData.length} registros para podio`);

    // 2. Crear lista de estudiantes y asignaturas únicas para buscar evaluaciones
    const estudiantesAsignaturas = vistaData.map(row => ({
      estudiante: row.ID_ESTUDIANTE,
      asignatura: row.COD_ASIGNATURA
    }));

    // Eliminar duplicados
    const estudiantesAsignaturasUnicos = estudiantesAsignaturas.filter((item, index, self) =>
      index === self.findIndex(t => t.estudiante === item.estudiante && t.asignatura === item.asignatura)
    );

    // 3. Obtener evaluaciones existentes
    if (estudiantesAsignaturasUnicos.length === 0) {
      return [];
    }

    const placeholders = estudiantesAsignaturasUnicos.map(() => '(?, ?)').join(', ');
    const evaluacionesParams = [];
    estudiantesAsignaturasUnicos.forEach(ea => {
      evaluacionesParams.push(ea.estudiante, ea.asignatura);
    });

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

    const [evaluacionesData] = await pool.query(evaluacionesQuery, [idConfiguracion, ...evaluacionesParams]);
    console.log(`Se encontraron ${evaluacionesData.length} respuestas de evaluación (Podio)`);

    // 4. Procesar datos y calcular métricas por docente
    const docentesMap = new Map();

    // Inicializar estructura de datos por docente
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
          puntajes: [], // Array para almacenar todos los puntajes del docente
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

    // Procesar evaluaciones realizadas
    evaluacionesData.forEach(eval => {
      const estudianteAsignatura = `${eval.DOCUMENTO_ESTUDIANTE}-${eval.CODIGO_MATERIA}`;
      
      // Buscar qué docente corresponde a esta combinación estudiante-asignatura
      for (let [docenteKey, docente] of docentesMap) {
        if (docente.estudiante_asignatura_docente.has(estudianteAsignatura)) {
          docente.evaluaciones_realizadas.add(estudianteAsignatura);
          docente.total_respuestas++;
          
          // Agregar puntaje al array si es válido
          const puntaje = parseFloat(eval.PUNTAJE);
          if (!isNaN(puntaje)) {
            docente.puntajes.push(puntaje);
          }
          
          break;
        }
      }
    });

    // 5. Convertir a array y calcular métricas
    const docentes = Array.from(docentesMap.values())
      .map(docente => {
        const evaluaciones_esperadas = docente.evaluaciones_esperadas.size;
        const evaluaciones_realizadas = docente.evaluaciones_realizadas.size;
        const evaluaciones_pendientes = evaluaciones_esperadas - evaluaciones_realizadas;
        const total_estudiantes = docente.estudiantes.size;
        const total_asignaturas = docente.asignaturas.size;
        
        // Calcular promedio individual del docente: promedio de todos sus puntajes
        let promedio_general = 0.00;
        if (docente.puntajes.length > 0) {
          const suma_puntajes = docente.puntajes.reduce((sum, puntaje) => sum + puntaje, 0);
          promedio_general = parseFloat((suma_puntajes / docente.puntajes.length).toFixed(2));
        }

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
          TOTAL_RESPUESTAS: docente.total_respuestas,
          PROMEDIO_GENERAL: promedio_general, // Promedio individual del docente
          EVALUACIONES_ESPERADAS: evaluaciones_esperadas,
          EVALUACIONES_REALIZADAS: evaluaciones_realizadas,
          EVALUACIONES_PENDIENTES: evaluaciones_pendientes
        };
      })
      .filter(docente => docente.TOTAL_RESPUESTAS > 0);

    // 6. Crear podio (top 3 mejores y top 3 peores)
    if (docentes.length === 0) {
      console.log('No hay docentes con respuestas para crear podio');
      return [];
    }

    // Ordenar por promedio general (de mayor a menor)
    const ordenadosPorPromedio = [...docentes].sort((a, b) => {
      if (b.PROMEDIO_GENERAL !== a.PROMEDIO_GENERAL) {
        return b.PROMEDIO_GENERAL - a.PROMEDIO_GENERAL;
      }
      return a.ID_DOCENTE - b.ID_DOCENTE;
    });
    
    // Top 3 mejores
    const topMejores = ordenadosPorPromedio.slice(0, 3).map((docente, index) => ({
      ...docente,
      POSICION: `TOP ${index + 1} MEJOR`
    }));

    // Para los peores, tomar los últimos 3 (pero solo si hay más de 3 docentes)
    let topPeores = [];
    if (ordenadosPorPromedio.length > 3) {
      // Excluir los que ya están en top mejores
      const docentesParaPeores = ordenadosPorPromedio.filter(docente => 
        !topMejores.some(mejor => mejor.ID_DOCENTE === docente.ID_DOCENTE)
      );
      
      // Tomar los últimos 3 (peores promedios)
      topPeores = docentesParaPeores
        .slice(-3)
        .reverse() // Para mostrar del peor al menos peor
        .map((docente, index) => ({
          ...docente,
          POSICION: `TOP ${index + 1} PEOR`
        }));
    }

    const podio = [...topMejores, ...topPeores];
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
