const Evaluaciones = require('../../models/evaluacion/evaluaciones.model');
const VistaEstudianteModel = require('../../models/vista/vistaEstudiante.model');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const MESSAGES = require('../../../../constants/messages');

// Crear evaluación y evaluación detalle
const createEvaluacionU = async (req, res, next) => {
  try {    
    // Validar que el usuario esté autenticado
    if (!req.user) {
      console.log('Error: Usuario no autenticado - req.user es null o undefined');
      return errorResponse(res, { 
        code: 401, 
        message: "Usuario no autenticado" 
      });
    }

    // Obtener información del perfil del estudiante
    const { documento: DOCUMENTO_ESTUDIANTE } = req.user;
    console.log('2. Obteniendo información del perfil para el documento:', DOCUMENTO_ESTUDIANTE);
    
    const perfilEstudiante = await VistaEstudianteModel.getEstudianteByDocumento(DOCUMENTO_ESTUDIANTE);
    console.log('3. Perfil del estudiante:', JSON.stringify(perfilEstudiante, null, 2));

    if (!perfilEstudiante || perfilEstudiante.length === 0) {
      console.log('Error: No se encontró información del perfil del estudiante');
      return errorResponse(res, { 
        code: 404, 
        message: "No se encontró información del perfil del estudiante" 
      });
    }

    // Configuración por defecto
    const ID_CONFIGURACION = 1;
    const { COMENTARIO_GENERAL } = req.body;
    console.log('4. ID Configuración:', ID_CONFIGURACION);
    console.log('5. Comentario General:', COMENTARIO_GENERAL);

    // Validar que se proporcione un comentario general
    if (!COMENTARIO_GENERAL) {
      console.log('Error: No se proporcionó comentario general');
      return errorResponse(res, { 
        code: 400, 
        message: "El comentario general es requerido" 
      });
    }
    let evaluacionesCreadas = [];
    
    console.log('8. Iniciando creación de evaluaciones por materia...');
    for (let materia of perfilEstudiante) {
      const { NOMBRE_MATERIA, NOMBRE_DOCENTE, DOCUMENTO_DOCENTE, CODIGO_MATERIA } = materia;
      console.log('\nProcesando materia:', NOMBRE_MATERIA);
      console.log('Codigo materia:', CODIGO_MATERIA);
      console.log('Docente:', NOMBRE_DOCENTE);
      console.log('Documento docente:', DOCUMENTO_DOCENTE);
      console.log('ID Configuración:', ID_CONFIGURACION);

      // Verificar si ya existe una evaluación para esta materia y configuración para el estudiante
      console.log('Verificando si existe evaluación previa...');
      const evaluacionExistente = await Evaluaciones.findOne(
        ID_CONFIGURACION,
        DOCUMENTO_ESTUDIANTE,
        CODIGO_MATERIA
      );

      if (evaluacionExistente && evaluacionExistente.length > 0) {
        console.log(`La evaluación para la materia ${NOMBRE_MATERIA} ya existe`);
        continue;
      }

      // Crear la evaluación principal para esta materia
      console.log('Creando nueva evaluación...');
      const nuevaEvaluacion = await Evaluaciones.createEvaluacion({
        DOCUMENTO_ESTUDIANTE,
        DOCUMENTO_DOCENTE,
        CODIGO_MATERIA,
        CONFIGURACION_ID: ID_CONFIGURACION,
      });
      console.log('Evaluación creada:', nuevaEvaluacion);

      evaluacionesCreadas.push({ 
        id: nuevaEvaluacion.id,
        materia: {
          codigo: CODIGO_MATERIA,
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
          id: ID_CONFIGURACION
        }
      });
      console.log('Evaluación agregada a la lista de creadas');
    }

    if (evaluacionesCreadas.length === 0) {
      console.log('Error: No se crearon nuevas evaluaciones');
      return errorResponse(res, { 
        code: 400, 
        message: "No se pudieron crear nuevas evaluaciones. Posiblemente ya existan todas las evaluaciones necesarias." 
      });
    }

    console.log('9. Total de evaluaciones creadas:', evaluacionesCreadas.length);
    console.log('10. Respuesta final:', JSON.stringify(evaluacionesCreadas, null, 2));
    console.log('=== FIN DE CREATE EVALUACION U ===');

    successResponse(res, {
      code: 201,
      data: {
        total: evaluacionesCreadas.length,
        evaluaciones: evaluacionesCreadas
      },
      message: "Evaluaciones creadas exitosamente. Por favor, complete las evaluaciones con sus detalles.",
    });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    console.error('Stack trace:', error.stack);
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

module.exports = {
  getEvaluaciones,
  getEvaluacionById,
  getEvaluacionesByEstudiante,
  getEvaluacionesByDocente,
  createEvaluacion,
  updateEvaluacion,
  deleteEvaluacion,
  createEvaluacionU
};
