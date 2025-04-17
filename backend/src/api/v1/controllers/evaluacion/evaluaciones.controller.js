const Evaluaciones = require('../../models/evaluacion/evaluaciones.model');
const VistaEstudianteModel = require('../../models/vista/vistaEstudiante.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');
const TiposEvaluacion = require('../../models/evaluacion/tiposEvaluaciones.model');

// Crear evaluación y evaluación detalle
const createEvaluacionU = async (req, res, next) => {
  try {    
    // Validar que el usuario esté autenticado
    if (!req.user) {
      return errorResponse(res, { 
        code: 401, 
        message: "Usuario no autenticado" 
      });
    }
    console.log('Contenido de req.user:', req.user);
    // Obtener información del perfil del estudiante
    const { username: DOCUMENTO_ESTUDIANTE } = req.user;
    const { tipoEvaluacionId } = req.body;
    
    // Validar que se proporcione el tipo de evaluación
    if (!tipoEvaluacionId) {
      return errorResponse(res, { 
        code: 400, 
        message: "El tipo de evaluación es requerido" 
      });
    }

    // Verificar que el tipo de evaluación existe y está activo
    const configuracionDetalles = await TiposEvaluacion.getConfiguracionDetalles(tipoEvaluacionId);
    if (!configuracionDetalles || !configuracionDetalles.configuracion.ACTIVO) {
      return errorResponse(res, { 
        code: 404, 
        message: "El tipo de evaluación no existe o no está activo" 
      });
    }

    // Verificar que estamos dentro del período de evaluación
    const fechaActual = new Date();
    const fechaInicio = new Date(configuracionDetalles.configuracion.FECHA_INICIO);
    const fechaFin = new Date(configuracionDetalles.configuracion.FECHA_FIN);

    if (fechaActual < fechaInicio || fechaActual > fechaFin) {
      return errorResponse(res, { 
        code: 400, 
        message: "La evaluación no está disponible en este momento" 
      });
    }

    const perfilEstudiante = await VistaEstudianteModel.getEstudianteByDocumento(DOCUMENTO_ESTUDIANTE);
    console.log('Datos de perfilEstudiante:', perfilEstudiante);
    if (!perfilEstudiante || perfilEstudiante.length === 0) {
      return errorResponse(res, { 
        code: 404, 
        message: "No se encontró información del perfil del estudiante" 
      });
    }

    let evaluacionesCreadas = [];
    
    for (let materia of perfilEstudiante) {
      const { 
        ASIGNATURA: NOMBRE_MATERIA, 
        DOCENTE: NOMBRE_DOCENTE, 
        ID_DOCENTE: DOCUMENTO_DOCENTE, 
        COD_ASIGNATURA 
      } = materia;

      // Validar que COD_ASIGNATURA no sea null o undefined
      if (!COD_ASIGNATURA) {
        console.warn(`Materia omitida porque COD_ASIGNATURA es null o undefined:`, materia);
        continue;
      }

      // Verificar si ya existe una evaluación para esta materia y configuración
      const evaluacionExistente = await Evaluaciones.findOne(
        tipoEvaluacionId,
        DOCUMENTO_ESTUDIANTE,
        COD_ASIGNATURA
      );

      if (evaluacionExistente && evaluacionExistente.length > 0) {
        continue;
      }

      // Crear la evaluación principal para esta materia
      const nuevaEvaluacion = await Evaluaciones.createEvaluacion({
        DOCUMENTO_ESTUDIANTE,
        DOCUMENTO_DOCENTE,
        CODIGO_MATERIA: COD_ASIGNATURA,
        ID_CONFIGURACION: tipoEvaluacionId,
      });

      evaluacionesCreadas.push({ 
        id: nuevaEvaluacion.id,
        materia: {
          codigo: COD_ASIGNATURA,
          nombre: NOMBRE_MATERIA
        },
        docente: {
          documento: DOCUMENTO_DOCENTE,
          nombre: NOMBRE_DOCENTE
        },
        estudiante: {
          documento: DOCUMENTO_ESTUDIANTE
        },
        configuracion: {
          id: tipoEvaluacionId
        }
      });
    }

    if (evaluacionesCreadas.length === 0) {
      return errorResponse(res, { 
        code: 400, 
        message: "No se pudieron crear nuevas evaluaciones. Posiblemente ya existan todas las evaluaciones necesarias." 
      });
    }

    successResponse(res, {
      code: 201,
      data: {
        total: evaluacionesCreadas.length,
        evaluaciones: evaluacionesCreadas,
        aspectos: configuracionDetalles.aspectos,
        valoraciones: configuracionDetalles.valoraciones
      },
      message: "Evaluaciones creadas exitosamente. Por favor, complete las evaluaciones con sus detalles.",
    });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    errorResponse(res, { 
      code: 500,
      message: MESSAGES.GENERAL.ERROR, 
      error: error.message 
    });
  }
};


// Obtener todas las evaluaciones
const getEvaluaciones = async (req, res, next) => {
  try {
    const evaluaciones = await Evaluaciones.getAllEvaluaciones();
    successResponse(res, { data: evaluaciones, message: MESSAGES.GENERAL.FETCH_SUCCESS });
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Obtener evaluación por ID
const getEvaluacionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evaluacion = await Evaluaciones.getEvaluacionById(id);
    if (!evaluacion) {
      return errorResponse(res, { code: 404, message: MESSAGES.GENERAL.NOT_FOUND });
    }
    successResponse(res, { data: evaluacion, message: MESSAGES.GENERAL.FETCH_SUCCESS });
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Evaluaciones por estudiante
const getEvaluacionesByEstudiante = async (req, res, next) => {
  try {
    const { documentoEstudiante } = req.params;
    const evaluaciones = await Evaluaciones.getEvaluacionesByEstudiante(documentoEstudiante);
    successResponse(res, { data: evaluaciones, message: MESSAGES.GENERAL.FETCH_SUCCESS });
  } catch (error) {
    console.error('Error al obtener evaluaciones del estudiante:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Evaluaciones por docente
const getEvaluacionesByDocente = async (req, res, next) => {
  try {
    const { documentoDocente } = req.params;
    const evaluaciones = await Evaluaciones.getEvaluacionesByDocente(documentoDocente);
    successResponse(res, { data: evaluaciones, message: MESSAGES.GENERAL.FETCH_SUCCESS });
  } catch (error) {
    console.error('Error al obtener evaluaciones del docente:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Crear evaluación
const createEvaluacion = async (req, res, next) => {
  try {
    const evaluacionData = req.body;
    const nuevaEvaluacion = await Evaluaciones.createEvaluacion(evaluacionData);
    successResponse(res, { data: nuevaEvaluacion, message: MESSAGES.GENERAL.CREATED });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Actualizar evaluación
const updateEvaluacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evaluacionData = req.body;
    const evaluacionActualizada = await Evaluaciones.updateEvaluacion(id, evaluacionData);
    successResponse(res, { data: evaluacionActualizada, message: MESSAGES.GENERAL.UPDATED });
  } catch (error) {
    console.error('Error al actualizar evaluación:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Eliminar evaluación
const deleteEvaluacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Evaluaciones.deleteEvaluacion(id);
    successResponse(res, { message: MESSAGES.GENERAL.DELETED });
  } catch (error) {
    console.error('Error al eliminar evaluación:', error);
    errorResponse(res, { message: MESSAGES.GENERAL.ERROR, error });
  }
};

// Obtener evaluaciones pendientes con sus aspectos y valoraciones
const getEvaluacionesPendientes = async (req, res, next) => {
  try {
    // Validar que el usuario esté autenticado
    if (!req.user) {
      return errorResponse(res, { 
        code: 401, 
        message: "Usuario no autenticado" 
      });
    }

    const { documento: DOCUMENTO_ESTUDIANTE } = req.user;
    
    // 1. Obtener el perfil del estudiante
    const perfilEstudiante = await VistaEstudianteModel.getEstudianteByDocumento(DOCUMENTO_ESTUDIANTE);
    
    if (!perfilEstudiante || perfilEstudiante.length === 0) {
      return errorResponse(res, { 
        code: 404, 
        message: "No se encontró información del perfil del estudiante" 
      });
    }

    // 2. Obtener todas las evaluaciones existentes del estudiante
    const evaluacionesEstudiante = await Evaluaciones.getEvaluacionesByEstudiante(DOCUMENTO_ESTUDIANTE);

    // 3. Obtener tipos de evaluación activos
    const tiposEvaluacion = await TiposEvaluacion.getAllTipos();
    const tiposActivos = tiposEvaluacion.filter(tipo => tipo.ACTIVO);

    // 4. Preparar respuesta
    const estadoEvaluaciones = {};

    for (const tipo of tiposActivos) {
      try {
        // Obtener configuración del tipo de evaluación
        const configuracion = await TiposEvaluacion.getConfiguracionDetalles(tipo.ID);
        
        if (configuracion && configuracion.configuracion.ACTIVO) {
          // Verificar si hay evaluaciones para este tipo
          const evaluacionesDeTipo = evaluacionesEstudiante.filter(
            eval => eval.CONFIGURACION_ID === tipo.ID
          );

          // Verificar período de evaluación
          const fechaActual = new Date();
          const fechaInicio = new Date(configuracion.configuracion.FECHA_INICIO);
          const fechaFin = new Date(configuracion.configuracion.FECHA_FIN);
          const periodoValido = fechaActual >= fechaInicio && fechaActual <= fechaFin;

          estadoEvaluaciones[tipo.NOMBRE.toLowerCase()] = {
            id: tipo.ID,
            nombre: tipo.NOMBRE,
            descripcion: tipo.DESCRIPCION,
            configuracion: {
              ...configuracion.configuracion,
              periodoValido,
              fechaInicio: fechaInicio.toISOString(),
              fechaFin: fechaFin.toISOString()
            },
            estado: {
              evaluacionesCreadas: evaluacionesDeTipo.length > 0,
              totalMaterias: perfilEstudiante.length,
              materiasEvaluadas: evaluacionesDeTipo.length,
              materiasPendientes: perfilEstudiante.length - evaluacionesDeTipo.length,
              completado: evaluacionesDeTipo.length === perfilEstudiante.length
            },
            siguientePaso: evaluacionesDeTipo.length === 0 ? 'CREAR_EVALUACIONES' : 'COMPLETAR_DETALLES'
          };
        }
      } catch (error) {
        console.log(`Error al procesar tipo de evaluación ${tipo.NOMBRE}:`, error);
      }
    }

    successResponse(res, {
      data: {
        tiposEvaluacion: estadoEvaluaciones,
        perfilEstudiante: {
          documento: DOCUMENTO_ESTUDIANTE,
          totalMaterias: perfilEstudiante.length,
          materias: perfilEstudiante.map(m => ({
            codigo: m.COD_ASIGNATURA,
            nombre: m.NOMBRE_MATERIA,
            docente: {
              documento: m.DOCUMENTO_DOCENTE,
              nombre: m.NOMBRE_DOCENTE
            }
          }))
        }
      },
      message: "Estado de evaluaciones obtenido exitosamente"
    });

  } catch (error) {
    console.error('Error al obtener evaluaciones pendientes:', error);
    errorResponse(res, { 
      code: 500,
      message: MESSAGES.GENERAL.ERROR, 
      error: error.message 
    });
  }
};

// Iniciar proceso de evaluación
const iniciarProcesoEvaluacion = async (req, res, next) => {
  try {
    // Validar que el usuario esté autenticado
    if (!req.user) {
      return errorResponse(res, { 
        code: 401, 
        message: "Usuario no autenticado" 
      });
    }

    const { tipoEvaluacionId } = req.params;
    
    // 1. Verificar que el tipo de evaluación existe y está activo
    const configuracionDetalles = await TiposEvaluacion.getConfiguracionDetalles(tipoEvaluacionId);
    
    if (!configuracionDetalles || !configuracionDetalles.configuracion.ACTIVO) {
      return errorResponse(res, { 
        code: 404, 
        message: "El tipo de evaluación no existe o no está activo" 
      });
    }

    // 2. Verificar que estamos dentro del período de evaluación
    const fechaActual = new Date();
    const fechaInicio = new Date(configuracionDetalles.configuracion.FECHA_INICIO);
    const fechaFin = new Date(configuracionDetalles.configuracion.FECHA_FIN);

    if (fechaActual < fechaInicio || fechaActual > fechaFin) {
      return errorResponse(res, { 
        code: 400, 
        message: "La evaluación no está disponible en este momento" 
      });
    }

    // 3. Obtener información del estudiante
    const { documento: DOCUMENTO_ESTUDIANTE } = req.user;
    const perfilEstudiante = await VistaEstudianteModel.getEstudianteByDocumento(DOCUMENTO_ESTUDIANTE);
    
    if (!perfilEstudiante || perfilEstudiante.length === 0) {
      return errorResponse(res, { 
        code: 404, 
        message: "No se encontró información del perfil del estudiante" 
      });
    }

    // 4. Verificar materias pendientes
    const materiasPendientes = [];
    for (let materia of perfilEstudiante) {
      const evaluacionExistente = await Evaluaciones.findOne(
        tipoEvaluacionId,
        DOCUMENTO_ESTUDIANTE,
        materia.COD_ASIGNATURA
      );

      if (!evaluacionExistente || evaluacionExistente.length === 0) {
        materiasPendientes.push({
          materia: {
            codigo: materia.COD_ASIGNATURA,
            nombre: materia.NOMBRE_MATERIA
          },
          docente: {
            documento: materia.DOCUMENTO_DOCENTE,
            nombre: materia.NOMBRE_DOCENTE
          }
        });
      }
    }

    if (materiasPendientes.length === 0) {
      return errorResponse(res, { 
        code: 400, 
        message: "Ya has completado todas las evaluaciones para este tipo" 
      });
    }

    // 5. Devolver información necesaria para comenzar
    successResponse(res, {
      data: {
        tipoEvaluacion: {
          id: parseInt(tipoEvaluacionId),
          nombre: configuracionDetalles.configuracion.NOMBRE,
          configuracion: configuracionDetalles.configuracion,
          aspectos: configuracionDetalles.aspectos,
          valoraciones: configuracionDetalles.valoraciones
        },
        materiasPendientes,
        totalPendientes: materiasPendientes.length
      },
      message: "Puede proceder con la evaluación"
    });

  } catch (error) {
    console.error('Error al iniciar proceso de evaluación:', error);
    errorResponse(res, { 
      code: 500,
      message: MESSAGES.GENERAL.ERROR, 
      error: error.message 
    });
  }
};

module.exports = {
  getEvaluaciones,
  getEvaluacionById,
  getEvaluacionesByEstudiante,
  getEvaluacionesByDocente,
  createEvaluacion,
  updateEvaluacion,
  deleteEvaluacion,
  createEvaluacionU,
  getEvaluacionesPendientes,
  iniciarProcesoEvaluacion
};
