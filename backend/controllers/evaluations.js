const { pool } = require('../config/database');

/**
 * Get pending evaluations for dashboard
 * Returns different evaluations based on user role
 */
const getDashboardEvaluations = async (req, res) => {
  try {
    let query;
    let params = [];
    
    // Different query based on user role
    if (req.user.rol === 'evaluador') {
      // For evaluators, get their assigned evaluations
      query = `
        SELECT a.id AS id_asignacion, p.nombre AS programa, pe.nombre AS periodo,
          u.nombre_completo AS profesor, m.nombre AS materia, a.grupo,
          e.id AS id_evaluacion, e.estado
        FROM asignaciones a
        JOIN docentes d ON a.id_docente = d.id
        JOIN usuarios u ON d.id_usuario = u.id
        JOIN materias m ON a.id_materia = m.id
        JOIN programas p ON m.id_programa = p.id
        JOIN periodos pe ON a.id_periodo = pe.id
        LEFT JOIN evaluaciones e ON a.id = e.id_asignacion AND e.id_evaluador = ?
        WHERE pe.activo = TRUE
        ORDER BY e.estado IS NULL DESC, pe.fecha_inicio DESC
      `;
      params = [req.user.id];
    } else if (req.user.rol === 'docente') {
      // For teachers, get evaluations about them
      query = `
        SELECT a.id AS id_asignacion, p.nombre AS programa, pe.nombre AS periodo,
          m.nombre AS materia, a.grupo, e.id AS id_evaluacion, e.estado,
          ev.nombre_completo AS evaluador, e.fecha_evaluacion
        FROM docentes d
        JOIN usuarios u ON d.id_usuario = u.id
        JOIN asignaciones a ON d.id = a.id_docente
        JOIN materias m ON a.id_materia = m.id
        JOIN programas p ON m.id_programa = p.id
        JOIN periodos pe ON a.id_periodo = pe.id
        LEFT JOIN evaluaciones e ON a.id = e.id_asignacion
        LEFT JOIN usuarios ev ON e.id_evaluador = ev.id
        WHERE u.id = ? AND pe.activo = TRUE
        ORDER BY e.estado, pe.fecha_inicio DESC
      `;
      params = [req.user.id];
    } else if (req.user.rol === 'admin') {
      // For admins, get all evaluations
      query = `
        SELECT a.id AS id_asignacion, p.nombre AS programa, pe.nombre AS periodo,
          u.nombre_completo AS profesor, m.nombre AS materia, a.grupo,
          e.id AS id_evaluacion, e.estado, ev.nombre_completo AS evaluador,
          e.fecha_evaluacion
        FROM asignaciones a
        JOIN docentes d ON a.id_docente = d.id
        JOIN usuarios u ON d.id_usuario = u.id
        JOIN materias m ON a.id_materia = m.id
        JOIN programas p ON m.id_programa = p.id
        JOIN periodos pe ON a.id_periodo = pe.id
        LEFT JOIN evaluaciones e ON a.id = e.id_asignacion
        LEFT JOIN usuarios ev ON e.id_evaluador = ev.id
        WHERE pe.activo = TRUE
        ORDER BY e.estado, pe.fecha_inicio DESC
      `;
    }
    
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Initialize evaluation
 * Creates a new evaluation for an assignment
 */
const initializeEvaluation = async (req, res) => {
  const { id_asignacion } = req.body;
  
  // Validate role
  if (req.user.rol !== 'evaluador' && req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'No autorizado' });
  }
  
  try {
    // Check if assignment exists
    const [assignments] = await pool.execute(
      'SELECT * FROM asignaciones WHERE id = ?',
      [id_asignacion]
    );
    
    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }
    
    // Check if evaluation already exists
    const [existingEval] = await pool.execute(
      'SELECT * FROM evaluaciones WHERE id_asignacion = ? AND id_evaluador = ?',
      [id_asignacion, req.user.id]
    );
    
    if (existingEval.length > 0) {
      return res.json({
        message: 'Evaluación ya iniciada',
        id_evaluacion: existingEval[0].id
      });
    }
    
    // Create new evaluation
    const [result] = await pool.execute(
      'INSERT INTO evaluaciones (id_asignacion, id_evaluador, estado) VALUES (?, ?, "borrador")',
      [id_asignacion, req.user.id]
    );
    
    // Log activity
    await pool.execute(
      'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.id, 'crear_evaluacion', `Evaluación iniciada para asignación ${id_asignacion}`, req.ip]
    );
    
    res.json({
      message: 'Evaluación iniciada correctamente',
      id_evaluacion: result.insertId
    });
  } catch (error) {
    console.error('Error al iniciar evaluación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Get evaluation details
 * Returns the details of a specific evaluation
 */
const getEvaluationDetails = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get basic evaluation info
    const [evaluations] = await pool.execute(`
      SELECT e.*, a.id_docente, a.id_materia, a.id_periodo, a.grupo,
        p.nombre AS programa, pe.nombre AS periodo,
        u.nombre_completo AS profesor, m.nombre AS materia
      FROM evaluaciones e
      JOIN asignaciones a ON e.id_asignacion = a.id
      JOIN docentes d ON a.id_docente = d.id
      JOIN usuarios u ON d.id_usuario = u.id
      JOIN materias m ON a.id_materia = m.id
      JOIN programas p ON m.id_programa = p.id
      JOIN periodos pe ON a.id_periodo = pe.id
      WHERE e.id = ?
    `, [id]);
    
    if (evaluations.length === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }
    
    const evaluation = evaluations[0];
    
    // Check permissions
    if (req.user.rol !== 'admin' && req.user.id !== evaluation.id_evaluador) {
      return res.status(403).json({ message: 'No autorizado para ver esta evaluación' });
    }
    
    // Get valoraciones
    const [valoraciones] = await pool.execute(`
      SELECT v.id_aspecto, v.valor, v.comentario, a.nombre AS aspecto_nombre
      FROM valoraciones v
      JOIN aspectos_evaluacion a ON v.id_aspecto = a.id
      WHERE v.id_evaluacion = ?
    `, [id]);
    
    evaluation.valoraciones = valoraciones;
    
    res.json(evaluation);
  } catch (error) {
    console.error('Error al obtener evaluación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Get aspects and scale
 * Returns the evaluation aspects and rating scale
 */
const getAspectsAndScale = async (req, res) => {
  try {
    const [aspectos] = await pool.execute(
      'SELECT * FROM aspectos_evaluacion WHERE activo = TRUE ORDER BY orden'
    );
    
    const [escala] = await pool.execute(
      'SELECT * FROM escala_valoracion WHERE activo = TRUE ORDER BY orden'
    );
    
    res.json({ aspectos, escala });
  } catch (error) {
    console.error('Error al obtener aspectos:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Save or update evaluation
 * Updates an evaluation with new values
 */
const saveEvaluation = async (req, res) => {
  const { id } = req.params;
  const { valoraciones, comentarios_generales } = req.body;
  
  try {
    // Get evaluation to check ownership and status
    const [evaluations] = await pool.execute(
      'SELECT * FROM evaluaciones WHERE id = ?',
      [id]
    );
    
    if (evaluations.length === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }
    
    const evaluation = evaluations[0];
    
    // Check permissions
    if (req.user.rol !== 'admin' && req.user.id !== evaluation.id_evaluador) {
      return res.status(403).json({ message: 'No autorizado para modificar esta evaluación' });
    }
    
    // Check if can be edited
    if (evaluation.estado !== 'borrador') {
      return res.status(400).json({ message: 'No se puede modificar una evaluación enviada' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update general comments
      await connection.execute(
        'UPDATE evaluaciones SET comentarios_generales = ? WHERE id = ?',
        [comentarios_generales, id]
      );
      
      // Process valoraciones
      if (valoraciones && valoraciones.length > 0) {
        for (const val of valoraciones) {
          // Check if valoración exists
          const [existing] = await connection.execute(
            'SELECT * FROM valoraciones WHERE id_evaluacion = ? AND id_aspecto = ?',
            [id, val.id_aspecto]
          );
          
          if (existing.length > 0) {
            // Update existing
            await connection.execute(
              'UPDATE valoraciones SET valor = ?, comentario = ? WHERE id_evaluacion = ? AND id_aspecto = ?',
              [val.valor, val.comentario, id, val.id_aspecto]
            );
          } else {
            // Create new
            await connection.execute(
              'INSERT INTO valoraciones (id_evaluacion, id_aspecto, valor, comentario) VALUES (?, ?, ?, ?)',
              [id, val.id_aspecto, val.valor, val.comentario]
            );
          }
        }
      }
      
      // Log activity
      await connection.execute(
        'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
        [req.user.id, 'actualizar_evaluacion', `Actualización de evaluación ID: ${id}`, req.ip]
      );
      
      await connection.commit();
      res.json({ message: 'Evaluación guardada correctamente' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al guardar evaluación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

/**
 * Submit evaluation
 * Changes the status of an evaluation from draft to submitted
 */
const submitEvaluation = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get evaluation to check ownership and status
    const [evaluations] = await pool.execute(
      'SELECT * FROM evaluaciones WHERE id = ?',
      [id]
    );
    
    if (evaluations.length === 0) {
      return res.status(404).json({ message: 'Evaluación no encontrada' });
    }
    
    const evaluation = evaluations[0];
    
    // Check permissions
    if (req.user.rol !== 'admin' && req.user.id !== evaluation.id_evaluador) {
      return res.status(403).json({ message: 'No autorizado para enviar esta evaluación' });
    }
    
    // Check if can be submitted
    if (evaluation.estado !== 'borrador') {
      return res.status(400).json({ message: 'Solo se pueden enviar evaluaciones en estado borrador' });
    }
    
    // Verify all required aspects have been evaluated
    const [aspectos] = await pool.execute(
      'SELECT COUNT(*) as total FROM aspectos_evaluacion WHERE activo = TRUE'
    );
    
    const [valoraciones] = await pool.execute(
      'SELECT COUNT(*) as total FROM valoraciones WHERE id_evaluacion = ?',
      [id]
    );
    
    if (valoraciones[0].total < aspectos[0].total) {
      return res.status(400).json({ 
        message: 'Faltan aspectos por evaluar',
        evaluados: valoraciones[0].total,
        requeridos: aspectos[0].total
      });
    }
    
    // Verify at least one comment exists
    const [comentarios] = await pool.execute(`
      SELECT COUNT(*) as total FROM valoraciones 
      WHERE id_evaluacion = ? AND comentario IS NOT NULL AND comentario != ''
    `, [id]);
    
    if (comentarios[0].total === 0 && (!evaluation.comentarios_generales || evaluation.comentarios_generales.trim() === '')) {
      return res.status(400).json({ 
        message: 'Debes incluir al menos un comentario cualitativo en algún aspecto o en la valoración general'
      });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update status
      await connection.execute(
        'UPDATE evaluaciones SET estado = "enviada" WHERE id = ?',
        [id]
      );
      
      // Register state change
      await connection.execute(`
        INSERT INTO historico_estados_evaluacion 
        (id_evaluacion, estado_anterior, estado_nuevo, id_usuario_cambio) 
        VALUES (?, "borrador", "enviada", ?)
      `, [id, req.user.id]);
      
      // Create notification for the teacher
      await connection.execute(`
        INSERT INTO notificaciones (id_usuario, tipo, mensaje)
        SELECT d.id_usuario, 'nueva_evaluacion', 'Se ha completado una nueva evaluación para uno de sus cursos'
        FROM evaluaciones e
        JOIN asignaciones a ON e.id_asignacion = a.id
        JOIN docentes d ON a.id_docente = d.id
        WHERE e.id = ?
      `, [id]);
      
      // Log activity
      await connection.execute(
        'INSERT INTO registro_actividades (id_usuario, tipo_actividad, descripcion, ip_address) VALUES (?, ?, ?, ?)',
        [req.user.id, 'enviar_evaluacion', `Evaluación enviada ID: ${id}`, req.ip]
      );
      
      await connection.commit();
      res.json({ message: 'Evaluación enviada correctamente' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al enviar evaluación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getDashboardEvaluations,
  initializeEvaluation,
  getEvaluationDetails,
  getAspectsAndScale,
  saveEvaluation,
  submitEvaluation
};